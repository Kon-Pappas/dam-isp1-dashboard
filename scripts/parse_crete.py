"""Reads ADMIE's daily dispatch of the Crete system (sheet 1, hourly Hr01..Hr25)."""
import numpy as np
import pandas as pd

from .parse_dam import ParseError

ROWS = {
    "load": "LOAD FORECAST OF CRETE",
    "res": "RES FORECAST OF CRETE",
    "flow": "MAINLAND GREECE",
    "thermal": "PRODUCTION OF THERMAL UNITS OF CRETE",
}


def parse_crete(path, hours):
    """`hours` = hours of that day (23, 24 or 25). Columns after it are padding."""
    raw = pd.read_excel(path, sheet_name=0, header=None, engine="openpyxl")
    lab = [str(x) for x in raw[0].tolist()]
    out = {"hours": hours}
    for key, prefix in ROWS.items():
        idx = [i for i, l in enumerate(lab) if l.upper().startswith(prefix)]
        if not idx:
            raise ParseError(f"Crete row '{prefix}...' not found")
        vals = pd.to_numeric(raw.iloc[idx[0], 1:hours + 1], errors="coerce").to_numpy(float)
        if np.isnan(vals).any():
            raise ParseError(f"Crete row '{prefix}...' has gaps within the {hours} hours of the day")
        out[key] = vals
    return out
