// src/charts.js
import { sensorIdToLabel } from "./constants.js";
import {
  getDataRows,
  getSensorIdToPrefix,
  getMainChart,
  setMainChart
} from "./state.js";
import { getRowDate } from "./parsing.js";

// Aggregate data by interval
function aggregateData(points, interval) {
  const buckets = {};
  for (let { x, y } of points) {
    if (!x || y == null || isNaN(y)) continue;
    const d = new Date(x);

    if (interval === "30min") {
      // Snap to 0 or 30 minutes
      const m = d.getMinutes();
      d.setMinutes(m < 30 ? 0 : 30, 0, 0);
    } else if (interval === "hourly") {
      d.setMinutes(0, 0, 0);
    } else if (interval === "daily") {
      d.setHours(0, 0, 0, 0);
    } else if (interval === "weekly") {
      const day = d.getDay(); // 0 = Sunday
      const diff = (day === 0 ? -6 : 1) - day; // Monday as start
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
    } else if (interval === "monthly") {
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
    }

    const key = d.toISOString();
    if (!buckets[key]) buckets[key] = { x: d, sum: 0, count: 0 };
    buckets[key].sum += y;
    buckets[key].count++;
  }

  return Object.values(buckets)
    .map((b) => ({ x: b.x, y: b.sum / b.count }))
    .sort((a, b) => a.x - b.x);
}

// Public: called from HTML
export function updatePlot() {
  const allRows = getDataRows();
  if (!allRows.length) {
    alert("Load data first.");
    return;
  }

  const start = new Date(document.getElementById("startDate").value);
  const end   = new Date(document.getElementById("endDate").value);
  const param = document.getElementById("paramSelect").value; // wc, temp ...
  const interval = document.getElementById("intervalSelect").value;

  const sensors = Array.from(
    document.getElementById("sensorSelect").selectedOptions
  ).map((o) => o.value); // raw IDs

  if (!sensors.length) {
    alert("Select at least one sensor.");
    return;
  }

  const filtered = allRows.filter((r) => {
    const dt = getRowDate(r);
    return dt && dt >= start && dt <= end;
  });

  const sensorPrefixMap = getSensorIdToPrefix();

  const datasets = sensors
    .map((id) => {
      const prefix = sensorPrefixMap[id];
      if (!prefix) return null;

      const pts = filtered
        .map((r) => {
          const dt = getRowDate(r);
          const val = r[`${prefix}_${param}`]; // e.g. "DH1_10_wc"
          return { x: dt, y: val };
        })
        .filter((p) => p.x && p.y != null && !isNaN(p.y));

      const data = aggregateData(pts, interval);
      return {
        label: sensorIdToLabel[id],
        data,
        fill: false,
      };
    })
    .filter(Boolean);

  if (!datasets.length) {
    alert("No data for this selection.");
    return;
  }

  const existingChart = getMainChart();
  if (existingChart) existingChart.destroy();

  const ctx = document.getElementById("mainChart").getContext("2d");
  const newChart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true,
      interaction: { mode: "nearest", intersect: false },
      scales: {
        x: {
          type: "time",
          time: { tooltipFormat: "yyyy-MM-dd HH:mm" },
          title: { display: true, text: "Date" },
        },
        y: {
          title: { display: true, text: param.toUpperCase() },
        },
      },
      plugins: {
        legend: { position: "top" },
        title: { display: false },
      },
    },
  });

  setMainChart(newChart);
}
