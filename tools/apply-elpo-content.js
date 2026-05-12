#!/usr/bin/env node
// Applies ELPO copy onto the extracted Avorica template body.
// Reads content/protected.html (template HTML body with paths already rewritten)
// and replaces the template's placeholder copy with ELPO content.

const fs = require('node:fs');
const path = require('node:path');

const file = path.resolve(__dirname, '..', 'content', 'protected.html');
let html = fs.readFileSync(file, 'utf8');

// Each entry: [needle, replacement]. Order matters when one is a prefix of another.
const SUBS = [
  // -------- Hero --------
  ['Accelerate growth with expert guidance', '360° Elektrotechnik für die Zukunft'],
  ['We create modern, user-focused digital experiences that help businesses stand out, engage customers, and scale faster.',
    'Wir planen, installieren und betreuen komplexe elektrotechnische Großprojekte – von der Beratung über die Inbetriebnahme bis zum 24/7-Service. Alles aus einer Hand.'],
  ['Lets talk', 'Kontakt aufnehmen'],
  ['Let’s talk', 'Kontakt aufnehmen'],

  // -------- Strategic-advisory items (5 services) --------
  ['Strategic advisory', 'Elektrotechnik'],
  ['Performance consulting', 'Green Energy'],
  ['Process improvement', 'Automation'],
  ['Risk management', 'Photovoltaik'],
  ['Corporate planning', 'Service'],
  ['Transformation', 'Bereiche'],

  ['Delivering practical strategies for profitable business growth.',
    'Wir planen und installieren elektrische Anlagen für Industrie, Infrastruktur und öffentliche Bauten.'],
  ['Trusted by 250+ global clients worldwide.',
    'Über 75 Jahre Erfahrung in Südtirol und international – 180+ Mitarbeitende.'],

  // -------- About / heritage --------
  ['We are strategic partners delivering innovation growth',
    'Wir sind Familienunternehmen. Seit über 75 Jahren.'],
  ['Strategic consulting services help businesses navigate markets and unlock growth. Our experts deliver insights and sustainable performance results.',
    'Seit 1947 steht ELPO für Elektrotechnik auf höchstem Niveau. Gegründet als lokales Handwerksunternehmen in Bruneck, hat sich ELPO zu einem international tätigen Elektrogroßbetrieb entwickelt. Heute sorgen rund 180 Mitarbeiterinnen und Mitarbeiter dafür, dass anspruchsvolle Projekte erfolgreich umgesetzt werden.'],
  ['Get started', 'Mehr erfahren'],

  // -------- Stats / metrics labels --------
  ['Data-driven insights fueling success', 'Schaltschrankbau in Zahlen'],
  ['Quarterly market increase', 'Schaltpläne 2025'],
  ['Client success', 'Schaltplanseiten'],
  ['Operational efficiency optimized', 'Kupferdraht in den Schaltschränken'],
  ['Sustainable capital returns', 'Aderendhülsen aufgecrimpt'],

  // -------- Section: "Client-focused..." (Vertrauen / clients) --------
  ['Business growth', 'Vertrauen'],
  ['Client-focused strategies driving growth', 'Diese Unternehmen vertrauen auf uns'],
  ['Digital transformation acceleration', 'Industrie & Großkunden'],
  ['Annual revenue growth', 'Öffentliche Auftraggeber'],
  ['Client trust', 'Internationale Projekte'],

  // -------- Section: "Innovative solutions for brands" → services overview --------
  ['Innovative solutions for brands', 'Vollumfängliche Elektrotechnik für Großprojekte'],
  ['Strategy advisory expansion', 'Bereichsübersicht'],

  // -------- Section: "Why leading companies choose our consulting" --------
  ['Why leading companies choose our consulting', 'Warum Kunden auf ELPO setzen'],
  ['Businesses focus success rate', 'Projekte erfolgreich umgesetzt'],
  ['Data driven strategies', '360°-Betreuung aus einer Hand'],
  ['High impact advisory', 'Eigene Schaltschrank- & Automatisierungs-Kompetenz'],

  // -------- "Discover your 90% efficiency potential" → mission --------
  ['Discover your 90% efficiency potential', 'Unsere Mission ist unser Antrieb'],
  ['Build strategic marketing plans that strengthen brand visibility. Turn market insights into campaigns that drive engagement and sustainable growth.',
    'Unsere Mission ist es, Energie und Technik so einzusetzen, dass Menschen, Unternehmen und Gemeinden effizienter, sicherer und nachhaltiger leben und arbeiten können.'],
  ['Operational excellence frameworks', '24/7 Service & Wartung'],
  ['Process excellence management frameworks', 'Eigener Schaltschrankbau, IoT & E-Mobility'],
  ['Trusted by 200+ businesses worldwide since', 'Familienunternehmen aus Bruneck seit'],

  ['Strategic solutions', 'Familien­unternehmen'],
  ['Creates impact', 'Treibt Fortschritt'],
  ['Drives growth', 'Gestaltet Zukunft'],

  // -------- Video section --------
  ['Pause video', 'Video pausieren'],
  ['Play video', 'Video abspielen'],

  // -------- Team / Verteilerbau --------
  ['Our team', 'Unser Team'],
  ['Meet the other team members', 'Die Menschen hinter ELPO'],

  // -------- Strategy --------
  ['Delivering smarter strategies for growing businesses',
    'Werde Teil von ELPO'],
  ['Delivering smarter strategies that help growing businesses improve efficiency, adapt quickly, and achieve steady, sustainable success.',
    'Wir streben nach Technik, Zukunft und Qualität – und nach Menschen, die unsere Werte teilen. Vom ersten Lehrjahr bis zur Spezialisierung begleiten wir dich persönlich.'],
  ['[Market analysis]', '[Ergebnisprämie]'],
  ['[Growth strategy]', '[Hausinterne Mensa]'],
  ['[Expansion strategy]', '[Fitnessraum & ergonomische Arbeitsplätze]'],
  ['Years of experince', 'Jahre Erfahrung'],
  ['See the reviews', 'Zur Karriereseite'],
  ['Success analytics', 'Bereiche'],
  ['Latest engagements', 'Referenzen'],
  ['Consultation overview', 'Übersicht'],

  // -------- Project / highlight --------
  ['Consulting that creates lasting advantage', 'Carport Ivoclar – Photovoltaik für Ivoclar Vivadent'],
  ['Our projects', 'Unsere Highlights'],
  ['View all', 'Alle Referenzen'],

  // -------- Process --------
  ['Our process', 'Der ELPO-Prozess'],
  ['Step by step strategy for transformation  & growth',
    '360° Betreuung – unsere vollumfängliche Begleitung'],
  ['Step by step strategy for transformation & growth',
    '360° Betreuung – unsere vollumfängliche Begleitung'],
  ['Discovery phase', 'Beratung & Planung'],
  ['Modern solutions built to reshape business and systems drive growth and efficiency across every stage of your operations.',
    'Wir analysieren Ihre Anforderungen, beraten individuell und erarbeiten ein maßgeschneidertes Konzept für Ihr Projekt.'],
  ['View more', 'Mehr erfahren'],
  ['Strategy development', 'Projektierung'],
  ['Creative ideas shaped into real strategies. Guiding teams to turn bold visions .into opportunities that deliver lasting value.',
    'Von der Detailplanung bis zur Installation, inklusive Schaltschrankbau und Programmierung, setzen wir alles präzise um.'],
  ['Implementation execution', 'Inbetriebnahme'],
  ['Smarter methods reduce complexity and strengthen performance across.business operations.',
    'Nach umfassenden Tests und Konformitätserklärungen übergeben wir schlüsselfertige Anlagen, die sofort einsatzbereit sind.'],
  ['Process optimization', 'Übergabe & Wartung'],
  ['Smarter methods reduce complexity and strengthen performance across. business operations.',
    'System- und Abnahmetest vor Ort, mit Konformitätserklärung und Inbetriebnahmeprotokoll. Die Anlage ist nun einsatzbereit.'],

  // -------- FAQ --------
  ['Frequently asked questions about our consulting services', 'Häufig gestellte Fragen'],
  ['How does your organization ensure financial transparency?',
    'Für welche Kunden arbeitet ELPO?'],
  ['We maintain transparency through clear reports, audited records, and detailed documentation for stakeholders.',
    'Wir realisieren vor allem Großprojekte für Industrie, öffentliche Auftraggeber und Infrastrukturbauten. Private Kunden betreuen wir in erster Linie bei größeren Projekten mit komplexen Anforderungen.'],
  ['Where can I find detailed annual impact reports?',
    'Was macht ELPO einzigartig?'],
  ['Our consultants publish annual reports explaining financial allocation, project outcomes, ensuring transparency for partners and stakeholders.',
    'Als Familienunternehmen mit über 70 Jahren Erfahrung bieten wir 360°-Leistungen aus einer Hand. Von der Beratung über die Umsetzung bis zum 24/7-Service erhalten Kunden bei uns höchste Qualität und langfristige Sicherheit.'],
  ['How do you manage project timelines and delivery?',
    'Bietet ELPO einen Notdienst an?'],
  ['We follow structured planning, clear milestones, and continuous monitoring to ensure projects are delivered.',
    'Ja, unser speziell geschultes Serviceteam steht im Rahmen des 24/7-Notdienstes jederzeit bereit. So stellen wir sicher, dass Anlagen dauerhaft funktionsfähig bleiben und Ausfallzeiten minimiert werden.'],
  ['Can you automate our manual reporting processes?',
    'Welche Leistungen bietet ELPO an?'],
  ['Yes, we implement automation systems that simplify reporting, reduce manual tasks, and improve accuracy.',
    'ELPO deckt das gesamte Spektrum moderner Elektrotechnik ab – von Installation und Automation über Green Energy und Photovoltaik bis hin zu Service & Wartung. Zusätzlich verfügen wir über eigene Kompetenz im Schaltschrankbau, IoT und E-Mobility.'],
  ['Do you build custom dashboards for executive teams?',
    'Bildet ELPO Lehrlinge aus?'],
  ['We create custom dashboards that display key metrics and insights for better executive decision-making.',
    'Ja, Ausbildung ist ein zentraler Bestandteil unserer Unternehmenskultur. Wir bieten Lehrstellen in verschiedenen technischen Bereichen, begleiten junge Talente intensiv und eröffnen ihnen langfristige Karrierechancen im Unternehmen.'],
  ['What industries do your consulting services support?',
    'Wo befindet sich ELPO?'],
  ['Our consulting services support manufacturing, infrastructure, automation, and engineering sectors, helping.',
    'Der Firmensitz befindet sich in Bruneck, Südtirol. Von hier aus betreuen wir Projekte in der gesamten Region und international. Zusätzlich betreiben wir einen Elektro-Fachhandel mit breitem Sortiment.'],

  // -------- Footer / contact --------
  ['Follow us', 'Folge uns'],
  ['Subscribe to our newsletter', 'Newsletter abonnieren'],
  ['Thank you! Your submission has been received!', 'Wir haben deine Eintragung erhalten!'],
  ['Oops! Something went wrong while submitting the form.', 'Ups! Es ist etwas schiefgelaufen.'],
  ['Quick links', 'Sitemap'],
  ['Utility pages', 'Rechtliches'],
  ['410 Sandtown, California 94001, USA', 'Alfred-Amonn-Straße 5, 39031 Bruneck'],
  ['(888) 456 7890', '+39 0474 570 700'],
  ['info@example.com', 'info@elpo.eu'],

  // -------- Top nav placeholders & template pages --------
  ['Get a quote', 'Kontakt'],
  ['Home one', 'Home'],
  ['Home two', 'Bereiche'],
  ['Home three', 'Über uns'],
  ['Service one', 'Elektrotechnik'],
  ['Service two', 'Green Energy'],
  ['Service three', 'Service'],
  ['Blog one', 'News'],
  ['Blog two', 'News'],
  ['Blog three', 'News'],
  ['Blog post', 'News'],
  ['Team member', 'Karriere'],
  ['Case studies', 'Referenzen'],
  ['Case study detail', 'Referenzen'],
  ['Case study', 'Referenzen'],
  ['Contact one', 'Kontakt'],
  ['Contact two', 'Kontakt'],
  ['Contact three', 'Kontakt'],
  ['Password protected', 'Geschützt'],
  ['Get access to', 'Vollumfängliche Elektrotechnik'],
  ['premium templates with one plan', 'aus einer Hand seit 1947'],
  ['Build faster with', 'Verteilerbau & Schaltschränke'],
  ['components', 'Komponenten'],
  ['Launch your Webflow project faster with', 'Realisierte Großprojekte'],
  ['wireframes', 'Pläne'],

  // -------- Webflow attribution --------
  ['Designed by', ' '],
  ['Radient Templates', 'ELPO GmbH'],
  ['Radiant Templates', 'ELPO GmbH'],
  [', Powered by', ''],
  ['Style guide', 'Impressum'],
  ['Changelog', 'Datenschutz'],

  // -------- Generic --------
  ['This is some text inside of a div block.', ''],
];

let applied = 0;
let missed = 0;
const missedStrings = [];
for (const [needle, repl] of SUBS) {
  if (!needle) continue;
  if (html.includes(needle)) {
    html = html.split(needle).join(repl);
    applied++;
  } else {
    missed++;
    missedStrings.push(needle);
  }
}
fs.writeFileSync(file, html);
console.log('Replacements applied:', applied, '/ missed:', missed);
if (missed) console.log('Missed needles:', missedStrings.map(s => s.length > 60 ? s.slice(0, 60) + '…' : s));
console.log('protected.html bytes after substitutions:', html.length);
