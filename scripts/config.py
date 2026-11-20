"""Fixed settings of the pipeline. Nothing here is secret."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
CONFIG_DIR = ROOT / "config"
CACHE_DIR = ROOT / ".cache" / "raw"          # downloaded xlsx, never committed

SCHEMA = 1

# Sources (verified 19 Nov 2026, see docs/DECISIONS.md D03)
ENEX_URL = "https://www.enexgroup.gr/documents/20126/200106/{ymd}_EL-DAM_Results_EN_v01.xlsx"
ADMIE_API = "https://www.admie.gr/getOperationMarketFile"
CAT_ISP1 = "ISP1ISPResults"
CAT_CRETE = "DailyDispatchOfCreteElectricalSystem"
USER_AGENT = "dam-isp1-dashboard (https://github.com/Kon-Pappas/dam-isp1-dashboard)"
HTTP_TIMEOUT = 60
HTTP_RETRIES = 3

# Triggers are set in cron-job.org (Europe/Athens). They are listed here only
# so Python can write "next update" (docs/DECISIONS.md D10).
RUN_TIMES_ATHENS = ["09:30", "14:25", "19:20"]

BACKFILL_START = "2026-01-01"

# Analysis rules
CONGESTION_MCP = 1.0          # EUR/MWh, "price about zero"
MIDDAY_HOURS = (11, 15)       # Greek clock hours [11, 15)
EVENING_HOUR = 21             # Greek clock hour
ISP_ON_MW = 0.5               # a unit counts as scheduled above this
TOL_MW = 1.0                  # tolerance of balance checks
DAM_BALANCE_MW = 3.0          # DAM buy-sell gap per interval (seen up to 2.1 MW on 11-15 Apr 2026)

COUNTRIES = ["AL", "BG", "IT", "MK", "TR"]
ISP_COUNTRY = {
    "ALBANIA": "AL", "BULGARIA": "BG", "ITALY": "IT",
    "NORTH MACEDONIA": "MK", "TURKEY": "TR",
}
