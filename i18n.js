/* All page text, English and Greek. The page builds sentences from numbers in data/*.json only. */
window.I18N = {
  en: {
    locale: 'en-GB', htmlLang: 'en',
    title: 'Greek DAM vs ISP1 Analytics',
    hub: 'Greek Energy Hub',
    load: { title: 'System Initialization', g1: 'Data fetching', g2: 'Building views', s1: 'Reading the data',
            ready: 'Dashboard is ready!', error: 'The data could not be loaded. Reload the page in a few minutes.' },
    lastUpdate: 'Last update:', lastUpdateMobile: 'Updated:', nextUpdate: 'Next update:', nextUpdateMobile: 'Next:',
    dateLabel: 'Day:', today: 'today', tomorrow: 'tomorrow',
    methodLink: 'Methodology →', btnMethodology: 'Methodology & Assumptions', btnMethodologyShort: 'Methodology',
    toTop: 'Back to top', close: 'Close',
    pill: { complete: 'Complete data', incomplete: 'Incomplete data', check: 'Data check', awaiting: 'Awaiting ISP1',
            completeShort: 'Complete', incompleteShort: 'Incomplete', checkShort: 'Check', awaitingShort: 'Awaiting' },
    tabs: { glance: 'Day at a glance', reshuffle: 'ADMIE reshuffle', thermal: 'Thermal & constraints', borders: 'Borders & Crete', history: 'History & seasons' },
    axisHour: 'Greece local time, hour of day', hourWord: 'Hour',
    more: 'Read more', less: 'Read less',
    solidIsp: 'solid line: ISP1', dashedDam: 'dashed line: DAM', onlyDam: 'DAM (ISP1 not published yet)',
    stage1: 'Stage 1 · after the DAM', stage2: 'Stage 2 · after ISP1',
    pub: 'published {t}',
    isp1Pending: 'ISP1 is not published yet. It usually appears in the evening, between about 17:55 and 19:05 Greek time.',
    s1: {
      price: 'The day-ahead price averages {avg} €/MWh, from {min} at {minAt} to {max} at {maxAt}.',
      res: 'RES (including Crete) are {share}% of the day’s demand ({res} of {demand} GWh).',
      thermal: 'Between {a} and {b} only {mw} MW of gas and lignite stay online in the DAM.',
      zero: 'In {n} intervals ({from}–{to}) the price is about zero while the DAM still imports about {mw} MW.'
    },
    s2: {
      thermal: 'On average between {a} and {b} ISP1 changes lignite by {lig} MW and gas by {gas} MW, and thermal by {ev} MW at {eh}.',
      hydro: 'Big hydro goes from {dam} to {isp} GWh ({pct}).',
      res: 'The RES forecast is {pct} against the DAM ({isp} vs {dam} GWh).',
      surplus: 'Residual surplus: {gwh} GWh in {n} intervals, peaking at {peak} MW at {at}.',
      noSurplus: 'ISP1 shows no residual surplus.',
      cong: 'In {n} intervals ({from}–{to}) the DAM price is about zero while ISP1 still carries about {imp} MW of imports next to a surplus of about {sur} MW: possible grid congestion.',
      borders: 'Net exports: {dam} GWh in the DAM, {auc} after the intraday auctions, {xb} after XBID.'
    },
    sig: {
      cong: 'Possible grid congestion · {from}–{to}',
      zero: 'Zero price with imports · {from}–{to}',
      lignite: 'Lignite: {names}',
      noLignite: 'Lignite: no unit scheduled',
      crete: 'Crete draws {gwh} GWh from the mainland'
    },
    kpi: { lignite: 'Lignite', gas: 'Gas', hydro: 'Big hydro', res: 'RES', exports: 'Net exports', surplus: 'Residual surplus',
           dam: 'DAM', isp: 'ISP1', unit: 'GWh', ispOnly: 'ISP1 only, no DAM equivalent', pending: 'ISP1 pending' },
    hero: { title: 'Thermal generation: lignite and gas', sub: 'MW, hourly average. What the market scheduled and what ADMIE scheduled.',
            lignite: 'Lignite', gas: 'Gas', total: 'Thermal total', dam: 'DAM', isp: 'ISP1', diff: 'Change' },
    t2: { tableTitle: 'DAM vs ISP1 by category', tableSub: 'GWh for the day. Change = ISP1 minus DAM.',
          cols: { cat: 'Category', dam: 'DAM', isp: 'ISP1', chg: 'Change' },
          rows: { lignite: 'Lignite', gas: 'Gas', hydro: 'Big hydro', res: 'RES (incl. Crete)', storage: 'Storage, net discharge', pump: 'Pump consumption', exports: 'Net exports (borders)', crete: 'Crete, net from the mainland', surplus: 'Residual surplus' },
          onlyIsp: 'ISP1 only', hydroTitle: 'Big hydro (MW)', resTitle: 'RES (MW)', pairSub: 'Hourly average. Solid line: ISP1. Dashed line: DAM.',
          surTitle: 'Price and residual surplus', surSub: '15-minute intervals. Bars: residual surplus (MW). Line: DAM price (€/MWh). Shaded: possible grid congestion.',
          price: 'DAM price (€/MWh)', surplus: 'Residual surplus (MW)', imports: 'DAM imports (MW)', ispImports: 'ISP1 imports (MW)', band: 'Possible grid congestion' },
    t3: { thermTitle: 'Thermal: lignite and gas', thermSub: 'MW, hourly average. The grey step line is the sum of the minimum-output constraints active in each hour.',
          cons: 'Constraints (sum)', heatTitle: 'ISP1 schedule by unit', heatSub: 'MW, hourly average. The DAM has no data per unit.', heatNone: 'No thermal unit is scheduled.',
          consTitle: 'Minimum-output constraints in ISP1', consSub: 'Plant, limit in MW and the hours in which it applies (Greek time).', allDay: 'all day',
          lead: 'ISP1 lists {n} minimum-output constraints; at their peak they add up to {peak} MW. Between {a} and {b} ISP1 schedules {add} MW more gas and lignite than the DAM. The two coincide; the files do not say that one causes the other.',
          none: 'No minimum-output constraint is listed for this day.', noData: 'Constraint data are not available for this day.', moreWin: '+{n} more time windows', retired: 'Retired units (Agios Dimitrios 1–5, Megalopoli 4) are not shown.', noIsp: 'ISP1 is not published yet, so there is no unit schedule or constraint list.' },
    units: { PTOLEMAIDA5: 'Ptolemaida 5', KORINTHOS_POWER: 'Korinthos Power', HERON_CC: 'Heron CC', ALIVERI5: 'Aliveri 5', ALOUMINIO: 'Aluminium', THISVI_CC: 'Thisvi CC', PROTERGIA_CC: 'Protergia CC', AG_NIKOLAOS2: 'Ag. Nikolaos 2', KOMOTINI_POWER: 'Komotini Power', MEGALOPOLI_V: 'Megalopoli V', THESSALONIKI_CC: 'Thessaloniki CC', LAVRIO4: 'Lavrio 4', LAVRIO5: 'Lavrio 5', KOMOTINI: 'Komotini', AG_DIMITRIOS3: 'Agios Dimitrios 3', AG_DIMITRIOS5: 'Agios Dimitrios 5' },
    soon: { title: 'This view is being built', text: 'It will arrive in the next releases. Everything shown on “Day at a glance” already comes from the same daily data.' },
    modalTitle: 'Methodology, assumptions and limitations', modalShort: 'Short', modalDetailed: 'Detailed',
    footerNote: '',
    failed: 'No data for this day.'
  },
  el: {
    locale: 'el-GR', htmlLang: 'el',
    title: 'Ανάλυση DAM και ISP1 Ελληνικής Αγοράς',
    hub: 'Greek Energy Hub',
    load: { title: 'Εκκίνηση', g1: 'Λήψη δεδομένων', g2: 'Προετοιμασία προβολών', s1: 'Ανάγνωση δεδομένων',
            ready: 'Το dashboard είναι έτοιμο!', error: 'Τα δεδομένα δεν φορτώθηκαν. Ανανεώστε τη σελίδα σε λίγα λεπτά.' },
    lastUpdate: 'Τελευταία ενημέρωση:', lastUpdateMobile: 'Ενημέρωση:', nextUpdate: 'Επόμενη ενημέρωση:', nextUpdateMobile: 'Επόμενη:',
    dateLabel: 'Ημέρα:', today: 'σήμερα', tomorrow: 'αύριο',
    methodLink: 'Μεθοδολογία →', btnMethodology: 'Μεθοδολογία & Παραδοχές', btnMethodologyShort: 'Μεθοδολογία',
    toTop: 'Επάνω', close: 'Κλείσιμο',
    pill: { complete: 'Πλήρη δεδομένα', incomplete: 'Ελλιπή δεδομένα', check: 'Έλεγχος δεδομένων', awaiting: 'Αναμονή ISP1',
            completeShort: 'Πλήρη', incompleteShort: 'Ελλιπή', checkShort: 'Έλεγχος', awaitingShort: 'Αναμονή' },
    tabs: { glance: 'Η ημέρα με μια ματιά', reshuffle: 'Αλλαγές ΑΔΜΗΕ', thermal: 'Θερμικά και περιορισμοί', borders: 'Σύνορα και Κρήτη', history: 'Ιστορικό και εποχές' },
    axisHour: 'Ώρα Ελλάδας', hourWord: 'Ώρα',
    more: 'Περισσότερα', less: 'Λιγότερα',
    solidIsp: 'συνεχής γραμμή: ISP1', dashedDam: 'διακεκομμένη γραμμή: DAM', onlyDam: 'DAM (το ISP1 δεν έχει βγει ακόμα)',
    stage1: 'Στάδιο 1 · μετά τη DAM', stage2: 'Στάδιο 2 · μετά το ISP1',
    pub: 'δημοσιεύτηκε {t}',
    isp1Pending: 'Το ISP1 δεν έχει δημοσιευτεί ακόμα. Συνήθως βγαίνει το βράδυ, περίπου από τις 17:55 έως τις 19:05 ώρα Ελλάδας.',
    s1: {
      price: 'Η τιμή της αγοράς επόμενης ημέρας έχει μέσο όρο {avg} €/MWh, από {min} στις {minAt} έως {max} στις {maxAt}.',
      res: 'Οι ΑΠΕ (μαζί με την Κρήτη) είναι το {share}% της ζήτησης της ημέρας ({res} από {demand} GWh).',
      thermal: 'Από τις {a} έως τις {b} μένουν σε λειτουργία στη DAM μόνο {mw} MW αερίου και λιγνίτη.',
      zero: 'Σε {n} διαστήματα ({from}–{to}) η τιμή είναι περίπου μηδέν ενώ η DAM εξακολουθεί να εισάγει περίπου {mw} MW.'
    },
    s2: {
      thermal: 'Κατά μέσο όρο από τις {a} έως τις {b} το ISP1 αλλάζει τον λιγνίτη κατά {lig} MW και το αέριο κατά {gas} MW, και τα θερμικά κατά {ev} MW στις {eh}.',
      hydro: 'Τα μεγάλα υδροηλεκτρικά πηγαίνουν από {dam} σε {isp} GWh ({pct}).',
      res: 'Η πρόβλεψη ΑΠΕ είναι {pct} σε σχέση με τη DAM ({isp} έναντι {dam} GWh).',
      surplus: 'Residual surplus: {gwh} GWh σε {n} διαστήματα, με κορύφωση {peak} MW στις {at}.',
      noSurplus: 'Το ISP1 δεν δείχνει residual surplus.',
      cong: 'Σε {n} διαστήματα ({from}–{to}) η τιμή της DAM είναι περίπου μηδέν ενώ το ISP1 κρατά ακόμη περίπου {imp} MW εισαγωγές δίπλα σε πλεόνασμα περίπου {sur} MW: πιθανό grid congestion.',
      borders: 'Καθαρές εξαγωγές: {dam} GWh στη DAM, {auc} μετά τις ενδοημερήσιες δημοπρασίες, {xb} μετά το XBID.'
    },
    sig: {
      cong: 'Πιθανό grid congestion · {from}–{to}',
      zero: 'Μηδενική τιμή με εισαγωγές · {from}–{to}',
      lignite: 'Λιγνίτης: {names}',
      noLignite: 'Λιγνίτης: καμία μονάδα στο πρόγραμμα',
      crete: 'Η Κρήτη παίρνει {gwh} GWh από την ηπειρωτική'
    },
    kpi: { lignite: 'Λιγνίτης', gas: 'Αέριο', hydro: 'Μεγάλα υδροηλεκτρικά', res: 'ΑΠΕ', exports: 'Καθαρές εξαγωγές', surplus: 'Residual surplus',
           dam: 'DAM', isp: 'ISP1', unit: 'GWh', ispOnly: 'Μόνο ISP1, χωρίς αντίστοιχο στη DAM', pending: 'Αναμονή ISP1' },
    hero: { title: 'Θερμική παραγωγή: λιγνίτης και αέριο', sub: 'MW, ωριαίος μέσος όρος. Τι προγραμμάτισε η αγορά και τι ο ΑΔΜΗΕ.',
            lignite: 'Λιγνίτης', gas: 'Αέριο', total: 'Σύνολο θερμικών', dam: 'DAM', isp: 'ISP1', diff: 'Μεταβολή' },
    t2: { tableTitle: 'DAM και ISP1 ανά κατηγορία', tableSub: 'GWh για την ημέρα. Μεταβολή = ISP1 μείον DAM.',
          cols: { cat: 'Κατηγορία', dam: 'DAM', isp: 'ISP1', chg: 'Μεταβολή' },
          rows: { lignite: 'Λιγνίτης', gas: 'Αέριο', hydro: 'Μεγάλα υδροηλεκτρικά', res: 'ΑΠΕ (με Κρήτη)', storage: 'Αποθήκευση, καθαρή εκφόρτιση', pump: 'Κατανάλωση άντλησης', exports: 'Καθαρές εξαγωγές (σύνορα)', crete: 'Κρήτη, καθαρά από την ηπειρωτική', surplus: 'Residual surplus' },
          onlyIsp: 'Μόνο ISP1', hydroTitle: 'Μεγάλα υδροηλεκτρικά (MW)', resTitle: 'ΑΠΕ (MW)', pairSub: 'Ωριαίος μέσος όρος. Συνεχής γραμμή: ISP1. Διακεκομμένη: DAM.',
          surTitle: 'Τιμή και residual surplus', surSub: 'Διαστήματα 15 λεπτών. Μπάρες: residual surplus (MW). Γραμμή: τιμή DAM (€/MWh). Σκιασμένο: πιθανό grid congestion.',
          price: 'Τιμή DAM (€/MWh)', surplus: 'Residual surplus (MW)', imports: 'Εισαγωγές DAM (MW)', ispImports: 'Εισαγωγές ISP1 (MW)', band: 'Πιθανό grid congestion' },
    t3: { thermTitle: 'Θερμικά: λιγνίτης και αέριο', thermSub: 'MW, ωριαίος μέσος όρος. Η γκρι σκαλωτή γραμμή είναι το άθροισμα των περιορισμών ελάχιστης παραγωγής που ισχύουν σε κάθε ώρα.',
          cons: 'Περιορισμοί (άθροισμα)', heatTitle: 'Πρόγραμμα ISP1 ανά μονάδα', heatSub: 'MW, ωριαίος μέσος όρος. Η DAM δεν έχει στοιχεία ανά μονάδα.', heatNone: 'Δεν προγραμματίζεται καμία θερμική μονάδα.',
          consTitle: 'Περιορισμοί ελάχιστης παραγωγής στο ISP1', consSub: 'Μονάδα, όριο σε MW και ώρες ισχύος (ώρα Ελλάδας).', allDay: 'όλη την ημέρα',
          lead: 'Το ISP1 καταγράφει {n} περιορισμούς ελάχιστης παραγωγής· στην κορύφωσή τους αθροίζουν {peak} MW. Από τις {a} έως τις {b} το ISP1 προγραμματίζει {add} MW περισσότερο αέριο και λιγνίτη από τη DAM. Τα δύο συμπίπτουν· τα αρχεία δεν λένε ότι το ένα προκαλεί το άλλο.',
          none: 'Δεν καταγράφεται περιορισμός ελάχιστης παραγωγής για αυτή την ημέρα.', noData: 'Δεν υπάρχουν δεδομένα περιορισμών για αυτή την ημέρα.', moreWin: '+{n} ακόμη χρονικά παράθυρα', retired: 'Οι αποσυρμένες μονάδες (Αγ. Δημήτριος 1–5, Μεγαλόπολη 4) δεν εμφανίζονται.', noIsp: 'Το ISP1 δεν έχει βγει ακόμα, άρα δεν υπάρχει πρόγραμμα μονάδων ή λίστα περιορισμών.' },
    units: { PTOLEMAIDA5: 'Πτολεμαΐδα 5', KORINTHOS_POWER: 'Κόρινθος Power', HERON_CC: 'Heron CC', ALIVERI5: 'Αλιβέρι 5', ALOUMINIO: 'Αλουμίνιον', THISVI_CC: 'Θίσβη CC', PROTERGIA_CC: 'Protergia CC', AG_NIKOLAOS2: 'Αγ. Νικόλαος 2', KOMOTINI_POWER: 'Κομοτηνή Power', MEGALOPOLI_V: 'Μεγαλόπολη V', THESSALONIKI_CC: 'Θεσσαλονίκη CC', LAVRIO4: 'Λαύριο 4', LAVRIO5: 'Λαύριο 5', KOMOTINI: 'Κομοτηνή', AG_DIMITRIOS3: 'Αγ. Δημήτριος 3', AG_DIMITRIOS5: 'Αγ. Δημήτριος 5' },
    soon: { title: 'Αυτή η προβολή είναι υπό κατασκευή', text: 'Θα έρθει στις επόμενες εκδόσεις. Ό,τι φαίνεται στην «Η ημέρα με μια ματιά» προέρχεται ήδη από τα ίδια ημερήσια δεδομένα.' },
    modalTitle: 'Μεθοδολογία, παραδοχές και περιορισμοί', modalShort: 'Σύντομη', modalDetailed: 'Αναλυτική',
    footerNote: '',
    failed: 'Δεν υπάρχουν δεδομένα για αυτή την ημέρα.'
  }
};

/* Methodology: one section per tab. short = bullets, detailed = paragraphs. */
window.METHOD = {
  en: [
    { id: 'm-glance', tab: 'glance', title: 'Day at a glance',
      short: [
        'Two stages: the DAM results (HEnEx) come out around 14:15 for the next day; ISP1, the first scheduling run of ADMIE, comes out in the evening.',
        'All numbers are computed in Python from the published files; the page only shows them.',
        'Times are Greek clock time. The market files use CET: a market day runs 01:00 to 01:00 Greek time, and on the two daylight-saving days it has 23 or 25 hours.',
        'RES = DAM “RES” + “Crete RES”, compared with ISP1 “Renewables”. Lignite and gas come from the unit list of ISP1 (only Ptolemaida 5 is an active lignite unit).',
        'Residual surplus is the ISP1 row “Energy Surplus”: renewable energy ISP1 expects to curtail. The DAM has no equivalent.',
        'Possible grid congestion: DAM price of 1 €/MWh or less, a residual surplus and imports in the same interval. It is an observation, not a proof: neighbours’ prices can also be zero or negative.'
      ],
      detailed: [
        'Sources. DAM: HEnEx “Results” file (every day around 14:15). ISP1 and the daily dispatch of the Crete system: ADMIE market-data API (ISP1 in the evening, between about 17:55 and 19:05; Crete in the morning of the previous day). Data come from public publications of HEnEx and ADMIE/IPTO; this is an independent analysis, not an official publication.',
        'Alignment. DAM and ISP1 files have the same 15-minute intervals, keyed by day and interval number. The page shows hourly means (MW); energy is the sum of 15-minute values divided by 4000 (GWh).',
        'Not the same thing. The DAM is a market result. ISP1 starts from market results, including the intraday auctions (CRIDA), and adds ADMIE’s forecasts, network limits and reliability needs. A difference between the two is therefore not automatically an intervention of ADMIE: for cross-border flows the page shows the step after the intraday auctions and the step after XBID separately.',
        'Lignite and gas. ISP1 thermal units are classified in a unit list kept in the repository (config/units.json). Retired units are never reported as stopped. A unit missing from the list is flagged in the day’s checks, not added silently.',
        'Missing data. A technology that does not appear in a DAM file had no trade (0). A category that did not exist yet in the market, such as storage in early 2026, is shown as “–”, never as 0.',
        'Data quality. “Complete data”: DAM, ISP1 and the Crete file are present and all checks pass. “Incomplete data”: a source has no file for that day. “Data check”: a check failed (for example the Crete file disagrees with the DAM and is not used). “Awaiting ISP1”: the DAM is out and ISP1 is not yet.',
        'Limits. Everything is a schedule or a forecast, not a measurement. ADMIE’s files can be replaced after publication and the interface gives only the current file. The congestion flag cannot tell congestion from low neighbouring prices without neighbours’ prices.'
      ] },
    { id: 'm-reshuffle', tab: 'reshuffle', title: 'ADMIE reshuffle', short: ['The table compares every category of the DAM with ISP1 for the same day, in GWh. The charts show hourly MW.', 'Storage, net discharge = discharge minus charge. Pump consumption is energy used for pumping. Storage did not exist in the DAM in early 2026 and is then shown as “–”.', 'Net exports = exports minus imports on the five borders. Crete is shown apart: its net draw from the mainland is the same in the DAM, in ADMIE’s dispatch file and in ISP1.', 'Residual surplus exists only in ISP1. The price and surplus chart uses 15-minute intervals; the shaded band marks possible grid congestion (same rule as on “Day at a glance”).', 'A difference is not automatically an intervention of ADMIE: ISP1 includes the intraday auctions and ADMIE’s own forecasts.'], detailed: ['What is compared. DAM and ISP1 have the same 15-minute intervals. The table adds the intervals (sum of MW divided by 4000 = GWh); the charts show the average of each hour in Greek clock time.', 'Why a change appears. ISP1 starts from the market result (DAM plus intraday auctions), applies ADMIE’s forecasts of demand and renewables, the limits of the network and the reserve needs, and schedules units accordingly. Each category therefore mixes market effects and system effects, and the files do not separate them except for the cross-border flows, where the step after the intraday auctions is shown on “Borders & Crete”.', 'Renewables. The DAM value is “RES” plus “Crete RES”; the ISP1 value is its “Renewables” row, which includes Crete. The ISP1 row “Total RES Production” covers only a few dispatchable units and is not used.', 'Residual surplus. It is the ISP1 row “Energy Surplus”, stored as a negative number in the file and shown here as a positive one. It is a forecast of energy that will not find demand, not a measurement of curtailment.'] },
    { id: 'm-thermal', tab: 'thermal', title: 'Thermal & constraints', short: ['Thermal units come from the ISP1 unit list. Lignite = Ptolemaida 5 (the only active lignite unit); gas = all other thermal units. Retired units are not shown.', 'The heat map shows ISP1’s schedule per unit (hourly mean MW). The DAM has no data per unit.', 'Constraints are rows of the ISP1 sheet “GenericConstraints”: a minimum output (type INTERV_GE) of a plant in given hours. The grey line sums the constraints active in each hour (largest limit per plant).', 'The coincidence of constraints and added thermal output is not proof that one causes the other.'], detailed: ['Time. The constraint hours in the ISP1 file are in market time (CET); the page converts them to Greek time (one hour later).', 'Plants. A constraint can list several sub-units of one plant (for example ALOUMINIO_1GT, ALOUMINIO_2GT); the page merges them under the plant name and counts the limit once.', 'Limits of the reading. A minimum-output constraint forces a unit to run, but ISP1 can also schedule a unit above its minimum for other reasons (reserves, forecasts, network). The files do not give the reason of each constraint.'] },
    { id: 'm-borders', tab: 'borders', title: 'Borders & Crete', short: ['This view is being built.'], detailed: ['This view is being built.'] },
    { id: 'm-history', tab: 'history', title: 'History & seasons', short: ['This view is being built.'], detailed: ['This view is being built.'] }
  ],
  el: [
    { id: 'm-glance', tab: 'glance', title: 'Η ημέρα με μια ματιά',
      short: [
        'Δύο στάδια: τα αποτελέσματα της DAM (HEnEx) βγαίνουν γύρω στις 14:15 για την επόμενη ημέρα· το ISP1, το πρώτο πρόγραμμα του ΑΔΜΗΕ, βγαίνει το βράδυ.',
        'Όλα τα νούμερα υπολογίζονται σε Python από τα δημοσιευμένα αρχεία· η σελίδα τα εμφανίζει μόνο.',
        'Οι ώρες είναι ώρα Ελλάδας. Τα αρχεία της αγοράς είναι σε CET: η ημέρα αγοράς τρέχει από 01:00 έως 01:00 ώρα Ελλάδας, και τις δύο ημέρες αλλαγής ώρας έχει 23 ή 25 ώρες.',
        'ΑΠΕ = «RES» της DAM + «Crete RES», σε σύγκριση με το «Renewables» του ISP1. Λιγνίτης και αέριο προέρχονται από τη λίστα μονάδων του ISP1 (μόνο η Πτολεμαΐδα 5 είναι ενεργή λιγνιτική μονάδα).',
        'Το residual surplus είναι η γραμμή «Energy Surplus» του ISP1: ενέργεια ΑΠΕ που το ISP1 περιμένει να περικοπεί. Η DAM δεν έχει αντίστοιχο.',
        'Πιθανό grid congestion: τιμή DAM 1 €/MWh ή λιγότερο, residual surplus και εισαγωγές στο ίδιο διάστημα. Είναι παρατήρηση, όχι απόδειξη: οι τιμές των γειτόνων μπορεί επίσης να είναι μηδενικές ή αρνητικές.'
      ],
      detailed: [
        'Πηγές. DAM: αρχείο «Results» του HEnEx (κάθε ημέρα γύρω στις 14:15). ISP1 και ημερήσιος προγραμματισμός του συστήματος Κρήτης: API δεδομένων αγοράς του ΑΔΜΗΕ (ISP1 το βράδυ, περίπου από 17:55 έως 19:05· Κρήτη το πρωί της προηγούμενης ημέρας). Τα δεδομένα προέρχονται από δημόσιες δημοσιεύσεις του HEnEx και του ΑΔΜΗΕ/IPTO· πρόκειται για ανεξάρτητη ανάλυση, όχι επίσημη δημοσίευση.',
        'Ευθυγράμμιση. Τα αρχεία DAM και ISP1 έχουν τα ίδια 15λεπτα διαστήματα, με κλειδί την ημέρα και τον αριθμό διαστήματος. Η σελίδα δείχνει ωριαίους μέσους όρους (MW)· η ενέργεια είναι το άθροισμα των 15λεπτων τιμών διά 4000 (GWh).',
        'Δεν είναι το ίδιο πράγμα. Η DAM είναι αποτέλεσμα αγοράς. Το ISP1 ξεκινά από τα αποτελέσματα της αγοράς, μαζί με τις ενδοημερήσιες δημοπρασίες (CRIDA), και προσθέτει προβλέψεις, όρια δικτύου και ανάγκες αξιοπιστίας του ΑΔΜΗΕ. Μια διαφορά μεταξύ τους δεν είναι αυτόματα παρέμβαση του ΑΔΜΗΕ: για τις διασυνοριακές ροές η σελίδα δείχνει χωριστά το βήμα μετά τις ενδοημερήσιες δημοπρασίες και το βήμα μετά το XBID.',
        'Λιγνίτης και αέριο. Οι θερμικές μονάδες του ISP1 ταξινομούνται σε λίστα μονάδων που τηρείται στο repository (config/units.json). Οι αποσυρμένες μονάδες δεν αναφέρονται ποτέ ως «σταμάτησαν». Μονάδα που λείπει από τη λίστα σημαίνεται στους ελέγχους της ημέρας και δεν προστίθεται σιωπηλά.',
        'Ελλείψεις. Τεχνολογία που δεν εμφανίζεται σε αρχείο DAM δεν είχε συναλλαγή (0). Κατηγορία που δεν υπήρχε ακόμη στην αγορά, όπως η αποθήκευση στις αρχές του 2026, εμφανίζεται ως «–», ποτέ ως 0.',
        'Ποιότητα δεδομένων. «Πλήρη δεδομένα»: υπάρχουν DAM, ISP1 και αρχείο Κρήτης και περνούν όλοι οι έλεγχοι. «Ελλιπή δεδομένα»: μια πηγή δεν έχει αρχείο για την ημέρα. «Έλεγχος δεδομένων»: απέτυχε κάποιος έλεγχος (π.χ. το αρχείο Κρήτης διαφωνεί με τη DAM και δεν χρησιμοποιείται). «Αναμονή ISP1»: η DAM έχει βγει και το ISP1 όχι ακόμα.',
        'Όρια. Όλα είναι προγράμματα ή προβλέψεις, όχι μετρήσεις. Τα αρχεία του ΑΔΜΗΕ μπορεί να αντικατασταθούν μετά τη δημοσίευση και η διεπαφή δίνει μόνο το τρέχον αρχείο. Η ένδειξη congestion δεν μπορεί να ξεχωρίσει το congestion από χαμηλές τιμές γειτόνων χωρίς τις τιμές των γειτόνων.'
      ] },
    { id: 'm-reshuffle', tab: 'reshuffle', title: 'Αλλαγές ΑΔΜΗΕ', short: ['Ο πίνακας συγκρίνει κάθε κατηγορία της DAM με το ISP1 για την ίδια ημέρα, σε GWh. Τα γραφήματα δείχνουν ωριαία MW.', 'Αποθήκευση, καθαρή εκφόρτιση = εκφόρτιση μείον φόρτιση. Η κατανάλωση άντλησης είναι η ενέργεια που χρησιμοποιείται για άντληση. Η αποθήκευση δεν υπήρχε στη DAM στις αρχές του 2026 και τότε εμφανίζεται ως «–».', 'Καθαρές εξαγωγές = εξαγωγές μείον εισαγωγές στα πέντε σύνορα. Η Κρήτη εμφανίζεται χωριστά: η καθαρή λήψη της από την ηπειρωτική είναι ίδια στη DAM, στο αρχείο προγραμματισμού του ΑΔΜΗΕ και στο ISP1.', 'Το residual surplus υπάρχει μόνο στο ISP1. Το γράφημα τιμής και surplus χρησιμοποιεί διαστήματα 15 λεπτών· η σκιασμένη περιοχή δείχνει πιθανό grid congestion (ίδιος κανόνας με την «Η ημέρα με μια ματιά»).', 'Μια διαφορά δεν είναι αυτόματα παρέμβαση του ΑΔΜΗΕ: το ISP1 περιλαμβάνει τις ενδοημερήσιες δημοπρασίες και τις δικές του προβλέψεις.'], detailed: ['Τι συγκρίνεται. Η DAM και το ISP1 έχουν τα ίδια 15λεπτα διαστήματα. Ο πίνακας αθροίζει τα διαστήματα (άθροισμα MW διά 4000 = GWh)· τα γραφήματα δείχνουν τον μέσο όρο κάθε ώρας σε ώρα Ελλάδας.', 'Γιατί εμφανίζεται μεταβολή. Το ISP1 ξεκινά από το αποτέλεσμα της αγοράς (DAM και ενδοημερήσιες δημοπρασίες), εφαρμόζει τις προβλέψεις ζήτησης και ΑΠΕ του ΑΔΜΗΕ, τα όρια του δικτύου και τις ανάγκες εφεδρειών, και προγραμματίζει τις μονάδες αναλόγως. Κάθε κατηγορία αναμειγνύει έτσι επιδράσεις αγοράς και συστήματος, και τα αρχεία δεν τις διαχωρίζουν, εκτός από τις διασυνοριακές ροές, όπου το βήμα μετά τις ενδοημερήσιες δημοπρασίες φαίνεται στα «Σύνορα και Κρήτη».', 'Ανανεώσιμες. Η τιμή της DAM είναι το «RES» συν το «Crete RES»· η τιμή του ISP1 είναι η γραμμή «Renewables», που περιλαμβάνει την Κρήτη. Η γραμμή «Total RES Production» του ISP1 καλύπτει μόνο λίγες κατανεμόμενες μονάδες και δεν χρησιμοποιείται.', 'Residual surplus. Είναι η γραμμή «Energy Surplus» του ISP1, αποθηκευμένη ως αρνητικός αριθμός στο αρχείο και εμφανιζόμενη εδώ ως θετική. Είναι πρόβλεψη ενέργειας που δεν θα βρει ζήτηση, όχι μέτρηση περικοπής.'] },
    { id: 'm-thermal', tab: 'thermal', title: 'Θερμικά και περιορισμοί', short: ['Οι θερμικές μονάδες προέρχονται από τη λίστα μονάδων του ISP1. Λιγνίτης = Πτολεμαΐδα 5 (η μόνη ενεργή λιγνιτική μονάδα)· αέριο = όλες οι άλλες θερμικές μονάδες. Οι αποσυρμένες μονάδες δεν εμφανίζονται.', 'Ο χάρτης θερμότητας δείχνει το πρόγραμμα του ISP1 ανά μονάδα (ωριαίο μέσο MW). Η DAM δεν έχει στοιχεία ανά μονάδα.', 'Οι περιορισμοί είναι γραμμές του φύλλου «GenericConstraints» του ISP1: ελάχιστη παραγωγή (τύπος INTERV_GE) μιας μονάδας σε συγκεκριμένες ώρες. Η γκρι γραμμή αθροίζει τους περιορισμούς που ισχύουν σε κάθε ώρα (το μεγαλύτερο όριο ανά μονάδα).', 'Η σύμπτωση περιορισμών και πρόσθετης θερμικής παραγωγής δεν αποδεικνύει ότι το ένα προκαλεί το άλλο.'], detailed: ['Ώρα. Οι ώρες των περιορισμών στο αρχείο του ISP1 είναι σε ώρα αγοράς (CET)· η σελίδα τις μετατρέπει σε ώρα Ελλάδας (μία ώρα αργότερα).', 'Μονάδες. Ένας περιορισμός μπορεί να αναφέρει πολλές υπομονάδες της ίδιας μονάδας (π.χ. ALOUMINIO_1GT, ALOUMINIO_2GT)· η σελίδα τις συγχωνεύει με το όνομα της μονάδας και μετρά το όριο μία φορά.', 'Όρια της ανάγνωσης. Ένας περιορισμός ελάχιστης παραγωγής υποχρεώνει μια μονάδα να λειτουργεί, αλλά το ISP1 μπορεί να προγραμματίσει μονάδα πάνω από το ελάχιστο και για άλλους λόγους (εφεδρείες, προβλέψεις, δίκτυο). Τα αρχεία δεν δίνουν τον λόγο κάθε περιορισμού.'] },
    { id: 'm-borders', tab: 'borders', title: 'Σύνορα και Κρήτη', short: ['Αυτή η προβολή είναι υπό κατασκευή.'], detailed: ['Αυτή η προβολή είναι υπό κατασκευή.'] },
    { id: 'm-history', tab: 'history', title: 'Ιστορικό και εποχές', short: ['Αυτή η προβολή είναι υπό κατασκευή.'], detailed: ['Αυτή η προβολή είναι υπό κατασκευή.'] }
  ]
};
