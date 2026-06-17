/* diagnose-en.js — Timber-Frame Diagnostic (English)
   Institute for Collaboration Architecture, 2026
   English mirror of diagnose.js. No data is sent. Everything stays in the browser.
   Structure, scoring and house logic are identical to the German version;
   only the language differs.
*/

// ---------------------------------------------------------------------------
// Image paths — beam (strong) and twig (fragile) variants per element
// (shared with the German version — same img/ folder)
// ---------------------------------------------------------------------------
const IMG = {
  wall1:   { beam: 'img/beam.png',    twig: 'img/twig.png'   },
  wall2:   { beam: 'img/beam.png',    twig: 'img/twig2.png'  },
  wall3:   { beam: 'img/floor.png',   twig: 'img/floortwig.png' },
  wall4:   { beam: 'img/ceiling.png', twig: 'img/ceilingtwig.png' },
  culture: { beam: 'img/crossbrace1.png',    twig: 'img/twig3.png'  },
  habits:  { beam: 'img/crossbrace2.png',    twig: 'img/twig4.png'  }
};

// ---------------------------------------------------------------------------
// Question data — each section maps to a structural element
// ---------------------------------------------------------------------------
const STRUCT = [
  { id: 'wall1', name: 'Wall 1 — Task allocation', qs: [
    { t: 'When work comes up and no one is officially responsible — how does it get allocated?', o: [
      ['Through a system that makes workload and capacity visible', 2],
      ['Whoever gets asked first, or volunteers', 1],
      ['It isn\u2019t allocated — it stays with whoever notices it', 0]
    ]},
    { t: 'Can people in your organisation see the workload across the team?', o: [
      ['Yes, through a shared system', 2],
      ['Informally — the team lead has a sense of it', 1],
      ['No — everyone manages their own work alone', 0]
    ]},
    { t: 'What happens when someone is out for two weeks?', o: [
      ['Tasks are visible and can be reassigned', 2],
      ['A colleague steps in, but only because they know the person', 1],
      ['Things pile up or fall through the cracks until the person is back', 0]
    ]}
  ]},

  { id: 'wall2', name: 'Wall 2 — Knowledge resources', qs: [
    { t: 'Where do people look first when they need to know how something works?', o: [
      ['In a maintained knowledge base or documentation', 2],
      ['They ask a particular person who knows the answer', 1],
      ['There is no reliable first place to look', 0]
    ]},
    { t: 'Can you find documentation from six months ago?', o: [
      ['Yes, reliably and quickly', 2],
      ['Probably, but it would take searching and asking around', 1],
      ['It probably no longer exists, or I wouldn\u2019t know where', 0]
    ]},
    { t: 'Who maintains shared knowledge resources?', o: [
      ['A defined role, or distributed responsibility with standards', 2],
      ['One or two committed people who do it voluntarily', 1],
      ['No one — resources are created and then left to themselves', 0]
    ]}
  ]},

  { id: 'wall3', name: 'Floor — Meetings', qs: [
    { t: 'How many of your meetings produce documented, findable decisions?', o: [
      ['Most — decisions are recorded and accessible', 2],
      ['Some — it depends on who is taking minutes', 1],
      ['Few or none — decisions stay in people\u2019s heads', 0]
    ]},
    { t: 'How many meetings exist mainly to pass on information?', o: [
      ['Very few — meetings are for decisions and complex discussion', 2],
      ['Some — we could replace a few with better asynchronous channels', 1],
      ['Most — meetings are our main channel for information', 0]
    ]},
    { t: 'Can someone who wasn\u2019t there find a meeting decision a week later?', o: [
      ['Yes — decisions are documented in a known place', 2],
      ['Maybe — if you know who to ask', 1],
      ['No — you had to have been there', 0]
    ]}
  ]},

  { id: 'wall4', name: 'Ceiling — Fast, informal communication', qs: [
    { t: 'Is there a chat channel where routine questions get answered quickly?', o: [
      ['Yes, and it is an official part of how we work', 2],
      ['Yes, but it grew up informally and not everyone uses it', 1],
      ['No — questions go by email or call to individuals', 0]
    ]},
    { t: 'Can new staff easily find and join these channels?', o: [
      ['Yes — they are discoverable and part of onboarding', 2],
      ['If someone shows them — it runs on word of mouth', 1],
      ['There are no shared channels, or they are invisible to newcomers', 0]
    ]},
    { t: 'When something important is decided in chat — does it get recorded permanently?', o: [
      ['Yes — decisions move from chat into documentation', 2],
      ['Sometimes, if someone remembers to', 1],
      ['No — it scrolls away and is effectively lost', 0]
    ]}
  ]},

  { id: 'culture', name: 'Cross-brace — Culture', qs: [
    { t: 'Is asking for help seen as competence or as weakness?', o: [
      ['As competence — it is expected and modelled by leaders', 2],
      ['Depends on the team or the manager', 1],
      ['As weakness — you are meant to solve your own problems', 0]
    ]},
    { t: 'Do people share work in progress, or only finished work?', o: [
      ['Work in progress is shared, feedback is normal', 2],
      ['Informally, within trusted relationships', 1],
      ['Only finished work — showing drafts feels risky', 0]
    ]},
    { t: 'Are mistakes discussed openly or hidden?', o: [
      ['Discussed openly, as a chance to learn', 2],
      ['Discussed privately, but not across the organisation', 1],
      ['Hidden — making a mistake visible is a career risk', 0]
    ]}
  ]},

  { id: 'habits', name: 'Cross-brace — Habits', qs: [
    { t: 'Do people check shared channels before calling a meeting?', o: [
      ['Yes — asynchronous-first is the norm', 2],
      ['Sometimes, but meetings are still the default', 1],
      ['No — a meeting is always the first response', 0]
    ]},
    { t: 'Is \u201cI\u2019ll document that\u201d a sentence you hear regularly?', o: [
      ['Yes — documenting is a normal part of the work', 2],
      ['From certain people, not everyone', 1],
      ['Rarely or never — documentation is seen as extra work', 0]
    ]},
    { t: 'How do experienced colleagues pass knowledge to new ones?', o: [
      ['Through structured handover with documented resources', 2],
      ['Through personal mentoring and word of mouth', 1],
      ['New staff largely find their own way', 0]
    ]}
  ]}
];

const GRAV = { id: 'gravity', name: 'Gravity — What is pressing on this structure?', qs: [
  { t: 'How often does your organisation go through fundamental change?', o: [
    ['Constantly — change is the permanent state', 3],
    ['Every one to two years', 2],
    ['Rarely — it is relatively stable', 1]
  ]},
  { t: 'How much of your work depends on coordinating across team boundaries?', o: [
    ['Almost all of it — nothing happens alone', 3],
    ['A substantial part', 2],
    ['Mostly independent work', 1]
  ]},
  { t: 'When key people leave — how much knowledge goes with them?', o: [
    ['Critical knowledge disappears', 3],
    ['There is disruption, but the team recovers', 2],
    ['Minimal impact', 1]
  ]},
  { t: 'How many tools and processes were introduced without the people who use them?', o: [
    ['Most of them', 3],
    ['Some', 2],
    ['Very few', 1]
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

  // Free-text field — structural sections only, not the gravity block.
  // data-label = sec.name, so the PDF heading always matches the section.
  if (!isGrav) {
    h += '<div class="freitext-block">' +
         '<label for="ft-' + sec.id + '">Space for your thoughts </label>' +
         '<textarea id="ft-' + sec.id + '" class="freitext" data-label="' + sec.name + '" ' +
         'rows="3" placeholder="Write here"></textarea>' +
         '</div>';
  }

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
    wall1: 'Task allocation',
    wall2: 'Knowledge resources',
    wall3: 'Meetings',
    wall4: 'Communication'
  };
  const bracesAbsent = (st.culture === 0 ? 1 : 0) + (st.habits === 0 ? 1 : 0);
  const bracesFragile = (st.culture === 1 ? 1 : 0) + (st.habits === 1 ? 1 : 0);
  const allOk = Object.values(st).every(v => v === 2);

  let h = '<h2>Your architecture</h2>';

  if (allOk) {
    h += '<p>Your coordination infrastructure is load-bearing. The house stands. That is rare.</p>';
  } else {
    // Cross-braces
    if (bracesAbsent === 2) {
      h += '<p>You have walls, but nothing connects them. Without culture and habits, ' +
           'the first serious load will push the walls outward.</p>';
    } else if (bracesAbsent === 1) {
      const miss = st.culture === 0 ? 'Culture' : 'Habits';
      const have = st.culture === 0 ? 'Habits' : 'Culture';
      const note = miss === 'Culture' ? 'Compliance without commitment.' : 'Goodwill without reliability.';
      h += '<p>' + have + ' holds, but ' + miss + ' is missing. ' + note + '</p>';
    } else if (bracesFragile > 0) {
      h += '<p>Your cross-braces cannot bear any load.</p>';
    }

    // Walls
    const absent = Object.entries(wallNames).filter(([k]) => st[k] === 0);
    const twigs  = Object.entries(wallNames).filter(([k]) => st[k] === 1);

    if (twigs.length > 0) {
      h += '<p><b>' + twigs.map(([, n]) => n).join(', ') +
           '</b> — holds because particular people keep it running.</p>';
    }
    if (absent.length > 0) {
      h += '<p><b>' + absent.map(([, n]) => n).join(', ') +
           '</b> — not present.</p>';
    }

    // Roof always presses down
    if (bracesAbsent > 0 || twigs.length >= 2) {
      h += '<p>The roof is pushing the walls outward.</p>';
    }
  }

  // Gravity
  h += '<div class="grav-box"><b>Gravity:</b> ';
  if (gw === 'heavy')         h += 'High pressure. Where structures do not hold, the load lands on people.';
  else if (gw === 'moderate') h += 'Moderate load. Twigs break under strain.';
  else                        h += 'Stable! Congratulations.';
  h += '</div>';

  // Cost externalisation
  h += '<div class="cost-box"><b>Where do the costs land?</b> Every missing element means: ' +
       'someone carries the load informally. The extra work lands on those least able to refuse it.</div>';

  h += '<p class="results-cta"><b>Questions? Thoughts? hallo@ankeholst.de</b></p>';

  // Export button — must be appended to h BEFORE r.innerHTML = h below.
  h += '<div class="export-wrap"><button class="export-btn" onclick="exportFachwerkPDF()">' +
       'Save as PDF &amp; pass it on</button>' +
       '<span class="export-note">Generated locally in your browser. No data is sent.</span></div>';

  const r = document.getElementById('results');
  r.innerHTML = h;
  r.classList.add('show');
  r.scrollIntoView({ behavior: 'smooth' });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
init();
