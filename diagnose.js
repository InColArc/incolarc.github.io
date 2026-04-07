/* diagnose.js — Fachwerkhaus Diagnostic Tool
   Institute for Collaboration Architecture, 2026
   No data is sent. Everything stays in the browser.
*/

// ---------------------------------------------------------------------------
// Image paths — beam (strong) and twig (fragile) variants per element
// ---------------------------------------------------------------------------
const IMG = {
  wall1:   { beam: 'img/beam.png',    twig: 'img/twig.png'   },
  wall2:   { beam: 'img/beam.png',    twig: 'img/twig2.png'  },
  wall3:   { beam: 'img/floor.png',   twig: 'img/floortwig.png' },
  wall4:   { beam: 'img/ceiling.png', twig: 'img/ceilingtwig.png' },
  culture: { beam: 'img/beam.png',    twig: 'img/twig3.png'  },
  habits:  { beam: 'img/beam.png',    twig: 'img/twig4.png'  }
};

// ---------------------------------------------------------------------------
// Question data — each section maps to a structural element
// ---------------------------------------------------------------------------
const STRUCT = [
  { id: 'wall1', name: 'Wand 1 — Aufgabenverteilung', qs: [
    { t: 'Wenn Arbeit anfällt und niemand offiziell zuständig ist — wie wird sie verteilt?', o: [
      ['Über ein System, das Auslastung und Kapazitäten sichtbar macht', 2],
      ['Wer zuerst gefragt wird oder sich meldet', 1],
      ['Sie wird nicht verteilt — sie bleibt bei dem, der es bemerkt', 0]
    ]},
    { t: 'Können Menschen in Ihrer Organisation die Arbeitsbelastung im Team überblicken?', o: [
      ['Ja, über ein gemeinsames System', 2],
      ['Informell — die Teamleitung hat ein Gefühl dafür', 1],
      ['Nein — jeder verwaltet seine Arbeit allein', 0]
    ]},
    { t: 'Was passiert, wenn jemand zwei Wochen ausfällt?', o: [
      ['Aufgaben sind sichtbar und können umverteilt werden', 2],
      ['Ein Kollege springt ein, aber nur weil er die Person kennt', 1],
      ['Dinge bleiben liegen oder fallen durch, bis die Person zurück ist', 0]
    ]}
  ]},

  { id: 'wall2', name: 'Wand 2 — Wissensressourcen', qs: [
    { t: 'Wo schauen Menschen zuerst, wenn sie wissen müssen, wie etwas funktioniert?', o: [
      ['In einer gepflegten Wissensdatenbank oder Dokumentation', 2],
      ['Sie fragen eine bestimmte Person, die die Antwort kennt', 1],
      ['Es gibt keinen verlässlichen ersten Anlaufpunkt', 0]
    ]},
    { t: 'Können Sie Dokumentation von vor sechs Monaten finden?', o: [
      ['Ja, zuverlässig und schnell', 2],
      ['Wahrscheinlich, aber es würde Suchen und Nachfragen kosten', 1],
      ['Sie existiert wahrscheinlich nicht mehr, oder ich wüsste nicht wo', 0]
    ]},
    { t: 'Wer pflegt gemeinsame Wissensressourcen?', o: [
      ['Eine definierte Rolle oder verteilte Verantwortung mit Standards', 2],
      ['Ein oder zwei engagierte Personen, die es freiwillig tun', 1],
      ['Niemand — Ressourcen werden erstellt und dann sich selbst überlassen', 0]
    ]}
  ]},

  { id: 'wall3', name: 'Decke — Besprechungen', qs: [
    { t: 'Bei wie vielen Ihrer Besprechungen entstehen dokumentierte, auffindbare Entscheidungen?', o: [
      ['Bei den meisten — Entscheidungen werden festgehalten und sind zugänglich', 2],
      ['Bei einigen — es hängt davon ab, wer Protokoll führt', 1],
      ['Bei wenigen oder keinen — Entscheidungen bleiben in den Köpfen', 0]
    ]},
    { t: 'Wie viele Meetings dienen hauptsächlich der Informationsweitergabe?', o: [
      ['Sehr wenige — Meetings sind für Entscheidungen und komplexe Diskussionen', 2],
      ['Einige — wir könnten ein paar durch bessere asynchrone Wege ersetzen', 1],
      ['Die meisten — Meetings sind unser Hauptkanal für Informationen', 0]
    ]},
    { t: 'Kann jemand, der nicht dabei war, eine Meeting-Entscheidung eine Woche später finden?', o: [
      ['Ja — Entscheidungen werden an einem bekannten Ort dokumentiert', 2],
      ['Vielleicht — wenn man weiß, wen man fragen muss', 1],
      ['Nein — man musste dabei gewesen sein', 0]
    ]}
  ]},

  { id: 'wall4', name: 'Boden — Schnelle informelle Kommunikation', qs: [
    { t: 'Gibt es einen Chat-Kanal, in dem Routinefragen schnell beantwortet werden?', o: [
      ['Ja, und er ist ein offizieller Teil unserer Arbeitsweise', 2],
      ['Ja, aber er ist informell entstanden und nicht alle nutzen ihn', 1],
      ['Nein — Fragen gehen per E-Mail oder Anruf an Einzelpersonen', 0]
    ]},
    { t: 'Können neue Mitarbeitende diese Kanäle leicht finden und beitreten?', o: [
      ['Ja — sie sind auffindbar und Teil des Onboardings', 2],
      ['Wenn jemand sie zeigt — es läuft über Mundpropaganda', 1],
      ['Es gibt keine gemeinsamen Kanäle, oder sie sind für Neue unsichtbar', 0]
    ]},
    { t: 'Wenn etwas Wichtiges im Chat entschieden wird — wird es dauerhaft festgehalten?', o: [
      ['Ja — Entscheidungen wandern vom Chat in die Dokumentation', 2],
      ['Manchmal, wenn jemand daran denkt', 1],
      ['Nein — es scrollt weg und ist praktisch verloren', 0]
    ]}
  ]},

  { id: 'culture', name: 'Querstrebe — Kultur', qs: [
    { t: 'Wird um Hilfe zu bitten als Kompetenz oder als Schwäche gesehen?', o: [
      ['Als Kompetenz — es wird erwartet und von Führungskräften vorgelebt', 2],
      ['Kommt auf das Team oder die Führungskraft an', 1],
      ['Als Schwäche — man soll seine Probleme allein lösen', 0]
    ]},
    { t: 'Teilen Menschen Zwischenergebnisse oder nur fertige Arbeit?', o: [
      ['Zwischenergebnisse werden geteilt, Feedback ist normal', 2],
      ['Informell, innerhalb vertrauensvoller Beziehungen', 1],
      ['Nur fertige Ergebnisse — Entwürfe zu zeigen fühlt sich riskant an', 0]
    ]},
    { t: 'Werden Fehler offen besprochen oder versteckt?', o: [
      ['Offen besprochen als Lernmöglichkeit', 2],
      ['Privat besprochen, aber nicht organisationsweit', 1],
      ['Versteckt — Fehler sichtbar zu machen ist ein Karriererisiko', 0]
    ]}
  ]},

  { id: 'habits', name: 'Querstrebe — Gewohnheiten', qs: [
    { t: 'Schauen Menschen in gemeinsame Kanäle, bevor sie ein Meeting einberufen?', o: [
      ['Ja — asynchron zuerst ist die Norm', 2],
      ['Manchmal, aber Meetings sind immer noch der Standard', 1],
      ['Nein — ein Meeting ist immer die erste Reaktion', 0]
    ]},
    { t: 'Ist „Ich dokumentiere das" ein Satz, den Sie regelmäßig hören?', o: [
      ['Ja — Dokumentieren ist ein normaler Teil der Arbeit', 2],
      ['Von bestimmten Personen, nicht von allen', 1],
      ['Selten oder nie — Dokumentation gilt als Extraarbeit', 0]
    ]},
    { t: 'Wie geben erfahrene Kolleg:innen Wissen an neue weiter?', o: [
      ['Durch strukturierte Übergabe mit dokumentierten Ressourcen', 2],
      ['Durch persönliches Mentoring und mündliche Weitergabe', 1],
      ['Neue Mitarbeitende finden sich weitgehend allein zurecht', 0]
    ]}
  ]}
];

const GRAV = { id: 'gravity', name: 'Schwerkraft — Was drückt auf diese Struktur?', qs: [
  { t: 'Wie häufig durchläuft Ihre Organisation grundlegende Veränderungen?', o: [
    ['Ständig — Veränderung ist Dauerzustand', 3],
    ['Alle ein bis zwei Jahre', 2],
    ['Selten — es ist relativ stabil', 1]
  ]},
  { t: 'Wie viel Ihrer Arbeit hängt von Abstimmung über Teamgrenzen hinweg ab?', o: [
    ['Fast alles — nichts geht allein', 3],
    ['Ein erheblicher Teil', 2],
    ['Überwiegend eigenständige Arbeit', 1]
  ]},
  { t: 'Wenn wichtige Personen gehen — wie viel Wissen geht mit ihnen?', o: [
    ['Kritisches Wissen verschwindet', 3],
    ['Es gibt Störungen, aber das Team erholt sich', 2],
    ['Minimale Auswirkung', 1]
  ]},
  { t: 'Wie viele Tools und Prozesse wurden ohne die Nutzenden eingeführt?', o: [
    ['Die meisten', 3],
    ['Einige', 2],
    ['Sehr wenige', 1]
  ]}
]};

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const ans  = {};
const gAns = {};
const total = STRUCT.reduce((n, s) => n + s.qs.length, 0) + GRAV.qs.length;
let count = 0;

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
function renderSection(sec, isGrav) {
  let h = '<div class="section-title">' + sec.name + '</div>';
  sec.qs.forEach((q, qi) => {
    const name = sec.id + '_' + qi;
    h += '<div class="q"><p>' + q.t + '</p>';
    q.o.forEach((opt) => {
      h += '<label><input type="radio" name="' + name + '" value="' + opt[1] +
           '" data-sec="' + sec.id + '" data-grav="' + (isGrav ? 1 : 0) +
           '" onchange="pick(this)"> ' + opt[0] + '</label>';
    });
    h += '</div>';
  });
  return h;
}

function init() {
  const panel = document.getElementById('qPanel');
  let h = '';
  STRUCT.forEach(s => { h += renderSection(s, false); });
  h += renderSection(GRAV, true);
  panel.innerHTML = h;
}

// ---------------------------------------------------------------------------
// Interaction
// ---------------------------------------------------------------------------
function pick(input) {
  const name  = input.name;
  const score = parseInt(input.value, 10);
  const secId = input.dataset.sec;
  const store = input.dataset.grav === '1' ? gAns : ans;

  if (store[name] === undefined) count++;
  store[name] = score;

  document.getElementById('prog').textContent = count + ' / ' + total;

  if (input.dataset.grav !== '1') updateHouse(secId);
  if (count >= total) document.getElementById('gravSec').classList.add('show');
}

// ---------------------------------------------------------------------------
// House visualisation
// ---------------------------------------------------------------------------

/** Evaluate a section: 2 = beam, 1 = twig, 0 = absent, null = unanswered */
function getState(secId) {
  const sec = STRUCT.find(s => s.id === secId);
  if (!sec) return null;
  const scores = [];
  sec.qs.forEach((q, qi) => {
    const k = secId + '_' + qi;
    if (ans[k] !== undefined) scores.push(ans[k]);
  });
  if (scores.length === 0) return null;
  if (scores.includes(0)) return 0;
  if (scores.includes(1)) return 1;
  return 2;
}

/** Swap the image for a structural element based on its state */
function updateHouse(secId) {
  const state = getState(secId);
  const vis = document.getElementById('v-' + secId);
  const img = document.getElementById('img-' + secId);

  if (state === null) {
    vis.classList.remove('show');
    return;
  }

  vis.classList.add('show');

  if (state === 2) {
    if (img) img.src = IMG[secId].beam;
  } else if (state === 1) {
    if (img) img.src = IMG[secId].twig;
  } else {
    if (img) img.src = '';
    vis.classList.remove('show');
  }
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------
function doGravity() {
  const st = {};
  STRUCT.forEach(s => { st[s.id] = getState(s.id); });

  // Show figure in center of house
  document.getElementById('fig-center').classList.add('show');

  // Gravity weight
  let gt = 0, gc = 0;
  GRAV.qs.forEach((q, qi) => {
    const k = 'gravity_' + qi;
    if (gAns[k] !== undefined) { gt += gAns[k]; gc++; }
  });
  const avg = gc === 0 ? 0 : gt / gc;
  const gw = avg >= 2.5 ? 'heavy' : (avg >= 1.8 ? 'moderate' : 'light');

  // Structural analysis
  const wallNames = {
    wall1: 'Aufgabenverteilung',
    wall2: 'Wissensressourcen',
    wall3: 'Besprechungen',
    wall4: 'Kommunikation'
  };
  const bracesAbsent = (st.culture === 0 ? 1 : 0) + (st.habits === 0 ? 1 : 0);
  const bracesFragile = (st.culture === 1 ? 1 : 0) + (st.habits === 1 ? 1 : 0);
  const allOk = Object.values(st).every(v => v === 2);

  let h = '<h2>Ihre Architektur</h2>';

  if (allOk) {
    h += '<p>Ihre Koordinationsinfrastruktur ist tragfähig. Das Haus steht. Das ist selten.</p>';
  } else {
    // Cross-braces
    if (bracesAbsent === 2) {
      h += '<p>Sie haben Wände, aber nichts verbindet sie. Ohne Kultur und Gewohnheiten ' +
           'wird die erste ernsthafte Belastung die Wände nach außen drücken.</p>';
    } else if (bracesAbsent === 1) {
      const miss = st.culture === 0 ? 'Kultur' : 'Gewohnheiten';
      const have = st.culture === 0 ? 'Gewohnheiten' : 'Kultur';
      const note = miss === 'Kultur' ? 'Compliance ohne Commitment.' : 'Wohlwollen ohne Zuverlässigkeit.';
      h += '<p>' + have + ' hält, aber ' + miss + ' fehlt. ' + note + '</p>';
    } else if (bracesFragile > 0) {
      h += '<p>Ihre Querstreben halten keine Belastung aus.</p>';
    }

    // Walls
    const absent = Object.entries(wallNames).filter(([k]) => st[k] === 0);
    const twigs  = Object.entries(wallNames).filter(([k]) => st[k] === 1);

    if (twigs.length > 0) {
      h += '<p><b>' + twigs.map(([, n]) => n).join(', ') +
           '</b> — hält, weil bestimmte Menschen es am Laufen halten.</p>';
    }
    if (absent.length > 0) {
      h += '<p><b>' + absent.map(([, n]) => n).join(', ') +
           '</b> — nicht vorhanden.</p>';
    }

    // Roof always presses down
    if (bracesAbsent > 0 || twigs.length >= 2) {
      h += '<p>Das Dach drückt die Wände nach außen.</p>';
    }
  }

  // Gravity
  h += '<div class="grav-box"><b>Schwerkraft:</b> ';
  if (gw === 'heavy')         h += 'Hoher Druck. Wo Strukturen nicht halten, landet die Last auf Menschen.';
  else if (gw === 'moderate') h += 'Mittlere Last. Zweige brechen bei Belastung.';
  else                        h += 'Stabil! Herzlichen Glückwunsch.';
  h += '</div>';

  // Cost externalisation
  h += '<div class="cost-box"><b>Wo landen die Kosten?</b> Jedes fehlende Element bedeutet: ' +
       'jemand trägt die Last informell. Die Mehrarbeit landet bei denen, die sich nicht wehren können.</div>';

  h += '<p class="results-cta"><b>Fragen? Anregungen? hallo@ankeholst.de</b></p>';

  const r = document.getElementById('results');
  r.innerHTML = h;
  r.classList.add('show');
  r.scrollIntoView({ behavior: 'smooth' });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
init();
