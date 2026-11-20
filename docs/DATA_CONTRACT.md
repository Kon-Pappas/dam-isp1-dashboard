# Data contract (schema 1)

`data/YYYY-MM.json` = `{"schema":1,"month":"2026-11","days":{"2026-11-18":{...}}}`. `data/manifest.json` lists every day with its stages and quality. `data/meta.json` has `last_update`, `next_update`, `latest_day` (Athens time).

One day:

| Key | Meaning |
|---|---|
| `date`, `n`, `hours` | market day, intervals (92/96/100), hours (23/24/25) |
| `clock` | Greek clock time (HH:MM) of each interval; the autumn hour appears twice |
| `stages` | `{dam, isp1, crete}` booleans |
| `quality` | `complete`, `partial` (a stage missing), `check` (a check failed) |
| `published` | publication times as given by each source |
| `hourly.label` | Greek clock hour of each hour block |
| `hourly.dam`, `hourly.isp1` | hourly means in MW: `lignite, gas, hydro, res, pump, storage_net, border_net, crete_net, border{AL,BG,IT,MK,TR}`; DAM also `mcp`; ISP1 also `surplus`, `units{name:[24]}`, `unit_fuel`. `res` is RES incl. Crete. `border_net` = exports - imports (borders only). `isp1` is `null` until ISP1 exists |
| `hourly.crete` | ADMIE Crete file, hourly: `load, res, thermal, flow` |
| `q` | 15-minute series: `mcp, dam_imports, surplus, isp_imports` |
| `summary` | all totals in GWh (`categories` with `dam`, `isp1`, `delta`), price statistics, thermal change at midday (11-15) and 21:00, surplus, borders per country and the three steps, Crete, unit status |
| `signals` | `zero_price_imports` (stage 1), `possible_congestion` (stage 2) with `span` and `windows` |
| `checks` | each check with `ok` and `detail` |

Rules: `null` = not available (never 0); energy is GWh = sum(MW)/4000; hours are Greek clock; all text on the page is built from these numbers.
