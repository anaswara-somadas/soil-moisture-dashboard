// src/load.js
import { sensorIdToLabel } from "./constants.js";
import {
  getDataRows,
  setDataRows,
  setSensorIdToPrefix,
  getSensorIdToPrefix
} from "./state.js";
import { getRowDate, toLocalInput } from "./parsing.js";

// Public: called from HTML
export function loadData() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput?.files?.[0];
  if (!file) {
    alert("Please upload a file.");
    return;
  }

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    delimiter: ";",
    complete: (res) => {
      const rows = res.data || [];
      setDataRows(rows);

      if (!rows.length) {
        alert("No rows found in the file.");
        return;
      }

      // Build map from raw sensor ID -> prefix in column names (e.g. DH1_10)
      buildSensorPrefixMap(rows[0]);

      drawTablePreview();
      initFilters();
    },
  });
}

// Map raw sensor IDs (from *_sensor cols) to prefixes (DH1_10, UT2_30, etc.)
function buildSensorPrefixMap(rowSample) {
  const map = {};
  for (let col of Object.keys(rowSample)) {
    if (col.endsWith("_sensor")) {
      const raw = rowSample[col];                 // e.g. "014Acclima TR..."
      const prefix = col.replace("_sensor", "");  // e.g. "DH1_10"
      if (raw) map[raw] = prefix;
    }
  }
  setSensorIdToPrefix(map);
}

// ---------------------- PREVIEW TABLE ----------------------------------

function drawTablePreview() {
  const preview = document.getElementById("previewTable");
  if (!preview) return;

  preview.innerHTML = "";

  const rows = getDataRows();
  if (!rows.length) return;

  const table = document.createElement("table");
  table.className = "table table-sm table-bordered";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const keys = Object.keys(rows[0] || {});
  thead.innerHTML = "<tr>" + keys.map((k) => `<th>${k}</th>`).join("") + "</tr>";

  const max = Math.min(100, rows.length);
  for (let i = 0; i < max; i++) {
    const r = rows[i];
    const rowHtml =
      "<tr>" + keys.map((k) => `<td>${r[k] ?? ""}</td>`).join("") + "</tr>";
    tbody.insertAdjacentHTML("beforeend", rowHtml);
  }

  table.append(thead, tbody);
  preview.appendChild(table);
}

// ---------------------- FILTER INIT ------------------------------------

function initFilters() {
  const rows = getDataRows();
  const dates = rows.map(getRowDate).filter(Boolean);
  if (!dates.length) return;

  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));

  const startEl = document.getElementById("startDate");
  const endEl   = document.getElementById("endDate");
  if (startEl) startEl.value = toLocalInput(min);
  if (endEl)   endEl.value   = toLocalInput(max);

  const sel = document.getElementById("sensorSelect");
  if (!sel) return;

  sel.innerHTML = "";

  const sensorPrefixMap = getSensorIdToPrefix();

  // Only include sensors that actually appear in this curated file
  Object.entries(sensorIdToLabel).forEach(([id, label]) => {
    if (!sensorPrefixMap[id]) return; // skip if no matching *_sensor col
    const opt = new Option(label, id);
    sel.appendChild(opt);
  });
}
