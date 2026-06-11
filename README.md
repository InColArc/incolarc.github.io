# Ductarc — Coordination-infrastructure diagnostics

**"A lack of infrastructure is not a personal problem."**

Interactive diagnostic tools that make coordination infrastructure visible. Each tool meets a person where they stand in relation to the same structure — a timber-framed house — and produces recognition before it produces advice.

Built by the [Institute for Collaboration Architecture](https://incolarc.com) (incolarc.com). 

---

## The three tools — one structure, three standpoints

The tools are routed by **where you stand**, not by what they are called. A person reads their own position and is sent to the instrument built for it.

| Standpoint | Tool | Position vs. the house | What it diagnoses |
|---|---|---|---|
| You work inside it | **Fachwerk-Diagnose** | inside the frame — you inhabit and hold it up | the **lived structure**: is it holding, or are you? |
| You lead / manage | **Fundament-Diagnose** | below — the ground the house stands on | a **state**: the condition of your governance substrate |
| You hold the budget / commission the build | **Bauherr-Diagnose** | before & above — you commissioned the structure | an **act**: what the purchase externalised, and onto whom |

The first two diagnose a *state* you can read. The third diagnoses an *act* you performed. They do not reduce to each other: a person can steward conditions well and still commission badly, or the reverse.

---

### Fachwerk-Diagnose (`diagnose.html`)

For people who work in organisations. Answer questions about your work and watch a timber-framed house build — or fail to build — in response. Best held in landscape on a tablet, so the construction happens in front of you.

Six structural elements, each in one of three states:

- **Oak Beam** — designed infrastructure, carries load.
- **Twig** — fragile; holds only because an individual keeps holding it.
- **Gap** — absent.

When all questions are answered, **gravity activates** — the operational pressure your organisation actually faces — and the structure either holds or doesn't.

*22 questions. Everything stays in the browser. No data is sent anywhere.*

---

### Fundament-Diagnose (`fundament.html`)

For management. Answer questions about the governance structures underneath the organisation and see whether your leadership methods provide a foundation — or whether your teams are standing on sand.

Five foundation segments, each in one of three states:

- **Stone** — solid, maintained.
- **Sand** — exists, but depends on individuals to hold it up.
- **Air** — nothing there. The word is in the Leitbild; there is no structure for it.

The five segments:

- **Entscheidungstransparenz** — Do affected people learn about decisions before they feel the consequences?
- **Koordinationsanreize** — Is coordination measured and rewarded, or do only individual results count?
- **Feedbackinfrastruktur** — Can people report structural problems without personal risk? Does anything happen?
- **Verantwortung für Koordinationskosten** — When coordination fails, who bears the cost, and is that visible?
- **Lernfähigkeit der Organisation** — Does the organisation learn from projects and failures, or does every initiative start from zero?

*20 questions. Everything stays in the browser. No data is sent anywhere.*

---

### Bauherr-Diagnose (`bauherr.html`) — *not yet built*

For buyers and decision-makers — the people who purchased the technology without the coordination work, who hold the budget. Diagnoses the *act* of commissioning, not the state of the building.

Designed thin by intent: a door and a provocation, not a long instrument. Its job is to bring a decision-maker to the recognition — *not a character flaw, a missing discipline, and you are positioned to be the one who builds the house* — and to the conversation. The depth lives in Fundament and in the workshop, not here.

---

## How the three relate

- The **Fachwerk** tests coordination infrastructure from *inside* — the experience of the people doing the work.
- The **Fundament** tests governance from *below* — whether leadership has built the structures to support coordination.
- The **Bauherr** tests the commissioning decision from *before & above* — what the purchase set in motion.

The **roof** of the house is operational pressure (Arbeitspensum, betrieblicher Druck). The **foundation** is what leadership provides underneath. The **house** between them is where people work. If the roof is heavy and the foundation is sand, the structure fails — no matter how solid the beams are.

Each tool stands alone. Each links to the others.

---

## The metaphor is structural, not decorative

The Fachwerkhaus is not an illustration draped over a survey. The logic of timber-frame construction maps precisely onto the logic of coordination infrastructure:

- Walls without cross-braces collapse outward under load. Tools without the culture and habits for using them do the same.
- Cross-braces only work when connected to walls. Culture not connected to actual tool usage is decoration.
- A heavy roof on a structure without braces accelerates collapse. Strategic mandates on organisations without coordination infrastructure make things worse.
- The foundation is invisible when the house is working. You only notice it when it cracks.
- A house is commissioned by someone. Who ordered *materials* instead of a *structure* — and who absorbed the difference?

---

## Build status

Tick here so it stops living in one person's head.

**Fachwerk-Diagnose**
- [x] German version built and validated (embedded practice + Touchpoint review)
- [x] Live as a post + link on incolarc.com, house front-and-centre as recognition artwork
- [ ] **Next iteration — free-text field under each section**
- [ ] **Next iteration — export result as a PDF and send it on.** This is the designed "next step" so the person is no longer left alone with the insight: a forwardable artefact to build alliances with (the thing the eight-thousand-emails manager could finally send upward). *Keep generation client-side so "Keine Daten werden gesendet" stays true — user generates the PDF and forwards it themselves; no server round-trip.*
- [ ] English version — for international readers arriving via the printed Touchpoint link

**Fundament-Diagnose**
- [x] German version built (`fundament.html`), wired onto the static house
- [ ] Free-text field under each section
- [ ] Export function
- [ ] Cross-link to/from Fachwerk verified both directions

**Bauherr-Diagnose**
- [ ] Question set drafted (4–5 sharp act-questions + the money recognition)
- [ ] Built thin (`bauherr.html`)
- [ ] Recognition threaded so the *actual* decision-maker recognises themselves and does not dodge into Fundament
- [ ] Diagnostic welded in — *Wissen fließt, oder nicht* survives contact with the buyer room

**Suite-level**
- [ ] **Ductarc three-door landing** — standpoint-first entrance (German) routing worker → Fachwerk, management → Fundament, buyer → Bauherr
- [ ] ductarc.com pointed at the suite
- [ ] Consistent footer / privacy line across all tools

---

## Technology

- Pure HTML/CSS/JS. No frameworks, no dependencies.
- Runs entirely client-side. No server, no data collection, no cookies.
- Hosted on GitHub Pages.

---

## Methodology

Based on the Collaboration Architecture methodology, developed through three years of embedded practice in an 11,000-person industrial organisation. Published in *Touchpoint* (2026); presented at EA DACH (2026).

Position paper: https://www.researchgate.net/publication/401202410_Collaboration_Architecture_A_Position_Paper

---

## Contact

Anke Holst — [hallo@ankeholst.de](mailto:hallo@ankeholst.de)
Institute for Collaboration Architecture — [incolarc.com](https://incolarc.com)
