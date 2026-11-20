"""Monthly data files, manifest and meta. All writes are atomic."""
import datetime as dt
import json
import os

from . import config as C
from .timeutil import ATH, now_athens


def month_path(day):
    return C.DATA_DIR / f"{day:%Y-%m}.json"


def write_json(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(obj, f, separators=(",", ":"), ensure_ascii=False)
    os.replace(tmp, path)


def load_month(day):
    p = month_path(day)
    if p.exists():
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    return {"schema": C.SCHEMA, "month": f"{day:%Y-%m}", "days": {}}


def put_day(day, data):
    m = load_month(day)
    m["days"][day.isoformat()] = data
    m["days"] = dict(sorted(m["days"].items()))
    write_json(month_path(day), m)


def rebuild_manifest():
    days = {}
    for p in sorted(C.DATA_DIR.glob("????-??.json")):
        with open(p, encoding="utf-8") as f:
            m = json.load(f)
        for k, d in m["days"].items():
            days[k] = {"stages": d["stages"], "quality": d["quality"], "published": d.get("published", {})}
    man = {"schema": C.SCHEMA, "months": sorted({k[:7] for k in days}), "days": dict(sorted(days.items()))}
    write_json(C.DATA_DIR / "manifest.json", man)
    return man


def next_update(now):
    for add in (0, 1):
        for t in C.RUN_TIMES_ATHENS:
            h, m = map(int, t.split(":"))
            cand = dt.datetime.combine(now.date() + dt.timedelta(days=add), dt.time(h, m), tzinfo=ATH)
            if cand > now:
                return cand
    raise RuntimeError("no run time configured")


def write_meta(man, now=None):
    now = now or now_athens()
    latest = max(man["days"]) if man["days"] else None
    stages = man["days"][latest]["stages"] if latest else {}
    meta = {"schema": C.SCHEMA, "tz": "Europe/Athens", "last_update": now.isoformat(),
            "next_update": next_update(now).isoformat(), "latest_day": latest, "latest_stages": stages}
    write_json(C.DATA_DIR / "meta.json", meta)
    return meta
