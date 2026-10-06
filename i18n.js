// Texts of the page in German and English. Static texts carry data-i18n="key"; app.js uses I18N.t(key, vars).
window.I18N = (() => {
  const T = {
    eyebrow: { de: "Systematische Strategie · ETH &amp; BTC in Euro", en: "Systematic strategy · ETH &amp; BTC in euros" },
    title: { de: "M6F+ gegen Halten", en: "M6F+ vs. holding" },
    lede: {
      de: "Wie sich die Strategie M6F+ seit Februar 2020 im Vergleich zum einfachen Halten entwickelt hätte – mit Gebühren, Woche für Woche. Wähle Markt, Startdatum und Betrag.",
      en: "How the M6F+ strategy would have done since February 2020 compared with simply holding – after fees, week by week. Pick the market, the start date and the amount.",
    },
    "what.h": { de: "Was ist M6F+?", en: "What is M6F+?" },
    "what.p1": {
      de: "M6F+ ist eine regelbasierte Strategie für Ether (ETH) und Bitcoin (BTC) in Euro. Sie entscheidet automatisch, wie viel des Kapitals gerade im Coin steckt und wie viel als Euro wartet – von 0 bis 100 %, in festen Schritten. Gekauft und verkauft wird nur, wenn sich diese Entscheidung ändert, im Schnitt zwei- bis dreimal pro Woche.",
      en: "M6F+ is a rule-based strategy for Ether (ETH) and Bitcoin (BTC) in euros. It decides automatically how much of the capital is in the coin and how much waits in euros – from 0 to 100 %, in fixed steps. It only buys or sells when that decision changes, two to three times a week on average.",
    },
    "what.p2": {
      de: "Das Ziel ist nicht, jede Rallye ganz mitzunehmen, sondern große Einbrüche zu vermeiden und über mehrere Jahre mehr übrig zu behalten als beim einfachen Halten. Wie die Regeln im Einzelnen aussehen, bleibt hier bewusst offen – die Seite zeigt nur, was dabei herausgekommen wäre.",
      en: "The aim is not to ride every rally in full, but to avoid the big crashes and keep more than simply holding over several years. The rules themselves are deliberately not shown here – this page only shows what they would have achieved.",
    },
    "facts.h": { de: "Kurz gesagt", en: "In short" },
    "facts.eth": { de: "<b>ETH seit Februar 2020:</b> ×42,8 mit M6F+, ×14,9 gehalten", en: "<b>ETH since February 2020:</b> ×42.8 with M6F+, ×14.9 held" },
    "facts.btc": { de: "<b>BTC seit Februar 2020:</b> ×22,0 mit M6F+, ×9,1 gehalten", en: "<b>BTC since February 2020:</b> ×22.0 with M6F+, ×9.1 held" },
    "facts.dd": { de: "<b>Größter Rückgang:</b> 37 % (ETH) und 29 % (BTC) statt 77 % und 73 %", en: "<b>Largest drawdown:</b> 37 % (ETH) and 29 % (BTC) instead of 77 % and 73 %" },
    "facts.y22": { de: "<b>Im Krisenjahr 2022:</b> −13 % (ETH) und −19 % (BTC) statt −69 % und −65 %", en: "<b>In the crash year 2022:</b> −13 % (ETH) and −19 % (BTC) instead of −69 % and −65 %" },
    "facts.but": {
      de: "<b>Dafür:</b> In starken Rallyes bleibt M6F+ oft hinter dem Halten zurück, und über wenige Wochen ist das Ergebnis Zufall.",
      en: "<b>The price:</b> in strong rallies M6F+ often lags holding, and over a few weeks the result is chance.",
    },
    "try.h": { de: "Selbst ausprobieren", en: "Try it yourself" },
    "try.p": {
      de: "Alle Zahlen und Diagramme unten richten sich nach dieser Auswahl: der Markt, der Tag des Einstiegs und der Betrag. Bei „60 % ETH / 40 % BTC“ wird das Geld am Start aufgeteilt und beide Teile laufen getrennt weiter.",
      en: "All figures and charts below follow this choice: the market, the day you start and the amount. With “60 % ETH / 40 % BTC” the money is split at the start and both parts run separately.",
    },
    mix: { de: "60 % ETH / 40 % BTC", en: "60 % ETH / 40 % BTC" },
    start: { de: "Start", en: "Start" },
    amount: { de: "Betrag", en: "Amount" },
    linear: { de: "Linear", en: "Linear" },
    log: { de: "Logarithmisch", en: "Logarithmic" },
    hold: { de: "Halten", en: "Holding" },
    "equity.section": { de: "Wie sich das Geld entwickelt hätte", en: "How the money would have grown" },
    "equity.h": { de: "Wertentwicklung", en: "Portfolio value" },
    "equity.p": {
      de: "Der Wert des Depots ab dem gewählten Starttag, nach allen Gebühren. Fahre mit der Maus über die Kurven, um den Stand an einem Tag zu sehen. Die logarithmische Skala zeigt prozentuale Bewegungen gleich groß – so lassen sich frühe und späte Jahre besser vergleichen.",
      en: "The value of the portfolio from the chosen start day, after all fees. Hover over the lines to see the value on a given day. The logarithmic scale shows percentage moves at the same size – early and late years compare better.",
    },
    "dd.section": { de: "Wie tief es zwischendurch ging", en: "How deep it fell along the way" },
    "dd.h": { de: "Rückgang vom bisherigen Höchststand", en: "Drawdown from the previous high" },
    "dd.p": {
      de: "Wie weit das Depot jeweils unter seinem bisher höchsten Stand lag. Das ist der Verlust, den man auf dem Weg aushalten muss – oft der Grund, warum Anleger im falschen Moment aussteigen.",
      en: "How far the portfolio was below its highest value so far. That is the loss you have to sit through on the way – often the reason investors get out at the wrong moment.",
    },
    "years.section": { de: "Gute und schlechte Jahre", en: "Good years and bad years" },
    "years.h": { de: "Ergebnis je Kalenderjahr", en: "Return per calendar year" },
    "years.p": {
      de: "Das Ergebnis jedes Kalenderjahrs für sich. Im Bullenmarkt liegt Halten meist vorn, in Abwärtsjahren verliert M6F+ deutlich weniger. Mit * markierte Jahre sind angebrochen.",
      en: "Each calendar year on its own. In bull markets holding is usually ahead, in down years M6F+ loses far less. Years marked * are incomplete.",
    },
    astable: { de: "Als Tabelle", en: "As a table" },
    "starts.section": { de: "Hängt es vom Einstieg ab?", en: "Does the start date matter?" },
    "starts.h": { de: "Jede Woche ein möglicher Start", en: "Every week a possible start" },
    "starts.p": {
      de: "Niemand erwischt den perfekten Einstieg. Deshalb hier jeder mögliche Starttag seit 2020: Wie oft wäre man nach der gewählten Dauer im Plus gewesen, wie lief der typische Fall, und wie schlimm der schlechteste? Die Kurve zeigt das Ergebnis für jeden Starttag.",
      en: "Nobody catches the perfect entry. So here is every possible start since 2020: how often you would have been in profit after the chosen period, how the typical case went, and how bad the worst one was. The line shows the result for every start day.",
    },
    h30: { de: "1 Monat", en: "1 month" }, h91: { de: "3 Monate", en: "3 months" }, h182: { de: "6 Monate", en: "6 months" },
    h365: { de: "1 Jahr", en: "1 year" }, h730: { de: "2 Jahre", en: "2 years" },
    after30: { de: "1 Monat", en: "1 month" }, after91: { de: "3 Monaten", en: "3 months" }, after182: { de: "6 Monaten", en: "6 months" },
    after365: { de: "1 Jahr", en: "1 year" }, after730: { de: "2 Jahren", en: "2 years" },
    "faq.h": { de: "Häufige Fragen", en: "Questions" },
    "faq.q1": { de: "Warum liegt Halten in manchen Jahren vorn?", en: "Why is holding ahead in some years?" },
    "faq.a1": {
      de: "In sehr starken Aufwärtsphasen ist M6F+ nicht immer voll investiert und nimmt deshalb nur einen Teil des Anstiegs mit. Das ist der Preis dafür, in Abwärtsphasen große Teile des Verlusts zu vermeiden.",
      en: "In very strong rallies M6F+ is not always fully invested and so only takes part of the rise. That is the price for avoiding much of the loss in down phases.",
    },
    "faq.q2": { de: "Wie verlässlich sind diese Zahlen?", en: "How reliable are these figures?" },
    "faq.a2": {
      de: "Es ist ein Backtest: die Regeln, angewendet auf vergangene Kurse. Die Regeln wurden mit Daten aus diesem Zeitraum gefunden; in Blindtests, bei denen jedes Jahr nur mit den Jahren davor eingestellt wurde, fiel das Ergebnis für 2022–2026 etwas niedriger aus. Die echte Handelslogik wurde im Nachspielen der Kurse gegen diese Rechnung geprüft und trifft sie praktisch genau.",
      en: "It is a backtest: the rules applied to past prices. The rules were found with data from this period; in blind tests, where every year was set up only with the years before it, the result for 2022–2026 was somewhat lower. The real trading logic was replayed over the prices and matches this calculation almost exactly.",
    },
    "faq.q3": { de: "Wie oft wird gehandelt?", en: "How often does it trade?" },
    "faq.a3": {
      de: "Im Schnitt zwei- bis dreimal pro Woche, meist ein kleiner Teil der Position. Gebühren von 0,09 % pro Order und ein kleiner Spread sind in allen Zahlen abgezogen.",
      en: "Two to three times a week on average, usually a small part of the position. Fees of 0.09 % per order and a small spread are deducted in all figures.",
    },
    "faq.q4": { de: "Ab welcher Dauer lohnt es sich?", en: "From what holding period does it pay off?" },
    "faq.a4": {
      de: "Unter einem Monat ist das Ergebnis praktisch Zufall – für M6F+ wie fürs Halten. Ab etwa sechs Monaten zeigt sich der Unterschied deutlich, besonders bei den schlechtesten Starttagen. Probiere es oben unter „Hängt es vom Einstieg ab?“ aus.",
      en: "Under a month the result is practically chance – for M6F+ as for holding. From about six months the difference shows clearly, especially for the worst start days. Try it above under “Does the start date matter?”.",
    },
    "faq.q5": { de: "Und die Steuern?", en: "What about taxes?" },
    "faq.a5": {
      de: "Steuern sind nicht berücksichtigt. Weil M6F+ regelmäßig verkauft, fallen Gewinne meist innerhalb eines Jahres an und sind in Deutschland dann steuerpflichtig – beim Halten über ein Jahr nicht. Das kann den Vergleich deutlich verschieben; frag dazu einen Steuerberater.",
      en: "Taxes are not included. Because M6F+ sells regularly, gains usually arise within a year and are then taxable in Germany – when holding for more than a year they are not. That can shift the comparison considerably; ask a tax adviser.",
    },
    "basis.h": { de: "Grundlage", en: "Basis" },
    "basis.1": {
      de: "Backtest auf Stundenkursen ETH-EUR und BTC-EUR, 1. Februar 2020 bis 4. Oktober 2026, Werte wöchentlich zum Tagesende (UTC).",
      en: "Backtest on hourly ETH-EUR and BTC-EUR prices, 1 February 2020 to 4 October 2026, values weekly at the end of the day (UTC).",
    },
    "basis.2": {
      de: "Gebühren 0,09 % je Kauf und Verkauf (Market-Orders bei Revolut X) und 0,03 % Spread sind abgezogen; Steuern nicht.",
      en: "Fees of 0.09 % per buy and sale (market orders on Revolut X) and a 0.03 % spread are deducted; taxes are not.",
    },
    "basis.3": {
      de: "„Halten“ heißt: am Starttag kaufen und bis zum Ende liegen lassen. Bei 60/40 werden beide Teile getrennt gehalten, ohne Umschichten.",
      en: "“Holding” means buying on the start day and keeping it to the end. With 60/40 both parts are held separately, without rebalancing.",
    },
    "basis.4": {
      de: "Die Regeln wurden mit Daten aus diesem Zeitraum gefunden. In Blindtests fiel das Ergebnis für 2022–2026 etwas niedriger aus.",
      en: "The rules were found with data from this period. In blind tests the result for 2022–2026 was somewhat lower.",
    },
    "basis.5": { de: "Vergangene Ergebnisse sind keine Garantie für die Zukunft. Keine Anlageberatung.", en: "Past results are no guarantee for the future. Not investment advice." },
    // dynamic texts (app.js)
    "tile.bot": { de: "M6F+ heute", en: "M6F+ today" },
    "tile.hold": { de: "Halten heute", en: "Holding today" },
    "tile.diff": { de: "Unterschied", en: "Difference" },
    "tile.diffSub": { de: "M6F+ gegenüber Halten, seit {date}", en: "M6F+ compared with holding, since {date}" },
    "tile.dd": { de: "Größter Rückgang", en: "Largest drawdown" },
    "tile.ddSub": { de: "Halten: {v}", en: "Holding: {v}" },
    perYear: { de: "pro Jahr", en: "a year" },
    diff: { de: "Unterschied", en: "Difference" },
    partial: { de: "* angebrochenes Jahr", en: "* incomplete year" },
    year: { de: "Jahr", en: "Year" },
    "starts.note": {
      de: "Für {n} Starttage seit dem {date}, einer pro Woche: das Ergebnis nach {after}.",
      en: "For {n} start days since {date}, one a week: the result after {after}.",
    },
    inPlus: { de: "{v} % im Plus", en: "{v} % in profit" },
    startsSub: {
      de: "Median {med} · schlechteste 10 % {p10} · schlechtester Start {worst} · bester {best}",
      en: "Median {med} · worst 10 % {p10} · worst start {worst} · best {best}",
    },
    better: { de: "M6F+ besser als Halten", en: "M6F+ better than holding" },
    ofStarts: { de: "der Starttage", en: "of the start days" },
    startTo: { de: "Start {a} → {b}", en: "Start {a} → {b}" },
    thousand: { de: "Tsd.", en: "k" },
    million: { de: "Mio.", en: "m" },
    "aria.equity": { de: "Wertentwicklung M6F+ gegen Halten", en: "Portfolio value M6F+ vs. holding" },
    "aria.dd": { de: "Rückgang vom Höchststand", en: "Drawdown from the high" },
    "aria.years": { de: "Ergebnis je Kalenderjahr", en: "Return per calendar year" },
    "aria.starts": { de: "Ergebnis je Starttag", en: "Result per start day" },
  };
  const saved = (() => { try { return localStorage.getItem("m6f-lang"); } catch { return null; } })();
  let lang = saved || ((navigator.language || "de").toLowerCase().startsWith("de") ? "de" : "en");
  const t = (key, vars = {}) => {
    const e = T[key]; let s = e ? (e[lang] ?? e.de) : key;
    for (const [k, v] of Object.entries(vars)) s = s.split("{" + k + "}").join(v);
    return s;
  };
  function apply() {
    document.documentElement.lang = lang;
    document.title = t("title");
    document.querySelectorAll("[data-i18n]").forEach((n) => { n.innerHTML = t(n.dataset.i18n); });
    document.querySelectorAll("#lang button").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.v === lang)));
  }
  return {
    t, apply,
    get lang() { return lang; },
    get locale() { return lang === "de" ? "de-DE" : "en-GB"; },
    set(l) { lang = l; try { localStorage.setItem("m6f-lang", l); } catch {} apply(); },
  };
})();
