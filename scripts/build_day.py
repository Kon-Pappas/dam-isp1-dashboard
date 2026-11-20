"""Aligns DAM, ISP1 and Crete data of one market day and computes everything
the page shows. The page only displays what is written here (no re-computation).

Rules that matter:
- A category that does not exist in a file is null, never 0 (D09).
- Energy is computed from 15-minute MW: GWh = sum(MW) / 4000.
- Greek clock labels come from the UTC time of the interval (D02).
"""
import datetime as dt

import numpy as np

from . import config as C
from .timeutil import cet_wall, clock_labels, day_slots, expected_intervals, ATH


# ---------- small helpers -------------------------------------------------
def _sum(*xs):
    xs = [x for x in xs if x is not None]
    return sum(xs) if xs else None


def _diff(a, b):
    return None if a is None or b is None else a - b


def gwh(a):
    return None if a is None else float(np.sum(a) / 4000.0)


def r(a, d=1):
    return None if a is None else [round(float(v), d) if np.isfinite(v) else None for v in a]


def nmean(a):
    a = np.asarray(a, float)
    a = a[np.isfinite(a)]
    return float(a.mean()) if a.size else None


def hmean(a):
    return None if a is None else np.asarray(a, float).reshape(-1, 4).mean(axis=1)


def rnd(x, d=3):
    return round(float(x), d) if x is not None and np.isfinite(x) else None


def cat(dam, isp):
    d, i = gwh(dam), gwh(isp)
    return {"dam": rnd(d), "isp1": rnd(i), "delta": rnd(None if d is None or i is None else i - d)}


def span(ws):
    return {"from": ws[0][2], "to": ws[-1][3]} if ws else None


def windows(mask, utcs):
    """Merge consecutive True intervals into [from, to) windows (Greek clock)."""
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j + 1 < n and mask[j + 1]:
                j += 1
            end = (utcs[j] + dt.timedelta(minutes=15)).astimezone(ATH).strftime("%H:%M")
            out.append((i, j, utcs[i].astimezone(ATH).strftime("%H:%M"), end))
            i = j + 1
        else:
            i += 1
    return out


# ---------- main ----------------------------------------------------------
def build_day(day, dam, isp, crete, registry, published=None):
    n = dam["n"]
    checks = []

    def chk(cid, ok, detail=""):
        checks.append({"id": cid, "ok": bool(ok), "detail": detail})

    utcs = day_slots(day, n)
    clock = clock_labels(utcs)
    chk("interval_count", n == expected_intervals(day), f"{n} found, {expected_intervals(day)} expected")
    chk("dam_clock", cet_wall(utcs) == dam["mtu"], "DELIVERY_MTU equals CET wall clock of the slot")
    chk("dam_balance", dam["imbalance_mw"] <= C.DAM_BALANCE_MW, f"max buy-sell gap {dam['imbalance_mw']:.2f} MW")
    for w in dam["warnings"]:
        chk("dam_warning", False, w)

    # ISP1 must have the same slots, otherwise it is not used
    if isp is not None:
        if isp["n"] != n or cet_wall(utcs) != isp["times"]:
            chk("isp_alignment", False, f"ISP1 has {isp['n']} intervals / different clock than the DAM; ISP1 not used")
            isp = None
        else:
            chk("isp_alignment", True, "same slots as the DAM")
            chk("isp_thermal_sum", isp["thermal_gap_mw"] <= C.TOL_MW, f"units vs total {isp['thermal_gap_mw']:.2f} MW")
            chk("isp_cbs_sum", isp["cbs_gap_mw"] <= C.TOL_MW, f"countries + Crete vs total {isp['cbs_gap_mw']:.2f} MW")
            for w in isp["warnings"]:
                chk("isp_warning", False, w)

    # ---------- DAM derived ----------
    res_total = _sum(dam["res"], dam["crete_res"]) if dam["res"] is not None and dam["crete_res"] is not None else None
    imp_c = {k: dam["imports"][k] for k in C.COUNTRIES}
    exp_c = {k: dam["exports"][k] for k in C.COUNTRIES}
    has_imp = any(v is not None for v in imp_c.values())
    has_exp = any(v is not None for v in exp_c.values())
    z = np.zeros(n)
    dam_imports = sum((v if v is not None else z) for v in imp_c.values()) if has_imp else None
    dam_exports = sum((v if v is not None else z) for v in exp_c.values()) if has_exp else None
    dam_border = {}
    if has_imp or has_exp:
        for k in C.COUNTRIES:
            dam_border[k] = (exp_c[k] if exp_c[k] is not None else z) - (imp_c[k] if imp_c[k] is not None else z)
    dam_border_net = _diff(dam_exports, dam_imports) if (has_imp and has_exp) else None
    crete_net_dam = None
    if dam["crete_load"] is not None and dam["crete_res"] is not None:
        crete_net_dam = dam["crete_load"] - dam["crete_res"] - (dam["crete_conv"] if dam["crete_conv"] is not None else 0)
    sto_dam = None
    if dam["storage_sell"] is not None or dam["storage_buy"] is not None:
        sto_dam = (dam["storage_sell"] if dam["storage_sell"] is not None else z) - (dam["storage_buy"] if dam["storage_buy"] is not None else z)
    demand = None
    if dam["load"] is not None and dam["crete_load"] is not None:
        demand = dam["load"] + dam["crete_load"]

    # ---------- ISP1 derived ----------
    isp_border_net = isp_imports = isp_border = auc_net = None
    if isp is not None:
        isp_border = isp["border"]
        isp_border_net = sum(isp_border.values()) if isp_border else None
        isp_imports = sum(-np.minimum(v, 0.0) for v in isp_border.values()) if isp_border else None
        auc_net = (sum(isp["auction"].values()) if isp["auction"] else None)

    # ---------- Crete file ----------
    cr = None
    if crete is not None:
        cr = crete
        if dam["crete_load"] is not None:
            gap = float(np.abs(hmean(dam["crete_load"]) - cr["load"]).max())
            ok = gap <= C.TOL_MW
            chk("crete_vs_dam_load", ok, f"max hourly gap {gap:.2f} MW" + ("" if ok else "; Crete file not used (replaced after the fact?)"))
            if not ok:
                cr = None

    # ---------- hourly block ----------
    nh = n // 4
    labels = [clock[4 * i][:2] for i in range(nh)]
    h_dam = {
        "mcp": r(hmean(dam["mcp"]), 2), "lignite": r(hmean(dam["lignite"])), "gas": r(hmean(dam["gas"])),
        "hydro": r(hmean(dam["hydro"])), "res": r(hmean(res_total)), "pump": r(hmean(dam["pump"])),
        "storage_net": r(hmean(sto_dam)), "border_net": r(hmean(dam_border_net)), "crete_net": r(hmean(crete_net_dam)),
        "border": {k: r(hmean(v)) for k, v in dam_border.items()},
    }
    h_isp = None
    if isp is not None:
        on_units = {u: a for u, a in isp["units"].items() if float(a.max()) > C.ISP_ON_MW}
        h_isp = {
            "lignite": r(hmean(isp["lignite"])), "gas": r(hmean(isp["gas"])), "hydro": r(hmean(isp["hydro"])),
            "res": r(hmean(isp["res"])), "pump": r(hmean(isp["pump"])), "storage_net": r(hmean(isp["storage_net"])),
            "border_net": r(hmean(isp_border_net)), "crete_net": r(hmean(isp["virtual_crete"])),
            "surplus": r(hmean(isp["surplus"])),
            "border": {k: r(hmean(v)) for k, v in isp_border.items()},
            "units": {u: r(hmean(a)) for u, a in on_units.items()},
            "unit_fuel": {u: isp["unit_fuel"][u] for u in on_units},
        }
    h_cr = None if cr is None else {k: r(cr[k]) for k in ("load", "res", "thermal", "flow")}

    # ---------- 15-minute block ----------
    q = {"mcp": r(dam["mcp"], 2), "dam_imports": r(dam_imports)}
    if isp is not None:
        q["surplus"] = r(isp["surplus"])
        q["isp_imports"] = r(isp_imports)

    # ---------- summary ----------
    gh = np.array([int(c[:2]) for c in clock])
    mid = (gh >= C.MIDDAY_HOURS[0]) & (gh < C.MIDDAY_HOURS[1])
    eve = gh == C.EVENING_HOUR
    summary = {
        "price": {"avg": rnd(np.mean(dam["mcp"]), 2), "min": rnd(np.min(dam["mcp"]), 2), "max": rnd(np.max(dam["mcp"]), 2),
                  "min_at": clock[int(np.argmin(dam["mcp"]))], "max_at": clock[int(np.argmax(dam["mcp"]))]},
        "demand_gwh": rnd(gwh(demand)),
        "res_share_of_demand": rnd(None if demand is None or res_total is None else np.sum(res_total) / np.sum(demand), 4),
        "categories": {
            "lignite": cat(dam["lignite"], isp["lignite"] if isp else None),
            "gas": cat(dam["gas"], isp["gas"] if isp else None),
            "hydro": cat(dam["hydro"], isp["hydro"] if isp else None),
            "res": cat(res_total, isp["res"] if isp else None),
            "storage_net": cat(sto_dam, isp["storage_net"] if isp else None),
            "pump": cat(dam["pump"], isp["pump"] if isp else None),
            "border_net": cat(dam_border_net, isp_border_net),
            "crete_net": cat(crete_net_dam, isp["virtual_crete"] if isp else None),
        },
        "borders": {
            "dam_net": {k: rnd(gwh(v)) for k, v in dam_border.items()},
            "isp1_net": {k: rnd(gwh(v)) for k, v in (isp_border or {}).items()},
            "steps_gwh": None if isp is None else {
                "dam": rnd(gwh(dam_border_net)),
                "after_auctions": rnd(gwh(auc_net)),
                "after_xbid": rnd(gwh(isp_border_net)),
            },
        },
        "crete": {
            "dam": {"load": rnd(gwh(dam["crete_load"])), "res": rnd(gwh(dam["crete_res"])),
                    "conventional": rnd(gwh(dam["crete_conv"])), "net": rnd(gwh(crete_net_dam))},
            "admie_file": None if cr is None else {"load": rnd(np.sum(cr["load"]) / 1000), "res": rnd(np.sum(cr["res"]) / 1000),
                                                    "thermal": rnd(np.sum(cr["thermal"]) / 1000), "flow": rnd(np.sum(cr["flow"]) / 1000)},
            "isp1_net": rnd(gwh(isp["virtual_crete"])) if isp else None,
        },
    }
    signals = []
    zero_imp = None if dam_imports is None else (dam["mcp"] <= C.CONGESTION_MCP) & (dam_imports > 0)
    if zero_imp is not None and zero_imp.any():
        ws0 = windows(zero_imp, utcs)
        signals.append({"id": "zero_price_imports", "stage": 1, "intervals": int(zero_imp.sum()), "span": span(ws0),
                        "windows": [{"from": a, "to": b} for _, _, a, b in ws0],
                        "dam_imports_avg": rnd(np.mean(dam_imports[zero_imp]), 0)})
    if isp is not None:
        d_l, d_g = isp["lignite"] - (dam["lignite"] if dam["lignite"] is not None else np.nan), isp["gas"] - (dam["gas"] if dam["gas"] is not None else np.nan)
        summary["thermal_change_mw"] = {
            "midday": {"lignite": rnd(nmean(d_l[mid]), 0) if mid.any() else None, "gas": rnd(nmean(d_g[mid]), 0) if mid.any() else None},
            "evening": {"lignite": rnd(nmean(d_l[eve]), 0) if eve.any() else None, "gas": rnd(nmean(d_g[eve]), 0) if eve.any() else None},
        }
        s = isp["surplus"]
        if s is not None:
            summary["surplus"] = {"gwh": rnd(gwh(s)), "intervals": int((s > 0).sum()), "peak_mw": rnd(s.max(), 0),
                                  "peak_at": clock[int(np.argmax(s))] if s.max() > 0 else None}
            cong = (dam["mcp"] <= C.CONGESTION_MCP) & (s > 0) & (isp_imports > 0)
            if cong.any():
                ws = windows(cong, utcs)
                signals.append({"id": "possible_congestion", "stage": 2, "intervals": int(cong.sum()), "span": span(ws),
                                "windows": [{"from": a, "to": b} for _, _, a, b in ws],
                                "mcp_avg": rnd(np.mean(dam["mcp"][cong]), 2), "surplus_avg_mw": rnd(np.mean(s[cong]), 0),
                                "isp_imports_avg_mw": rnd(np.mean(isp_imports[cong]), 0),
                                "dam_imports_avg_mw": rnd(np.mean(dam_imports[cong]), 0) if dam_imports is not None else None})
        reg_active = {u for u, i in registry.items() if i["status"] == "active"}
        on = {u for u, a in isp["units"].items() if float(a.max()) > C.ISP_ON_MW}
        summary["units"] = {"on": sorted(on), "active_but_off": sorted(u for u in reg_active if u in isp["units"] and u not in on)}

    stages = {"dam": True, "isp1": isp is not None, "crete": cr is not None}
    ok = all(c["ok"] for c in checks)
    quality = "complete" if (stages["isp1"] and stages["crete"] and ok) else ("check" if not ok else "partial")

    return {
        "v": C.SCHEMA, "date": day.isoformat(), "n": n, "hours": nh, "clock": clock,
        "stages": stages, "quality": quality, "published": published or {},
        "isp1_info": None if isp is None else {"isp": isp["isp"], "calc_stamp": isp["calc_stamp"]},
        "dam_info": {"ver": dam["ver"], "classes": dam["classes"]},
        "hourly": {"label": labels, "dam": h_dam, "isp1": h_isp, "crete": h_cr},
        "q": q, "summary": summary, "signals": signals, "checks": checks,
    }
