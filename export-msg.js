import { getTrips } from './tables.js';
import jsPDF from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';

// Generate plain text message per trip
window.generateMsg = async function(tripId) {
  const trips = await getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return alert("Trip not found");

  const msg = `
Date: ${trip.date}
Vehicle No: ${trip.vehicle}

Rate: ${trip.rate}
Advance: ${trip.advance}
WT: ${trip.wt || ""}
MT: ${trip.mt || ""}
GT: ${trip.gt || ""}

Trip Details:
${trip.details}

Consignor Name:
${trip.consignor}
`;

  const editable = prompt("Trip Message (editable before sending):", msg);
  if (editable !== null) alert("You can now copy/paste this message:\n\n" + editable);
};

// Export table to PDF
export async function exportTable(tableId, filename = "trips.pdf") {
  const table = document.getElementById(tableId);
  if (!table) return;

  const canvas = await html2canvas(table);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF('p', 'pt', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
}

// Attach export button events
document.querySelectorAll("#exportBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tableId = btn.closest("div").querySelector("table")?.id || "dateTable";
    exportTable(tableId);
  });
});
