import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Fetch all trips
export async function getTrips() {
  const q = query(collection(db, "trips"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Render Date-wise Table
export async function renderDateTable() {
  const trips = await getTrips();
  const tbody = document.querySelector("#dateTable tbody");
  tbody.innerHTML = "";

  trips.forEach(trip => {
    const tr = document.createElement("tr");
    if (trip.received === "Yes") tr.classList.add("received-yes");

    tr.innerHTML = `
      <td>${trip.date}</td>
      <td>${trip.vehicle}</td>
      <td>${trip.details}</td>
      <td>${trip.consignor}</td>
      <td>${trip.rate}</td>
      <td>${trip.advance}</td>
      <td>${trip.wt || "-"}</td>
      <td>${trip.mt || "-"}</td>
      <td>${trip.gt || "-"}</td>
      <td class="font-bold">${trip.received}</td>
      <td>
        <button onclick="generateMsg('${trip.id}')" class="btn bg-yellow-400">Msg</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Consignor-wise Tables
export async function renderConsignorTables() {
  const trips = await getTrips();
  const container = document.getElementById("consignorTables");
  container.innerHTML = "";

  // Group trips by consignor
  const consignorGroups = {};
  trips.forEach(trip => {
    if (!consignorGroups[trip.consignor]) consignorGroups[trip.consignor] = [];
    consignorGroups[trip.consignor].push(trip);
  });

  // Render each consignor
  for (const consignor in consignorGroups) {
    const div = document.createElement("div");
    div.innerHTML = `<h3 class="text-xl font-bold mb-2">Consignor: ${consignor}</h3>`;

    const table = document.createElement("table");
    table.classList.add("table-auto", "w-full", "mb-6");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Vehicle</th><th>Date</th><th>Trip Details</th><th>Rate</th>
          <th>Advance</th><th>WT</th><th>MT</th><th>GT</th><th>Received</th><th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    consignorGroups[consignor].forEach(trip => {
      const tr = document.createElement("tr");
      if (trip.received === "Yes") tr.classList.add("received-yes");

      tr.innerHTML = `
        <td>${trip.vehicle}</td>
        <td>${trip.date}</td>
        <td>${trip.details}</td>
        <td>${trip.rate}</td>
        <td>${trip.advance}</td>
        <td>${trip.wt || "-"}</td>
        <td>${trip.mt || "-"}</td>
        <td>${trip.gt || "-"}</td>
        <td class="font-bold">${trip.received}</td>
        <td>
          <button onclick="generateMsg('${trip.id}')" class="btn bg-yellow-400">Msg</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    div.appendChild(table);
    container.appendChild(div);
  }
}

// Filter functions
export function applyFilters() {
  const filterDate = document.getElementById("filterDate")?.value;
  const filterReceived = document.getElementById("filterReceived")?.value;

  const rows = document.querySelectorAll("#dateTable tbody tr");
  rows.forEach(row => {
    const date = row.cells[0].textContent;
    const received = row.cells[9].textContent;

    let show = true;
    if (filterDate && date !== filterDate) show = false;
    if (filterReceived !== "all" && received !== filterReceived) show = false;

    row.style.display = show ? "" : "none";
  });
}

// Init function to call on page load
export async function initTables() {
  if (document.getElementById("dateTable")) await renderDateTable();
  if (document.getElementById("consignorTables")) await renderConsignorTables();

  const filterInputs = document.querySelectorAll("#filterDate, #filterReceived");
  filterInputs.forEach(input => input?.addEventListener("input", applyFilters));
}
