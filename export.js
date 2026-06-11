/* ============================================================
   export.js — Fachwerk-Diagnose PDF export (house included)
   ------------------------------------------------------------
   Fully client-side. Nothing is sent to a server: the browser
   builds the PDF and the user forwards it themselves. This is
   what keeps "Keine Daten werden gesendet" literally true.

   MUST sit in the same folder as diagnose.html, and be loaded
   in diagnose.html (before diagnose.js) together with its two
   CDN dependencies:
     <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
     <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
     <script src="export.js"></script>
     <script src="diagnose.js"></script>

   CAVEAT — html2canvas cannot read the img/ files over file://.
   Serve the page (GitHub Pages is fine) or the house renders blank.
   ============================================================ */

async function exportFachwerkPDF() {
  // Guard: make the failure legible instead of silent if a dep is missing.
  if (!window.jspdf || typeof html2canvas === "undefined") {
    alert(
      "PDF-Bibliotheken sind nicht geladen. Bitte die Seite neu laden " +
      "(Strg+Shift+R). Falls das Problem bleibt: html2canvas / jsPDF " +
      "konnten nicht geladen werden."
    );
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const contentW = pageW - margin * 2;
  let y = margin;

  // --- Title block ---------------------------------------------------
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Fachwerk-Diagnose", margin, y + 4);
  y += 11;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(90);
  const datum = new Date().toLocaleDateString("de-DE");
  pdf.text(
    "Erstellt am " + datum +
      "  ·  Institute for Collaboration Architecture  ·  incolarc.com",
    margin, y
  );
  pdf.setTextColor(0);
  y += 7;

  // --- Helper: place an element as image, slicing across pages -------
  async function addElementAsImage(el) {
    if (!el) return;
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
    const imgW = contentW;
    const imgH = (canvas.height / canvas.width) * imgW;

    // Fits on the remaining space of the current page -> place whole.
    if (imgH <= pageH - y - margin) {
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", margin, y, imgW, imgH);
      y += imgH + 6;
      return;
    }

    // Taller than a page -> slice the source canvas vertically.
    const pxPerMm = canvas.width / imgW;
    let srcY = 0;
    while (srcY < canvas.height) {
      const availMm = pageH - y - margin;
      const sliceHpx = Math.min(availMm * pxPerMm, canvas.height - srcY);

      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = sliceHpx;
      slice.getContext("2d").drawImage(
        canvas, 0, srcY, canvas.width, sliceHpx,
        0, 0, canvas.width, sliceHpx
      );

      const sliceHmm = sliceHpx / pxPerMm;
      pdf.addImage(slice.toDataURL("image/png"), "PNG", margin, y, imgW, sliceHmm);
      srcY += sliceHpx;
      y += sliceHmm;

      if (srcY < canvas.height) { pdf.addPage(); y = margin; }
      else { y += 6; }
    }
  }

  // --- The house (in its final, post-gravity state) ------------------
  await addElementAsImage(document.querySelector(".house-box"));

  // --- The textual diagnosis (#results) ------------------------------
  // Clone #results and strip the export controls so the button/note
  // don't appear inside the PDF.
  const resultsEl = document.getElementById("results");
  if (resultsEl && resultsEl.textContent.trim()) {
    const clone = resultsEl.cloneNode(true);
    const wrap = clone.querySelector(".export-wrap");
    if (wrap) wrap.remove();

    // Render the clone off-screen so html2canvas can capture it.
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.width = resultsEl.offsetWidth + "px";
    document.body.appendChild(clone);

    if (y > pageH - 40) { pdf.addPage(); y = margin; }
    await addElementAsImage(clone);

    document.body.removeChild(clone);
  }

  // --- Free-text notes ------------------------------------------------
  const freitexte = Array.from(document.querySelectorAll(".freitext"))
    .filter((f) => (f.value || f.textContent || "").trim());

  if (freitexte.length) {
    if (y > pageH - 30) { pdf.addPage(); y = margin; }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Ihre Notizen", margin, y);
    y += 7;

    freitexte.forEach((ft) => {
      const label = ft.dataset.label || ft.getAttribute("aria-label") || "";
      const val = (ft.value || ft.textContent || "").trim();

      if (label) {
        if (y > pageH - margin) { pdf.addPage(); y = margin; }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text(label, margin, y);
        y += 5;
      }
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.splitTextToSize(val, contentW).forEach((line) => {
        if (y > pageH - margin) { pdf.addPage(); y = margin; }
        pdf.text(line, margin, y);
        y += 5;
      });
      y += 4;
    });
  }

  // --- Footer (every page): the privacy promise, kept literally ------
  const pages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(120);
    pdf.text(
      "Lokal im Browser erzeugt. Keine Daten wurden gesendet.",
      margin, pageH - 6
    );
    pdf.setTextColor(0);
  }

  pdf.save("Fachwerk-Diagnose.pdf");
}
