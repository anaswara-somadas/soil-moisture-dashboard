// advanced/src/hydrograph.js
import {
  getDataRows,
  getWeatherData,
  getMainChart,
  setMainChart,
  getSensorIdToPrefix,
} from "./state.js";
import { aggregateData } from "./parsing.js";
import { sensorIdToLabel } from "./sensors.js";

export function plotData() {
  const rows = getDataRows();
  const weather = getWeatherData();

  if (!rows.length) {
    alert("Please load master data first.");
    return;
  }
  if (!weather.length) {
    alert("Please load weather data first.");
    return;
  }

  const start = new Date(document.getElementById("startDate").value);
  const end = new Date(document.getElementById("endDate").value);
  const interval = document.getElementById("intervalSelect").value;
  const sensors = Array.from(
    document.getElementById("sensorSelect").selectedOptions
  ).map((o) => o.value);

  if (!sensors.length) {
    alert("Select at least one sensor.");
    return;
  }
  if (isNaN(start) || isNaN(end) || start >= end) {
    alert("Check your date range.");
    return;
  }

  // rainfall dataset
  const rainData = aggregateData(
    weather.filter((pt) => pt.x >= start && pt.x <= end),
    interval
  );
  const rainDataset = {
    type: "bar",
    label: "Rainfall",
    data: rainData,
    yAxisID: "yRight",
    backgroundColor: "rgba(54,162,235,0.6)",
    borderColor: "rgba(54,162,235,1)",
    borderWidth: 1,
    barPercentage: 0.8,
    categoryPercentage: 0.9,
  };

  const sensorPrefixMap = getSensorIdToPrefix();

  // soil moisture datasets
  const soilDatasets = sensors
    .map((rawId, i) => {
      const prefix = sensorPrefixMap[rawId];
      if (!prefix) return null;
      const colName = `${prefix}_wc`;

      const pts = aggregateData(
        rows
          .filter((r) => r.datetime && r.datetime >= start && r.datetime <= end)
          .map((r) => ({ x: r.datetime, y: r[colName] })),
        interval
      );

      const hue = Math.round((i * 180) / Math.max(1, sensors.length));
      const color = `hsl(${hue},60%,50%)`;

      return {
        type: "line",
        label: sensorIdToLabel[rawId] || rawId,
        data: pts,
        yAxisID: "yLeft",
        borderColor: color,
        backgroundColor: color.replace("hsl(", "hsla(").replace(")", ",0.2)"),
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        spanGaps: true,
      };
    })
    .filter(Boolean);

  if (!soilDatasets.length) {
    alert("No valid soil-moisture datasets for this selection.");
    return;
  }

  // x-axis units
  const spanDays = (end - start) / (1000 * 3600 * 24);
  let unit = "day";
  let displayFormats = { day: "MMM d" };
  if (spanDays <= 1) {
    unit = "hour";
    displayFormats = { hour: "HH:mm" };
  } else if (spanDays > 30) {
    unit = "month";
    displayFormats = { month: "MMM yyyy" };
  }

  const existing = getMainChart();
  if (existing) existing.destroy();

  const ctx = document.getElementById("mainChart").getContext("2d");
  const chart = new Chart(ctx, {
    data: { datasets: [rainDataset, ...soilDatasets] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: { unit, displayFormats },
          min: start,
          max: end,
        },
        yLeft: {
          type: "linear",
          position: "left",
          title: { display: true, text: "Soil Moisture (vol. frac.)" },
        },
        yRight: {
          type: "linear",
          position: "right",
          title: { display: true, text: "Rainfall (mm)" },
          grid: { drawOnChartArea: false },
        },
      },
      plugins: {
        title: { display: true, text: "Hydrograph: Soil Moisture & Rainfall" },
        legend: { position: "top" },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
          },
          pan: { enabled: true, mode: "x" },
        },
      },
    },
  });

  setMainChart(chart);
}
