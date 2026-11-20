# Known issues

| Id | Issue | Effect | Next step |
|---|---|---|---|
| K01 | Time zone of the DAM `PUB_TIME` (14:15-14:40) is not documented; assumed Greek time | "Published" label of the DAM | Compare with the HEnEx page on a live day |
| K02 | Time zone of the calculation stamp inside the ISP1 file name is not documented | Not shown on the page; ADMIE `file_published` (Greek time) is used instead | Check on a live day |
| K03 | The DAM has a small `Buy/RES` row (0.43 GWh on 18 Nov, 0.4 % of `Sell/RES`) | Not netted from RES | Revisit if it grows |
| K04 | Download code (HEnEx, ADMIE API) was not run against the live sites by the author of the batch (no network access); tested only with the real answer format and real files | First live run may need a fix | Run `daily` once and read the log |
| K05 | No Crete file for 25 Oct 2026 was available | That day is `partial` | Backfill will fetch it if it exists |
| K06 | Retirement dates of Agios Dimitrios 1-5 and Megalopoli 4 are unknown | Registry has no date | Add when known |
| K07 | The hub-wide checklist (H and C items of the alignment guide) is applied in the front-end batches, not yet in batch 1 | None for the pipeline | Copy the list here in batch 2 |
