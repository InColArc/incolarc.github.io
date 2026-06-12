/* ============================================================
   export.js — Fachwerk-Diagnose PDF export
   Page 1: Diagnose (house + verdict + worker notes + standard text)
   Page 2: Gesprächsgrundlage (2x2 write-on grid)
   Page 3: Notizen (Fortsetzung) — only if notes overflow page 1
   ------------------------------------------------------------
   Fully client-side. Same folder as diagnose.html; loaded before
   diagnose.js with html2canvas + jsPDF above it. Must be SERVED.
   ============================================================ */

async function exportFachwerkPDF() {
  if (!window.jspdf || typeof html2canvas === "undefined") {
    alert("PDF-Bibliotheken sind nicht geladen. Bitte die Seite neu laden (Strg+Shift+R).");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("l", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();   // 297
  const pageH = pdf.internal.pageSize.getHeight();  // 210
  const margin = 12;
  const fullW = pageW - margin * 2;
  const privacyY = pageH - 6;
  const PRIVACY = "Lokal im Browser erzeugt. Keine Daten wurden gesendet.";

  // --- Standard manager text (Anke's wording, verbatim) --------------
  const standardText =
    "Diese Diagnose zeigt Ihnen die digitale Arbeitswelt Ihrer Mitarbeitenden. " +
    "Wenn Sie dieses Ergebnis als Führungskraft erhalten, gibt es Handlungsbedarf. " +
    "In vielen Organisationen wird die Funktion der Wissensinfrastruktur nicht direkt " +
    "mit den Nutzenden gemessen, nachdem die digitalen Werkzeuge von der IT " +
    "bereitgestellt wurden. Dieses Diagnosetool kommt aus der Collaboration Architecture, " +
    "einem Ansatz des aktiven Gestaltens mit den Nutzenden — eine Funktion zwischen der " +
    "operativen Ebene und der IT, die sicherstellt, dass Wissen verlässlich dorthin " +
    "fließt, wo es gebraucht wird.";

  // --- Gesprächsgrundlage (page 2) -----------------------------------
  const gespHead = "Gesprächsgrundlage";
  const gespIntro =
    "In vielen Organisationen gibt es Maßnahmen zur Lösung dieser Probleme. " +
    "Finden Sie sie aktiv. Diese Vorlage können Sie nutzen, um in Ihren regelmäßigen " +
    "Gesprächen mit Mitarbeitenden neue Einsichten und Zusammenhänge zu teilen.";
  const quadrants = [
    { t: "Initiativen, die schon laufen",
      s: "Welche Lösungsversuche, Werkzeuge oder Absprachen gibt es bereits?" },
    { t: "Abteilungen und Rollen, die an diesen Themen arbeiten",
      s: "Wer in der Organisation befasst sich mit Koordination und Wissensfluss — auch wenn kaum jemand davon weiß?" },
    { t: "Nächste Schritte",
      s: "Womit ließe sich beginnen — klein genug, um bald anzufangen?" },
    { t: "Notizen",
      s: "Was ist Ihnen aufgefallen? Was möchten Sie festhalten?" },
  ];

  // --- helper: scale a canvas to fit a box ---------------------------
  function placeFit(canvas, x, y, maxW, maxH, align) {
    const ratio = canvas.height / canvas.width;
    let w = maxW, h = w * ratio;
    if (h > maxH) { h = maxH; w = h / ratio; }
    let drawX = x;
    if (align === "center") drawX = x + (maxW - w) / 2;
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", drawX, y, w, h);
    return { w, h, bottom: y + h };
  }
  function privacyFooter() {
    pdf.setFontSize(8); pdf.setTextColor(120);
    pdf.text(PRIVACY, margin, privacyY); pdf.setTextColor(0);
  }

  // ============================ PAGE 1 ===============================
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(16);
  pdf.text("Fachwerk-Diagnose", margin, 17);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(90);
  pdf.text(
    "Erstellt am " + new Date().toLocaleDateString("de-DE") +
      "  ·  Institute for Collaboration Architecture  ·  incolarc.com",
    margin, 23
  );
  pdf.setTextColor(0);

  // standard text band (bottom)
  const stdSize = 9, stdLineH = 4.3;
  pdf.setFontSize(stdSize);
  const stdLines = pdf.splitTextToSize(standardText, fullW);
  const stdH = stdLines.length * stdLineH;
  const pointerH = 6;
  const ruleY = privacyY - 6 - stdH - pointerH;

  const bandTop = 30;
  const bandBottom = ruleY - 6;
  const bandH = bandBottom - bandTop;
  const leftX = margin, leftW = 150;
  const rightX = 170, rightW = pageW - margin - rightX;

  // RIGHT: house + legend
  const houseEl = document.querySelector(".house-box");
  if (houseEl) {
    const hc = await html2canvas(houseEl, {
      scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
      ignoreElements: (el) => el.id === "prog",
    });
    const legendH = 24;
    const house = placeFit(hc, rightX, bandTop, rightW, bandH - legendH, "center");
    let ly = house.bottom + 7;
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor(60);
    pdf.text("So lesen Sie das Haus:", rightX, ly);
    pdf.setFont("helvetica", "normal"); ly += 4.5;
    [
      "Balken — gestaltete, tragende Struktur",
      "Zweig — hält nur, weil einzelne Menschen es tragen",
      "Lücke — nicht vorhanden",
    ].forEach((line) => {
      pdf.splitTextToSize(line, rightW).forEach((l) => { pdf.text(l, rightX, ly); ly += 4.2; });
    });
    pdf.setTextColor(0);
  }

  // LEFT: verdict, then worker notes below it
  let leftCursor = bandTop;
  const resultsEl = document.getElementById("results");
  if (resultsEl && resultsEl.textContent.trim()) {
    const clone = resultsEl.cloneNode(true);
    clone.querySelectorAll(".export-wrap, .cost-box").forEach((n) => n.remove());
    clone.style.position = "fixed"; clone.style.left = "-9999px"; clone.style.top = "0";
    clone.style.width = "567px"; clone.style.border = "none"; clone.style.margin = "0";
    document.body.appendChild(clone);
    const rc = await html2canvas(clone, {
      scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
    });
    document.body.removeChild(clone);
    const v = placeFit(rc, leftX, bandTop, leftW, bandH, "left");
    leftCursor = v.bottom + 6;
  }

  // Flatten worker notes into renderable lines (bold heading / body)
  const freitexte = Array.from(document.querySelectorAll(".freitext"))
    .filter((f) => (f.value || "").trim());
  const noteLines = [];
  if (freitexte.length) {
    noteLines.push({ text: "Notizen", bold: true, size: 10 });
    freitexte.forEach((ft) => {
      const label = ft.dataset.label || "";
      const val = (ft.value || "").trim();
      if (label) noteLines.push({ text: label, bold: true, size: 9 });
      pdf.setFontSize(9);
      pdf.splitTextToSize(val, leftW).forEach((l) => noteLines.push({ text: l, bold: false, size: 9 }));
      noteLines.push({ text: "", bold: false, size: 4 }); // spacer
    });
  }

  // Render note lines into the left column until band bottom; keep the rest.
  let noteIdx = 0;
  if (noteLines.length) {
    let y = leftCursor;
    for (; noteIdx < noteLines.length; noteIdx++) {
      const ln = noteLines[noteIdx];
      const lh = ln.size <= 4 ? 2.5 : 4.6;
      if (y + lh > bandBottom) break;
      pdf.setFont("helvetica", ln.bold ? "bold" : "normal");
      pdf.setFontSize(ln.size <= 4 ? 9 : ln.size);
      pdf.setTextColor(ln.bold ? 0 : 40);
      if (ln.text) pdf.text(ln.text, leftX, y);
      y += lh;
    }
    pdf.setTextColor(0);
  }

  // standard text + pointer + rule (bottom)
  pdf.setDrawColor(200);
  pdf.line(margin, ruleY, pageW - margin, ruleY);
  let by = ruleY + 5;
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(stdSize); pdf.setTextColor(40);
  stdLines.forEach((line) => { pdf.text(line, margin, by); by += stdLineH; });
  by += 2;
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.setTextColor(20);
  pdf.text("Gesprächsgrundlage auf der Rückseite — bitte beidseitig drucken.", margin, by);
  pdf.setTextColor(0);
  privacyFooter();

  // ============================ PAGE 2 ===============================
  pdf.addPage("a4", "l");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(15);
  pdf.text(gespHead, margin, 18);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9.5); pdf.setTextColor(70);
  const introLines = pdf.splitTextToSize(gespIntro, fullW);
  let iy = 25;
  introLines.forEach((l) => { pdf.text(l, margin, iy); iy += 4.6; });
  pdf.setTextColor(0);

  const gTop = iy + 4;
  const gBottom = pageH - 12;
  const gLeft = margin, gRight = pageW - margin;
  const midX = (gLeft + gRight) / 2;
  const midY = (gTop + gBottom) / 2;
  const gap = 3, pad = 4;
  const cells = [
    [gLeft, gTop, midX, midY, quadrants[0]],
    [midX, gTop, gRight, midY, quadrants[1]],
    [gLeft, midY, midX, gBottom, quadrants[2]],
    [midX, midY, gRight, gBottom, quadrants[3]],
  ];
  pdf.setDrawColor(150);
  cells.forEach(([x1, y1, x2, y2, q]) => {
    const cx = x1 + (x1 === gLeft ? 0 : gap / 2);
    const cy = y1 + (y1 === gTop ? 0 : gap / 2);
    const cw = (x2 - x1) - (x1 === gLeft ? gap / 2 : gap / 2);
    const ch = (y2 - y1) - (y1 === gTop ? gap / 2 : gap / 2);
    pdf.rect(cx, cy, cw, ch);
    // heading
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(10.5); pdf.setTextColor(0);
    let ty = cy + pad + 3;
    pdf.splitTextToSize(q.t, cw - pad * 2).forEach((l) => { pdf.text(l, cx + pad, ty); ty += 4.8; });
    // sub-prompt (faint, italic)
    pdf.setFont("helvetica", "italic"); pdf.setFontSize(8.2); pdf.setTextColor(130);
    ty += 1;
    pdf.splitTextToSize(q.s, cw - pad * 2).forEach((l) => { pdf.text(l, cx + pad, ty); ty += 3.8; });
    pdf.setTextColor(0);
  });
  privacyFooter();

  // ============================ PAGE 3 (overflow) ====================
  if (noteIdx < noteLines.length) {
    pdf.addPage("a4", "l");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
    pdf.text("Notizen (Fortsetzung)", margin, 18);
    let y = 28;
    for (; noteIdx < noteLines.length; noteIdx++) {
      const ln = noteLines[noteIdx];
      const lh = ln.size <= 4 ? 2.5 : 4.8;
      if (y + lh > pageH - 12) { pdf.addPage("a4", "l"); y = 20; }
      pdf.setFont("helvetica", ln.bold ? "bold" : "normal");
      pdf.setFontSize(ln.size <= 4 ? 10 : ln.size + 1);
      pdf.setTextColor(ln.bold ? 0 : 40);
      if (ln.text) pdf.text(ln.text, margin, y);
      y += lh;
    }
    pdf.setTextColor(0);
    // footers on any overflow pages
    const pages = pdf.internal.getNumberOfPages();
    for (let i = 3; i <= pages; i++) { pdf.setPage(i); privacyFooter(); }
  }

  pdf.save("Fachwerk-Diagnose.pdf");
}
