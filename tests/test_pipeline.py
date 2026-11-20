"""Run from the repo root:  python -m unittest discover -s tests -t . -v
Uses real files in tests/fixtures (see docs/DECISIONS.md D14)."""
import datetime as dt
import json
import tempfile
import unittest
import warnings
from pathlib import Path

warnings.filterwarnings("ignore")

from scripts import config as C
from scripts import store
from scripts.build_day import build_day
from scripts.fetch import pick_admie_file
from scripts.parse_crete import parse_crete
from scripts.parse_dam import ParseError, parse_dam
from scripts.parse_isp1 import parse_isp1
from scripts.timeutil import clock_labels, day_slots, expected_intervals

FX = Path(__file__).parent / "fixtures"
REG = json.load(open(C.CONFIG_DIR / "units.json", encoding="utf-8"))["units"]


def build(ymd, with_isp=True, with_crete=True):
    day = dt.date(int(ymd[:4]), int(ymd[4:6]), int(ymd[6:]))
    dam = parse_dam(FX / f"{ymd}_EL-DAM_Results_EN_v01.xlsx")
    isp = parse_isp1(FX / f"{ymd}_ISP1ISPResults_01.xlsx", REG) if with_isp and (FX / f"{ymd}_ISP1ISPResults_01.xlsx").exists() else None
    cp = FX / f"{ymd}_DailyDispatchOfCreteElectricalSystem_01.xlsx"
    cr = parse_crete(cp, dam["n"] // 4) if with_crete and cp.exists() else None
    return build_day(day, dam, isp, cr, REG)


class TimeTests(unittest.TestCase):
    def test_interval_counts(self):
        self.assertEqual(expected_intervals(dt.date(2026, 3, 29)), 92)
        self.assertEqual(expected_intervals(dt.date(2026, 10, 25)), 100)
        self.assertEqual(expected_intervals(dt.date(2026, 11, 18)), 96)

    def test_greek_clock(self):
        c = clock_labels(day_slots(dt.date(2026, 11, 18), 96))
        self.assertEqual((c[0], c[-1]), ("01:00", "00:45"))

    def test_autumn_hour_repeats(self):
        c = clock_labels(day_slots(dt.date(2026, 10, 25), 100))
        self.assertEqual(c[8:12], c[12:16])       # 03:00-03:45 twice


class ParseTests(unittest.TestCase):
    def test_prelim_file_is_rejected(self):
        with self.assertRaises(ParseError):
            parse_dam(FX / "20260329_EL-DAM_PrelimResults_EN_v01.xlsx")

    def test_dst_days(self):
        self.assertEqual(parse_dam(FX / "20260329_EL-DAM_Results_EN_v01.xlsx")["n"], 92)
        self.assertEqual(parse_dam(FX / "20261025_EL-DAM_Results_EN_v01.xlsx")["n"], 100)
        self.assertEqual(parse_isp1(FX / "20260329_ISP1ISPResults_01.xlsx", REG)["n"], 92)
        self.assertEqual(parse_isp1(FX / "20261025_ISP1ISPResults_01.xlsx", REG)["n"], 100)

    def test_missing_category_is_null(self):
        self.assertIsNone(parse_dam(FX / "20260105_EL-DAM_Results_EN_v01.xlsx")["storage_sell"])

    def test_always_present_category_missing_means_zero(self):
        dam = parse_dam(FX / "20260105_EL-DAM_Results_EN_v01.xlsx")     # no CRETE CONVENTIONAL, no BG/IT imports
        self.assertEqual(float(dam["crete_conv"].sum()), 0.0)
        self.assertEqual(float(dam["imports"]["BG"].sum()), 0.0)

    def test_isp1_sums(self):
        isp = parse_isp1(FX / "20261118_ISP1ISPResults_01.xlsx", REG)
        self.assertLess(isp["thermal_gap_mw"], 1.0)
        self.assertLess(isp["cbs_gap_mw"], 1.0)
        self.assertEqual(set(isp["border"]), set(C.COUNTRIES))
        self.assertIsNone(isp["unmapped"])


class BuildTests(unittest.TestCase):
    def test_18_nov(self):
        d = build("20261118")
        self.assertEqual(d["quality"], "complete")
        c = d["summary"]["categories"]
        self.assertAlmostEqual(c["lignite"]["dam"], 8.145, 2)
        self.assertAlmostEqual(c["lignite"]["isp1"], 9.878, 2)
        self.assertAlmostEqual(c["hydro"]["delta"], 1.989, 2)
        self.assertAlmostEqual(c["res"]["delta"], -2.673, 2)
        self.assertAlmostEqual(c["crete_net"]["dam"], c["crete_net"]["isp1"], 2)
        self.assertAlmostEqual(d["summary"]["surplus"]["gwh"], 3.454, 2)
        sig = {s["id"]: s for s in d["signals"]}
        self.assertEqual(sig["possible_congestion"]["intervals"], 6)
        self.assertEqual(sig["possible_congestion"]["span"], {"from": "11:45", "to": "14:30"})
        self.assertIn("PTOLEMAIDA5", d["summary"]["units"]["on"])
        self.assertNotIn("AG_DIMITRIOS1", d["summary"]["units"]["active_but_off"])   # retired

    def test_borders_follow_the_auction_step(self):
        s = build("20261118")["summary"]["borders"]["steps_gwh"]
        self.assertAlmostEqual(s["dam"], 32.934, 2)
        self.assertAlmostEqual(s["after_auctions"], 32.672, 2)
        self.assertAlmostEqual(s["after_xbid"], 32.719, 2)

    def test_spring_dst_day(self):
        d = build("20260329")
        self.assertEqual((d["n"], d["hours"]), (92, 23))
        self.assertTrue(all(c["ok"] for c in d["checks"]))
        self.assertGreater(d["summary"]["crete"]["dam"]["conventional"], 0)     # Crete thermal exists this day
        self.assertAlmostEqual(d["summary"]["crete"]["dam"]["net"], d["summary"]["crete"]["isp1_net"], 2)

    def test_autumn_dst_day_without_crete_file(self):
        d = build("20261025")
        self.assertEqual((d["n"], d["hours"]), (100, 25))
        self.assertTrue(all(c["ok"] for c in d["checks"]))
        self.assertEqual(d["quality"], "partial")
        self.assertFalse(d["stages"]["crete"])

    def test_dam_only_day(self):
        d = build("20260105")
        self.assertEqual(d["quality"], "partial")
        self.assertIsNone(d["summary"]["categories"]["storage_net"]["dam"])      # null, not 0
        self.assertIsNone(d["hourly"]["isp1"])


class JsonTests(unittest.TestCase):
    def test_no_nan_in_any_day(self):                 # browsers cannot read NaN
        for ymd in ("20260105", "20260329", "20261025", "20261118"):
            json.dumps(build(ymd), allow_nan=False)


class OldFileTests(unittest.TestCase):
    def test_nan_in_an_old_month_file_is_healed(self):
        old = C.DATA_DIR
        with tempfile.TemporaryDirectory() as t:
            C.DATA_DIR = Path(t)
            try:
                (Path(t) / "2026-11.json").write_text('{"schema":1,"month":"2026-11","days":{"2026-11-20":{"x":NaN,"y":[1,NaN]}}}')
                m = store.load_month(dt.date(2026, 11, 20))
                self.assertIsNone(m["days"]["2026-11-20"]["x"])
                self.assertEqual(m["days"]["2026-11-20"]["y"], [1, None])
                store.put_day(dt.date(2026, 11, 18), {"stages": {"dam": True}, "quality": "partial"})   # must not raise
            finally:
                C.DATA_DIR = old


class FetchTests(unittest.TestCase):
    ITEMS = [  # shape of the real ADMIE answer (19 Nov 2026)
        {"file_path": "https://www.admie.gr/sites/default/files/attached-files/type-file/2026/11/20261119_ISP1ISPResults_01.xlsx",
         "file_description": "ISP1 2026-11-19 20261118170517", "file_fromdate": "19.11.2026", "file_todate": "19.11.2026",
         "file_published": "18.11.2026 18:50"},
        {"file_path": "https://x/20261119_ISP1ISPResults_02.xlsx", "file_description": "ISP1 2026-11-19 20261118175000",
         "file_fromdate": "19.11.2026", "file_todate": "19.11.2026", "file_published": "18.11.2026 19:20"},
        {"file_path": "https://x/other.xlsx", "file_description": "ISP1 2026-11-20 x", "file_fromdate": "20.11.2026",
         "file_todate": "20.11.2026", "file_published": "19.11.2026 18:50"},
    ]

    def test_latest_published_for_the_day(self):
        it = pick_admie_file(self.ITEMS, dt.date(2026, 11, 19), "ISP1")
        self.assertTrue(it["file_path"].endswith("_02.xlsx"))

    def test_nothing_for_other_day(self):
        self.assertIsNone(pick_admie_file(self.ITEMS, dt.date(2026, 11, 21), "ISP1"))

    def test_description_prefix(self):
        self.assertIsNone(pick_admie_file(self.ITEMS, dt.date(2026, 11, 19), "ISP2"))


class StoreTests(unittest.TestCase):
    def test_next_update_and_atomic_write(self):
        from scripts.timeutil import ATH
        n = store.next_update(dt.datetime(2026, 11, 19, 15, 0, tzinfo=ATH))
        self.assertEqual((n.hour, n.minute, n.day), (19, 20, 19))
        n = store.next_update(dt.datetime(2026, 11, 19, 23, 0, tzinfo=ATH))
        self.assertEqual((n.hour, n.minute, n.day), (9, 30, 20))
        old = C.DATA_DIR
        with tempfile.TemporaryDirectory() as t:
            C.DATA_DIR = Path(t)
            try:
                store.put_day(dt.date(2026, 11, 18), {"stages": {"dam": True}, "quality": "partial"})
                man = store.rebuild_manifest()
                self.assertEqual(man["months"], ["2026-11"])
                self.assertFalse(list(Path(t).glob("*.tmp")))
            finally:
                C.DATA_DIR = old


if __name__ == "__main__":
    unittest.main()
