# Known issues

| Id | Issue | Effect | Next step |
|---|---|---|---|
| K01 | Time zone of the DAM `PUB_TIME` (14:15-14:40) is not documented; assumed Greek time | "Published" label of the DAM | Compare with the HEnEx page on a live day |
| K02 | Time zone of the calculation stamp inside the ISP1 file name is not documented | Not shown on the page; ADMIE `file_published` (Greek time) is used instead | Check on a live day |
| K03 | The DAM has a small `Buy/RES` row (0.43 GWh on 18 Nov, 0.4 % of `Sell/RES`) | Not netted from RES | Revisit if it grows |
| K05 | No Crete file for 25 Oct 2026 was available in the fixtures | That fixture day is `partial` | none |
| K06 | Retirement dates of Agios Dimitrios 1-5 and Megalopoli 4 are unknown | Registry has no date | Add when known |
| K08 | `checkout@v5` and `setup-python@v6` are used as in the other repos | none | none |
| K09 | No Crete file on the ADMIE site for 1, 2 and 15 Feb, 18 Apr, 2 May, 29 Aug 2026 (the API answers `[]` for 1 Feb) | Those days are `partial`, Crete from the DAM only | none (source gap) |
| K10 | No ISP1 file for 11 Jan 2026 | Day is `partial` | none (source gap) |
| K11 | The ADMIE API returns the current file only; a file replaced later (15 Jan, 22 Jul) cannot be recovered | Two `check` days | none |
| K12 | ELPEDISON_THESS / ELPEDISON_THISVI are assumed to be old names of gas units | Not reported as stopped | Confirm the names |
| K13 | The page was tested in headless Chromium only (desktop 1280, mobile 360 and 320, English and Greek; days with 23, 24 and 25 hours; a day without ISP1; tabs 1 to 3, modal, language, tooltips, back-to-top), not on real phones or Safari | Layout or font differences are possible | Check on a real iPhone and Android phone |
| K14 | Tailwind runs in the browser from a CDN (no build) | The page needs internet access to the CDN | Same as the other dashboards |
| K17 | Tabs "Borders & Crete" and "History & seasons" are placeholders | Intended | See ROADMAP |
| K18 | Day files built before 22 Nov 2026 lack `constraints` | Tab 3 shows "Constraint data are not available" for them | Run the workflow once with mode `backfill`, force `true` |
| K19 | Headless full-page screenshots blank the charts (the canvas is cleared when the viewport is resized for the capture) | Only affects screenshots, not the page | Take normal viewport screenshots |

## Hub-wide issues (H)

The same codes in every repo; the last column is the state in this repo (dam-isp1-dashboard).

| # | Issue | Proposal | State here |
|---|---|---|---|
| H01 | Double line between header and tabs on mobile | The line and the tabs gap are removed (Flows D25) | done (no line on mobile) |
| H02 | Short header labels on mobile ("Updated:" / "Next:") | As in Flows | done |
| H05 | Replaced by H06 | | |
| H06 | Mobile: secondary controls (date, pill, methodology, language) look like the main ones and take height | One box, two rows, dark wells, above the tabs; tabs in a grid (3 + 2 for five); back-to-top arrow instead of sticky tabs; no line, 12 px gaps | done; first content at 391 px (360 px, English), 427 px (320 px, Greek), 21 Nov 2026 |
| H07 | Desktop: tabs start at the left with the width of their text | Equal width over the whole row, text centred, underline as wide as the tab | done |
| H08 | The "home" link to the hub differs per repo | Same icon, size and place top left, text "Greek Energy Hub", 40 px touch area on mobile, accent on hover and focus | done |
| H09 | A page left open in the background shows old data | When the page returns to the foreground after `next_update` has passed, the data reload (at most every 5 minutes) | done, not yet tested in a browser with a real `next_update` in the past |
| C01 | Main title as a name, everything else lower case after the first word | | done |
| C02 | No all-caps labels (acronyms and units such as DAM, ISP1, RES, MW, GWh stay) | | done |

H03 and H04 no longer exist (replaced by C02). H05 was replaced by H06.
