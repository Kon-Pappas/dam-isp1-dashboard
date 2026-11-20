"""Reads the full HEnEx DAM "Results" file (not the smaller "PrelimResults")."""
import numpy as np
import pandas as pd

from .config import COUNTRIES

REQUIRED = ["SIDE_DESCR", "ASSET_DESCR", "CLASSIFICATION", "DELIVERY_MTU",
            "SORT", "MCP", "TOTAL_TRADES", "PUB_TIME", "VER"]


class ParseError(Exception):
    pass


def parse_dam(path):
    df = pd.read_excel(path, engine="openpyxl")
    missing = [c for c in REQUIRED if c not in df.columns]
    if missing:
        raise ParseError(f"not the full DAM Results file, missing columns: {missing}")
    df["SORT"] = df["SORT"].astype(int)
    n = int(df["SORT"].max())
    if sorted(df["SORT"].unique().tolist()) != list(range(1, n + 1)):
        raise ParseError("SORT is not a continuous 1..n sequence")
    if n % 4:
        raise ParseError(f"interval count {n} is not a multiple of 4")
    mtu = (pd.to_datetime(df.drop_duplicates("SORT").sort_values("SORT")["DELIVERY_MTU"])
           .dt.floor("s").dt.to_pydatetime().tolist())
    warnings = []

    g = df.groupby("SORT")["MCP"]
    if float((g.max() - g.min()).max()) > 1e-6:
        warnings.append("MCP differs between rows of the same interval")
    mcp = g.first().reindex(range(1, n + 1)).to_numpy(float)

    def series(side, cls, asset=None, zero=True):
        """zero=True: a technology that has always existed in the DAM; no row means no trade (0).
        zero=False: a category that entered the market later (storage); no row means null."""
        m = (df["SIDE_DESCR"] == side) & (df["CLASSIFICATION"] == cls)
        if asset is not None:
            m &= df["ASSET_DESCR"] == asset
        if not m.any():
            return np.zeros(n) if zero else None
        return (df[m].groupby("SORT")["TOTAL_TRADES"].sum()
                .reindex(range(1, n + 1)).fillna(0.0).to_numpy(float))

    imports, exports = {}, {}
    for k in COUNTRIES:
        imports[k] = series("Sell", "Imports", f"{k}-GR")
        exports[k] = series("Buy", "Exports", f"GR-{k}")
    known = {f"{k}-GR" for k in COUNTRIES} | {f"GR-{k}" for k in COUNTRIES}
    for cls in ("Imports", "Exports"):
        extra = set(df.loc[df["CLASSIFICATION"] == cls, "ASSET_DESCR"]) - known
        if extra:
            warnings.append(f"unknown interconnection codes in {cls}: {sorted(extra)}")

    buy = df[df["SIDE_DESCR"] == "Buy"].groupby("SORT")["TOTAL_TRADES"].sum().reindex(range(1, n + 1)).fillna(0)
    sell = df[df["SIDE_DESCR"] == "Sell"].groupby("SORT")["TOTAL_TRADES"].sum().reindex(range(1, n + 1)).fillna(0)
    imbalance = float((buy - sell).abs().max())

    load_parts = [series("Buy", c) for c in ("HV", "MV", "LV", "LOSSES")]
    load = None
    if any(p is not None for p in load_parts):
        load = sum(p for p in load_parts if p is not None)

    return {
        "n": n,
        "mtu": mtu,
        "mcp": mcp,
        "load": load,
        "lignite": series("Sell", "Lignite"),
        "gas": series("Sell", "Natural Gas"),
        "hydro": series("Sell", "Big Hydro"),
        "res": series("Sell", "RES"),
        "crete_res": series("Sell", "CRETE RENEWABLES"),
        "crete_conv": series("Sell", "CRETE CONVENTIONAL"),
        "crete_load": series("Buy", "CRETE LOAD"),
        "pump": series("Buy", "PUMP"),
        "storage_sell": series("Sell", "Storage", zero=False),
        "storage_buy": series("Buy", "Storage", zero=False),
        "imports": imports,
        "exports": exports,
        "classes": sorted({f"{s}/{c}" for s, c in zip(df["SIDE_DESCR"], df["CLASSIFICATION"])}),
        "imbalance_mw": imbalance,
        "pub_time": str(df["PUB_TIME"].iloc[0]),
        "ver": int(df["VER"].iloc[0]),
        "warnings": warnings,
    }
