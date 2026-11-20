# Known issues

| Id | Issue | Effect | Next step |
|---|---|---|---|
| K01 | Time zone of the DAM `PUB_TIME` (14:15-14:40) is not documented; assumed Greek time | "Published" label of the DAM | Compare with the HEnEx page on a live day |
| K02 | Time zone of the calculation stamp inside the ISP1 file name is not documented | Not shown on the page; ADMIE `file_published` (Greek time) is used instead | Check on a live day |
| K03 | The DAM has a small `Buy/RES` row (0.43 GWh on 18 Nov, 0.4 % of `Sell/RES`) | Not netted from RES | Revisit if it grows |
| K04 | Resolved 20 Nov 2026: the first live `daily` run downloaded the DAM, ISP1 and Crete files from GitHub's servers and wrote 2026-11-20 as `complete` | none | none |
| K05 | No Crete file for 25 Oct 2026 was available | That day is `partial` | Backfill will fetch it if it exists |
| K06 | Retirement dates of Agios Dimitrios 1-5 and Megalopoli 4 are unknown | Registry has no date | Add when known |
| K07 | The hub-wide checklist (H and C items of the alignment guide) is applied in the front-end batches, not yet in batch 1 | None for the pipeline | Copy the list here in batch 2 |
| K08 | `actions/checkout@v4` and `actions/setup-python@v5` target Node 20; GitHub forces Node 24 and prints a warning | Only a warning | Move to newer major versions when verified |
