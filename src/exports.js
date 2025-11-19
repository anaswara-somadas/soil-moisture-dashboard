// src/exports.js
import { sensorIdToLabel } from "./constants.js";
import {
  getMainChart,
  getDataRows,
  getSensorIdToPrefix
} from "./state.js";
import { getRowDate } from "./parsing.js";

export function downloadPlot() {
  const chart = getMainChart();
  if (!chart) {
    alert("Nothing to download yet.");
    return;
  }
  const link = document.createElement("a");
  link.href = chart.toBase64Image();
  link.download = "soil_plot.png";
  link.click();
}

export function downloadFilteredData() {
  const rows = getDataRows();
  if (!rows.length) {
    alert("Load data first.");
    return;
  }

  const start = new Date(document.getElementById("startDate").value);
  const end   = new Date(document.getElementById("endDate").value);
  const param = document.getElementById("paramSelect").value;

  const sensors = Array.from(
    document.getElementById("sensorSelect").selectedOptions
  ).map((o) => o.value); // raw IDs

  if (!sensors.length) {
    alert("Select at least one sensor.");
    return;
  }

  const header = ["datetime", ...sensors.map((id) => sensorIdToLabel[id])];

  const sensorPrefixMap = getSensorIdToPrefix();

  const outRows = rows
    .map((r) => {
      const dt = getRowDate(r);
      if (!dt || dt < start || dt > end) return null;

      const values = sensors.map((id) => {
        const prefix = sensorPrefixMap[id];
        return prefix ? r[`${prefix}_${param}`] ?? "" : "";
      });

      return [formatDate(dt), ...values];
    })
    .filter(Boolean);

  if (!outRows.length) {
    alert("No rows to export for this selection.");
    return;
  }

  const csv = [header, ...outRows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "filtered_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(d) {
  const pad = (n) => n.toString().padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}
