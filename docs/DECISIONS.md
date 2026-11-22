# Decisions

Each decision: date, what, why, what was rejected. Added to, never rewritten.

**D01 (19 Nov 2026) Repo and visibility.** `Kon-Pappas/dam-isp1-dashboard`, public, Pages off, no link from the hub until finished, `noindex` on the page. Why: Pages on a free plan needs a public repo; "unlinked" is not "private", so nothing sensitive is stored. Rejected: a name with `v2` (no earlier version exists); `target-model-dashboard` (vaguer).

**D02 (19 Nov 2026) Time base.** The market day is CET/CEST (Europe/Brussels), 96 intervals; 92 on 29 Mar 2026 and 100 on 25 Oct 2026 (checked on the real DAM and ISP1 files of both days). The key of an interval is (date, `SORT`), UTC is derived from it. The page shows Greek clock time = CET + 1 h, so a day runs 01:00 to 01:00 and the autumn repeated hour is shown twice. Rejected: cutting by Greek calendar day (needs two files per day).

**D03 (19 Nov 2026) Sources.** DAM: HEnEx `Results` file, not `PrelimResults` (Prelim has only MCP and net position). ISP1 and the Crete dispatch: ADMIE API, categories `ISP1ISPResults` and `DailyDispatchOfCreteElectricalSystem`, both checked in a browser on 19 Nov 2026. Observed publication (Greek time): DAM about 14:15-14:40, ISP1 about 18:50-19:05, Crete about 08:50-09:15 on the day before. The ISP1 category returns ISP1 files only.

**D04 (19 Nov 2026) DAM version.** Only `v01`. No corrections were found; IDA are a different stage and appear in the ISP1 "Auction CBS (DAM+CRIDAs)" rows.

**D05 (19 Nov 2026) Borders per country.** The DAM `ASSET_DESCR` has AL-GR, BG-GR, IT-GR, MK-GR, TR-GR (and reverse), so DAM and ISP1 are compared per country. ISP1 border rows are "Total Market CBS (+XBID)". The three steps are DAM, after the intraday auctions, after XBID. On 18 Nov the change comes at the auctions (-0.26 GWh), not at XBID (+0.05 GWh).

**D06 (19 Nov 2026) Crete is separate from the neighbouring countries.** Net draw from the mainland = Crete load - Crete RES - Crete conventional (the DAM has `CRETE CONVENTIONAL` on some days, e.g. 29 Mar). In ISP1 it is `VIRTUAL_CRETE`; the ADMIE Crete file gives the ISP-side load, RES and thermal. National RES = DAM `RES` + `CRETE RENEWABLES` against ISP1 `Renewables`. The ISP1 row "Total RES Production" is only three dispatchable units and is not used.

**D07 (19 Nov 2026) Unit registry.** `config/units.json` maps ISP1 thermal units to lignite or gas and marks retired ones. Lignite: only Ptolemaida 5 is active; Agios Dimitrios 1-5 and Megalopoli 4 are retired (decarbonisation) and are never reported as "stopped". A unit not in the registry is listed in the day's checks, never silently added to gas.

**D08 (19 Nov 2026) Data layout.** Monthly files + `manifest.json` + `meta.json`. Measured on 19 Nov 2026: one day is 12 KB raw, 4.0 KB gzip; a 31-day month is about 125 KB gzip, below the 250 KB limit, while one file for the backfill (about 320 days) would be about 1.3 MB. Charts use hourly means; only price, residual surplus and imports are kept at 15 minutes. Run `python -m scripts.data_size` when the layout changes.

**D09 (19 Nov 2026, changed 20 Nov 2026) Null, not zero.** Technologies that have always existed in the DAM (lignite, gas, big hydro, RES, pump, imports, exports, Crete) have no row when nothing is traded, so a missing row means 0. Storage entered the market later, so a missing storage row is `null`. Change on 20 Nov 2026: the first live day had no `Lignite` rows in the DAM and the first rule produced `NaN`. Python now never writes `NaN`; writing it fails loudly.

**D10 (19 Nov 2026) Updates.** cron-job.org (Europe/Athens) triggers the workflow; the workflow has no `schedule:`. `RUN_TIMES_ATHENS` in `scripts/config.py` only documents the triggers and feeds `next_update` in `meta.json`. `daily` processes today and tomorrow and skips days that are complete.

**D11 (19 Nov 2026) Backfill and re-runs.** From 2026-01-01. A day is rebuilt from all its files; a stage already stored is never lost if a download fails.

**D12 (19 Nov 2026) "Possible grid congestion".** Flag when DAM price <= 1 EUR/MWh, ISP1 shows a residual surplus and ISP1 still has imports in the same interval. Wording is always "possible": neighbours' prices may also be <= 0, which is not congestion. Refinement later with neighbours' prices. On 18 Nov: 6 intervals between 11:45 and 14:30.

**D13 (19 Nov 2026) Residual surplus.** ISP1 row "Energy Surplus" (stored negative) is shown as "Residual surplus", as a positive number.

**D14 (19 Nov 2026) Test fixtures.** Real market files for 18 Nov, 29 Mar, 25 Oct and 5 Jan are kept in `tests/fixtures` (about 1.3 MB) so tests are reproducible. The pipeline never writes raw files into `data/`.

**D15 (19 Nov 2026) Design.** Accent Rose `#f78fb3`, technology colours from the live repo, country colours from Flows, five tabs (Day at a glance, ADMIE reshuffle, Thermal & constraints, Borders & Crete, History & seasons). On mobile: above the fold one chart and one KPI row, long text in collapsible blocks. PNG previews approved on 19 Nov 2026.

**D16 (19 Nov 2026) Scope.** ISP2, ISP3 and Ad-hoc ISP are out of scope. DAM and ISP1 only.

**D17 (20 Nov 2026) Checks after the first backfill (324 days, 1 Jan - 20 Nov 2026).** (a) The DAM buy-sell balance tolerance is 3 MW (4 days in April had a gap of about 2.1 MW, 0.05 % of the load). (b) If the ADMIE Crete file disagrees with the DAM Crete load by more than 1 MW, the Crete file is not used, the day is marked `check` and the reason is written (on 15 Jan the file for the day was published on 4 Nov 2026 and has clearly wrong hours; on 22 Jul it was published the day after). The DAM Crete numbers stay. (c) ELPEDISON_THESS and ELPEDISON_THISVI (seen in 28 January days) are registered as gas, status `retired`.

**D18 (20 Nov 2026) A stored stage is kept only if the file could not be obtained.** After D17 the re-run kept the old (wrong) 15 Jan and 22 Jul days because the rejected Crete file counted as "stage lost". Now: file missing or unreadable this time = keep the stored day; file read but rejected by a check = the new day replaces it.

**D19 (21 Nov 2026) Front-end stack.** A static page, no build step: `index.html`, `i18n.js`, `dashboard.js`. Tailwind play CDN pinned to 3.4.17 and Chart.js pinned to 4.5.1, like the other dashboards. The shell (loading screen, header, controls, tabs, modal, back-to-top button, footer) follows the Flows dashboard. The accent is set in one place (`window.ACCENT`, Rose, light) and used as `acc-*` classes. Rejected: a bundler (the other repos have none).

**D20 (21 Nov 2026) Behaviour copied from the hub.** English by default, choice kept in `kp_lang`; Greek page fully Greek; loading screen with one step per tab and no percentages; one date selector box (a status pill next to "Last update" on desktop, inside the box on mobile); mobile tabs 3 + 2, equal-width tabs on desktop; Methodology modal opens on the section of the current tab, Short/Detailed; "Esc" closes it. New in this repo: the data are reloaded when the page returns to the foreground after `next_update` has passed (checked at most every 5 minutes).

**D21 (21 Nov 2026) Day selector.** All days of `manifest.json`, newest first, default = latest day. "(today)" and "(tomorrow)" are added in the language of the visitor, because the usual reader looks at tomorrow.

**D22 (21 Nov 2026) Status pill.** `Complete data` (green) = quality complete. `Awaiting ISP1` = DAM present, ISP1 not yet, day is today or later. `Data check` = a check failed. Otherwise `Incomplete data`.

**D23 (21 Nov 2026) Colours.** Technologies as in the live dashboard (lignite, gas, hydro, RES, curtailment). Net exports are red when positive and yellow when negative (hub rule: exports red, imports yellow). The accent is never a data colour.

**D24 (21 Nov 2026) Day at a glance, mobile.** Stage 1 and Stage 2 sentences are built from numbers in the day file only. On mobile they are clamped to three lines with "Read more" (the first screen must not be a wall of text). Every sentence is an observation; the congestion wording stays "possible".

**D25 (21 Nov 2026) No analytics and `noindex` until the page is linked.** The hub counter script is not included yet; it is added when the page is linked from the hub. The page has `<meta name="robots" content="noindex, nofollow">`.

**D26 (21 Nov 2026) New fields in the day summary.** `summary.windows` (midday 11:00-15:00, evening 21:00) and `summary.thermal_level_mw` (average DAM and ISP1 thermal level in those windows). The page shows the sentences that need them only when they exist, so days built before this change still display.

