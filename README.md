# dam-isp1-dashboard

Greek day-ahead market (HEnEx DAM) compared with ADMIE's first scheduling run (ISP1), published every day in two stages:

1. **After the DAM (about 14:15):** what the market decided for tomorrow.
2. **After ISP1 (about 19:00):** what ADMIE changed, and why it may have done so.

Status: **work in progress, not linked from the hub.** GitHub Pages is off on purpose. See `docs/ROADMAP.md`.

## What is in the repo

| Path | Purpose |
|---|---|
| `scripts/` | Python pipeline: download, parse, align DAM + ISP1 + Crete, compute, store |
| `config/units.json` | Thermal unit registry (fuel, active/retired) |
| `data/` | Generated JSON: monthly files `YYYY-MM.json`, `manifest.json`, `meta.json` |
| `tests/` | Tests on real files (`tests/fixtures`) |
| `.github/workflows/update-data.yml` | Manual-trigger workflow (cron-job.org calls it) |
| `docs/` | `DECISIONS.md`, `KNOWN_ISSUES.md`, `ROADMAP.md`, `DATA_CONTRACT.md` |

The page (front-end) comes in later batches. All numbers are computed in Python; the page only shows them.

## Commands (run from the repo root)

```
pip install -r requirements.txt
python -m unittest discover -s tests -t . -v                   # tests
python -m scripts.update_data daily                            # today and tomorrow
python -m scripts.update_data backfill --from 2026-01-01       # history (until tomorrow)
python -m scripts.update_data day 2026-11-18                   # one day
python -m scripts.update_data day 2026-11-18 --local tests/fixtures   # offline, from files
python -m scripts.data_size                                    # size of data files
```

In GitHub: **Actions → Update data → Run workflow** (mode `daily`, `backfill` or `day`).

## Sources

- HEnEx DAM results: `https://www.enexgroup.gr/documents/20126/200106/YYYYMMDD_EL-DAM_Results_EN_v01.xlsx`
- ADMIE API: `https://www.admie.gr/getOperationMarketFile?dateStart=D&dateEnd=D&FileCategory=ISP1ISPResults` and `…=DailyDispatchOfCreteElectricalSystem`

Data come from public market publications of HEnEx and ADMIE/IPTO. This is an independent analysis, not an official publication.
