/* ============================================================
   export.js — Fachwerk-Diagnose PDF export
   Landscape boundary object: house (right) + verdict (left),
   manager-addressed standard text full-width at the bottom.
   ------------------------------------------------------------
   Fully client-side. Nothing is sent to a server: the browser
   builds the PDF and the user forwards it themselves.

   Same folder as diagnose.html. Loaded before diagnose.js,
   with its two CDN deps (html2canvas, jsPDF) above it.
   Must be SERVED (not file://) or the house renders blank.
   ============================================================ */

async function exportFachwerkPDF() {
  if (!window.jspdf || typeof html2canvas === "undefined") {
    alert("PDF-Bibliotheken sind nicht geladen. Bitte die Seite neu laden (Strg+Shift+R).");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("l", "mm", "a4");   // landscape
  const pageW = pdf.internal.pageSize.getWidth();   // 297
  const pageH = pdf.internal.pageSize.getHeight();  // 210
  const margin = 12;

  // Manager-addressed standard text (Anke's wording, verbatim).
  const standardText =
    "Dieses Tool visualisiert die digitale Arbeitswelt Ihrer Mitarbeitenden. " +
    "Wenn Sie dieses Resultat als Führungskraft bekommen, besteht Handlungsbedarf, " +
    "den Sie eventuell so noch nicht bemerkt hatten, weil die Funktionsfähigkeit " +
    "Ihrer Wissensinfrastruktur nicht gemessen wird. Das ist keine Anschuldigung — " +
    "diese Rolle gibt es bis jetzt noch in sehr wenigen Organisationen. Sie heißt " +
    "Collaboration Architecture, sitzt — je nach dem Aufbau Ihrer Organisation — " +
    "zwischen IT und der Operativen, und stellt sicher, dass Wissensinfrastruktur " +
    "für die Menschen, die in ihr arbeiten, funktioniert.";

  // ---- helper: scale a canvas to fit a box, return placed box -------
  function placeFit(canvas, x, y, maxW, maxH, align) {
    const ratio = canvas.height / canvas.width;
    let w = maxW, h = w * ratio;
    if (h > maxH) { h = maxH; w = h / ratio; }
    let drawX = x;
    if (align === "center") drawX = x + (maxW - w) / 2;
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", drawX, y, w, h);
    return { w, h, bottom: y + h };
  }

  // ---- title --------------------------------------------------------
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Fachwerk-Diagnose", margin, 17);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(90);
  pdf.text(
    "Erstellt am " + new Date().toLocaleDateString("de-DE") +
      "  ·  Institute for Collaboration Architecture  ·  incolarc.com",
    margin, 23
  );
  pdf.setTextColor(0);

  // ---- compute the bottom standard-text band ------------------------
  const privacyY = pageH - 6;
  pdf.setFontSize(9.5);
  const stdLines = pdf.splitTextToSize(standardText, pageW - margin * 2);
  const stdLineH = 4.6;
  const stdH = stdLines.length * stdLineH;
  const stdTop = privacyY - 6 - stdH;
  const ruleY = stdTop - 5;

  // ---- the two-column band ------------------------------------------
  const bandTop = 30;
  const bandBottom = ruleY - 6;
  const bandH = bandBottom - bandTop;

  const leftX = margin, leftW = 150;
  const rightX = 170, rightW = pageW - margin - rightX;  // ~115

  // RIGHT column: the house (counter #prog removed from capture)
  const houseEl = document.querySelector(".house-box");
  if (houseEl) {
    const hc = await html2canvas(houseEl, {
      scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
      ignoreElements: (el) => el.id === "prog",
    });
    const legendH = 26;
    const house = placeFit(hc, rightX, bandTop, rightW, bandH - legendH, "center");

    // Legend — so a reader who doesn't know the method can read the timber.
    let ly = house.bottom + 7;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(60);
    pdf.text("So lesen Sie das Haus:", rightX, ly);
    pdf.setFont("helvetica", "normal");
    ly += 4.5;
    [
      "Balken — gestaltete, tragende Struktur",
      "Zweig — hält nur, weil einzelne Menschen es tragen",
      "Lücke — nicht vorhanden",
    ].forEach((line) => {
      pdf.splitTextToSize(line, rightW).forEach((l) => {
        pdf.text(l, rightX, ly);
        ly += 4.2;
      });
    });
    pdf.setTextColor(0);
  }

  // LEFT column: the verdict (cost box + export controls stripped)
  const resultsEl = document.getElementById("results");
  if (resultsEl && resultsEl.textContent.trim()) {
    const clone = resultsEl.cloneNode(true);
    ["\.export-wrap", "\.cost-box"].forEach((sel) => {
      const n = clone.querySelector(sel.replace("\\", ""));
      if (n) n.remove();
    });
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.width = "567px";   // ~150mm worth, so text reflows legibly
    clone.style.border = "none";
    clone.style.margin = "0";
    document.body.appendChild(clone);

    const rc = await html2canvas(clone, {
      scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false,
    });
    document.body.removeChild(clone);

    placeFit(rc, leftX, bandTop, leftW, bandH, "left");
  }

  // ---- bottom: rule + manager standard text -------------------------
  pdf.setDrawColor(200);
  pdf.line(margin, ruleY, pageW - margin, ruleY);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.setTextColor(40);
  let sy = stdTop + 3;
  stdLines.forEach((line) => { pdf.text(line, margin, sy); sy += stdLineH; });
  pdf.setTextColor(0);

  // ---- privacy footer (page 1) --------------------------------------
  pdf.setFontSize(8);
  pdf.setTextColor(120);
  pdf.text("Lokal im Browser erzeugt. Keine Daten wurden gesendet.", margin, privacyY);
  pdf.setTextColor(0);

  // ---- page 2: the worker's notes (if any) --------------------------
  const freitexte = Array.from(document.querySelectorAll(".freitext"))
    .filter((f) => (f.value || "").trim());

  if (freitexte.length) {
    pdf.addPage("a4", "l");
    let y = margin + 6;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text("Notizen aus der Diagnose", margin, y);
    y += 9;

    freitexte.forEach((ft) => {
      const label = ft.dataset.label || "";
      const val = (ft.value || "").trim();
      if (y > pageH - 16) { pdf.addPage("a4", "l"); y = margin + 6; }

      if (label) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text(label, margin, y);
        y += 5.5;
      }
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.splitTextToSize(val, pageW - margin * 2).forEach((line) => {
        if (y > pageH - 12) { pdf.addPage("a4", "l"); y = margin + 6; }
        pdf.text(line, margin, y);
        y += 5;
      });
      y += 5;
    });

    const pages = pdf.internal.getNumberOfPages();
    for (let i = 2; i <= pages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(120);
      pdf.text("Lokal im Browser erzeugt. Keine Daten wurden gesendet.", margin, pageH - 6);
      pdf.setTextColor(0);
    }
  }

  pdf.save("Fachwerk-Diagnose.pdf");
}
