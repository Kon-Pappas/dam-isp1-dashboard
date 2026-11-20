"""Command line.

  python -m scripts.update_data daily                     # today and tomorrow (Athens date)
  python -m scripts.update_data backfill --from 2026-01-01 --to 2026-11-18
  python -m scripts.update_data day 2026-11-18 [--local tests/fixtures]

A day is rebuilt from all its files, never patched, and a stored stage is never
lost: if a download fails this time, the stored version stays.
"""
import argparse
import datetime as dt
import json
import sys
import warnings

from . import config as C
from . import store
from .build_day import build_day
from .fetch import Local, Remote
from .parse_crete import parse_crete
from .parse_dam import ParseError, parse_dam
from .parse_isp1 import parse_isp1
from .timeutil import now_athens

warnings.filterwarnings("ignore", message="Workbook contains no default style")


def load_registry():
    with open(C.CONFIG_DIR / "units.json", encoding="utf-8") as f:
        return json.load(f)["units"]


def process_day(day, fetcher, reg, force=False, log=print):
    old = store.load_month(day)["days"].get(day.isoformat())
    if old and old["quality"] == "complete" and not force:
        return "skip (complete)"
    dref = fetcher.dam(day)
    if dref is None:
        return "no DAM yet"
    dam = parse_dam(dref.path)
    published = {"dam": dam["pub_time"]}
    isp = crete = None
    iref = fetcher.isp1(day)
    if iref:
        try:
            isp = parse_isp1(iref.path, reg)
            published["isp1"] = iref.published
        except ParseError as e:
            log(f"  {day}: ISP1 not used: {e}")
    cref = fetcher.crete(day)
    if cref:
        try:
            crete = parse_crete(cref.path, dam["n"] // 4)
            published["crete"] = cref.published
        except ParseError as e:
            log(f"  {day}: Crete file not used: {e}")
    obtained = {"isp1": isp is not None, "crete": crete is not None}
    new = build_day(day, dam, isp, crete, reg, published)
    if old:
        # keep the stored day only when a file could not be obtained this time (download or reading failed).
        # A file that was read but rejected by a check (build_day) must replace the stored version.
        lost = [k for k, v in old["stages"].items() if v and not new["stages"][k] and not obtained.get(k, True)]
        if lost:
            return f"kept stored day (this run lacks {lost})"
    store.put_day(day, new)
    return f"written, quality={new['quality']}, stages={[k for k, v in new['stages'].items() if v]}"


def daterange(a, b):
    d = a
    while d <= b:
        yield d
        d += dt.timedelta(days=1)


def main(argv=None):
    ap = argparse.ArgumentParser(prog="update_data")
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("daily", "backfill", "day"):
        p = sub.add_parser(name)
        p.add_argument("--local", help="read files from this folder instead of the internet")
        p.add_argument("--force", action="store_true")
        if name == "backfill":
            p.add_argument("--from", dest="a", default=C.BACKFILL_START)
            p.add_argument("--to", dest="b", default=None)
        if name == "day":
            p.add_argument("date")
    a = ap.parse_args(argv)
    fetcher = Local(a.local) if a.local else Remote(use_cache=(a.cmd == "backfill"))
    reg = load_registry()
    today = now_athens().date()
    if a.cmd == "daily":
        days = [today, today + dt.timedelta(days=1)]
    elif a.cmd == "backfill":
        days = list(daterange(dt.date.fromisoformat(a.a), dt.date.fromisoformat(a.b) if a.b else today + dt.timedelta(days=1)))
    else:
        days = [dt.date.fromisoformat(a.date)]
    failed = []
    for d in days:
        try:
            print(f"{d}: {process_day(d, fetcher, reg, a.force)}", flush=True)
        except Exception as e:                      # one bad day must not stop a backfill
            failed.append(d)
            print(f"{d}: FAILED {type(e).__name__}: {e}", flush=True)
    man = store.rebuild_manifest()
    store.write_meta(man)
    if failed:
        print(f"{len(failed)} day(s) failed: {[str(x) for x in failed]}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
