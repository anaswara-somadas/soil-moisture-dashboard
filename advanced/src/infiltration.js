// advanced/src/infiltration.js
import { getDataRows, getSensorIdToPrefix } from "./state.js";
import { sensorGroups, clusterGroups } from "./sensors.js";

const STABILIZE_MS = 30 * 60 * 1000; // 30 min
const depths = [10, 30, 100];
const infilCharts = {}; // canvasId → Chart instance

function computeInfiltration(location, ev) {
  const rows = getDataRows();
  const sensorPrefixMap = getSensorIdToPrefix();

  const group = sensorGroups[location];
  if (!group) {
    console.error(
      "computeInfiltration: no sensor group for",
      `"${location}"`,
      "available:",
      Object.keys(sensorGroups).join(", ")
    );
    return [0, 0, 0];
  }

  const t0 = ev.start;
  const windowEnd = new Date(ev.end.getTime() + STABILIZE_MS);

  const prev = rows
    .filter((r) => r.datetime && r.datetime <= t0)
    .sort((a, b) => b.datetime - a.datetime)[0] || {};

  const during = rows.filter(
    (r) => r.datetime && r.datetime >= ev.end && r.datetime <= windowEnd
  );

  return group.map(({ rawId, depth }) => {
    const prefix = sensorPrefixMap[rawId];
    if (!prefix) return 0;
    const colName = `${prefix}_wc`;

    const theta0 = prev[colName] || 0;
    const thetaMax = during.length
      ? Math.max(...during.map((r) => r[colName] || 0))
      : theta0;

    return (thetaMax - theta0) * (depth * 10); // Δθ * depth(mm)
  });
}

export function plotInfiltrationForEvent(ev) {
  Object.entries(clusterGroups).forEach(([canvasId, locs]) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (infilCharts[canvasId]) infilCharts[canvasId].destroy();

    const datasets = depths.map((d, i) => {
      const data = locs.map((loc) => {
        if (canvasId === "cluster_AvgSets") {
          const loc2 = loc.replace(" 1", " 2");
          const v1 = computeInfiltration(loc, ev)[i];
          const v2 = computeInfiltration(loc2, ev)[i];
          return (v1 + v2) / 2;
        }
        if (canvasId === "cluster_AvgReps") {
          const vals = locs.map((rep) => computeInfiltration(rep, ev)[i]);
          return vals.reduce((sum, x) => sum + x, 0) / vals.length;
        }
        return computeInfiltration(loc, ev)[i];
      });

      const colors = ["#007bff", "#28a745", "#dc3545"];
      return {
        label: `${d} cm`,
        data,
        backgroundColor: colors[i],
        stack: "stack1",
      };
    });

    infilCharts[canvasId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: locs,
        datasets,
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            title: { display: true, text: "Infiltration (mm)" },
          },
          y: {
            stacked: true,
            title: { display: false },
          },
        },
      },
    });
  });
}
