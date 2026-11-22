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
    units: { PTOLEMAIDA5: 'Ptolemaida 5' },
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
    units: { PTOLEMAIDA5: 'Πτολεμαΐδα 5' },
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
    { id: 'm-reshuffle', tab: 'reshuffle', title: 'ADMIE reshuffle', short: ['This view is being built.'], detailed: ['This view is being built.'] },
    { id: 'm-thermal', tab: 'thermal', title: 'Thermal & constraints', short: ['This view is being built.'], detailed: ['This view is being built.'] },
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
    { id: 'm-reshuffle', tab: 'reshuffle', title: 'Αλλαγές ΑΔΜΗΕ', short: ['Αυτή η προβολή είναι υπό κατασκευή.'], detailed: ['Αυτή η προβολή είναι υπό κατασκευή.'] },
    { id: 'm-thermal', tab: 'thermal', title: 'Θερμικά και περιορισμοί', short: ['Αυτή η προβολή είναι υπό κατασκευή.'], detailed: ['Αυτή η προβολή είναι υπό κατασκευή.'] },
    { id: 'm-borders', tab: 'borders', title: 'Σύνορα και Κρήτη', short: ['Αυτή η προβολή είναι υπό κατασκευή.'], detailed: ['Αυτή η προβολή είναι υπό κατασκευή.'] },
    { id: 'm-history', tab: 'history', title: 'Ιστορικό και εποχές', short: ['Αυτή η προβολή είναι υπό κατασκευή.'], detailed: ['Αυτή η προβολή είναι υπό κατασκευή.'] }
  ]
};
