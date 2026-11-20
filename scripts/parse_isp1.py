"""Reads the ADMIE ISP1 results workbook (first sheet, one column per interval).

Rows are found by their label, never by position: the number of rows and the
unit names change from day to day (new BESS, renamed RES units).
"""
import re

import numpy as np
import pandas as pd

from .config import ISP_COUNTRY
from .parse_dam import ParseError


def _num(row, n):
    return np.nan_to_num(pd.to_numeric(row.iloc[1:n + 1], errors="coerce").to_numpy(float))


def parse_isp1(path, registry):
    raw = pd.read_excel(path, sheet_name=0, header=None, engine="openpyxl")
    lab = [str(x) for x in raw[0].tolist()]
    head = raw.iloc[1, 1:].tolist()
    times = [pd.Timestamp(x).floor("s").to_pydatetime() for x in head if not isinstance(x, str) and pd.notna(x)]
    n = len(times)
    if n < 92:
        raise ParseError(f"ISP1 header has only {n} intervals")
    meta = re.search(r"ISP(\d)_(\d{4}-\d{2}-\d{2})_(\d{14})", str(raw.iloc[0, 2]))
    warnings = []

    def first(label, start=0):
        try:
            return lab.index(label, start)
        except ValueError:
            return None

    def rowvals(label, which="first"):
        idxs = [i for i, l in enumerate(lab) if l == label]
        if not idxs:
            return None
        i = idxs[0] if which == "first" else idxs[-1]
        return _num(raw.iloc[i], n)

    # --- thermal units ---------------------------------------------------
    i_tot = first("Total Thermal Production")
    if i_tot is None:
        raise ParseError("row 'Total Thermal Production' not found")
    i_head = max(i for i in range(i_tot) if lab[i] == "Thermal Units")
    units = {lab[i]: _num(raw.iloc[i], n) for i in range(i_head + 1, i_tot)}
    lignite = np.zeros(n)
    gas = np.zeros(n)
    unmapped = np.zeros(n)
    unit_fuel, unknown = {}, []
    for name, arr in units.items():
        info = registry.get(name)
        if info is None:
            unknown.append(name)
            unit_fuel[name] = "unmapped"
            unmapped += arr
        elif info["fuel"] == "lignite":
            unit_fuel[name] = "lignite"
            lignite += arr
        else:
            unit_fuel[name] = "gas"
            gas += arr
    if unknown:
        warnings.append(f"thermal units missing from config/units.json: {unknown}")
    thermal_total = _num(raw.iloc[i_tot], n)
    thermal_gap = float(np.abs(lignite + gas + unmapped - thermal_total).max())

    # --- borders ---------------------------------------------------------
    def block(start_label, end_label):
        a, b = first(start_label), first(end_label)
        if a is None or b is None:
            return None, None
        out = {}
        for i in range(a + 1, b):
            out[lab[i]] = _num(raw.iloc[i], n)
        return out, _num(raw.iloc[b], n)

    mkt_rows, mkt_total = block("Total Market CBS (+XBID)", "Total Market Schedules")
    auc_rows, auc_total = block("Auction CBS (DAM+CRIDAs)", "Aggregated Auction Schedules")
    if mkt_rows is None:
        raise ParseError("Total Market CBS block not found")
    border = {ISP_COUNTRY[k]: v for k, v in mkt_rows.items() if k in ISP_COUNTRY}
    auction = {ISP_COUNTRY[k]: v for k, v in (auc_rows or {}).items() if k in ISP_COUNTRY}
    virtual_crete = mkt_rows.get("VIRTUAL_CRETE")
    auction_crete = (auc_rows or {}).get("VIRTUAL_CRETE")
    extra = set(mkt_rows) - set(ISP_COUNTRY) - {"VIRTUAL_CRETE"}
    if extra:
        warnings.append(f"unknown rows in Total Market CBS: {sorted(extra)}")
    cbs_gap = float(np.abs(sum(mkt_rows.values()) - mkt_total).max())

    # --- other totals ----------------------------------------------------
    es = None
    for i, l in enumerate(lab):
        if l == "Energy Surplus":
            v = pd.to_numeric(raw.iloc[i, 1:n + 1], errors="coerce")
            if v.notna().any():
                es = np.nan_to_num(v.to_numpy(float))
                break
    surplus = None if es is None else -np.minimum(es, 0.0)   # surplus is stored negative
    pump_row = rowvals("Total Dispatchable Load", "last")
    pump = None if pump_row is None else -np.minimum(pump_row, 0.0)

    return {
        "n": n,
        "times": times,
        "isp": meta.group(1) if meta else None,
        "calc_stamp": meta.group(3) if meta else None,
        "units": units,
        "unit_fuel": unit_fuel,
        "lignite": lignite,
        "gas": gas,
        "unmapped": unmapped if unknown else None,
        "hydro": rowvals("Total Hydro Production"),
        "res": rowvals("Renewables"),
        "load": rowvals("System Load+Losses"),
        "storage_net": rowvals("Total Storage Production"),
        "pump": pump,
        "surplus": surplus,
        "border": border,
        "auction": auction,
        "virtual_crete": virtual_crete,
        "auction_crete": auction_crete,
        "auction_total": auc_total,
        "market_total": mkt_total,
        "thermal_gap_mw": thermal_gap,
        "cbs_gap_mw": cbs_gap,
        "warnings": warnings,
    }
