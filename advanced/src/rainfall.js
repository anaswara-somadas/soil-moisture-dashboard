// advanced/src/rainfall.js
import { getWeatherData } from "./state.js";
import { plotInfiltrationForEvent } from "./infiltration.js";

let rainEventChart = null;

// Group rainfall points into discrete events
export function clusterRainEvents(gapHrs = 6, rainThreshold = 0.2) {
  const weather = getWeatherData();
  const pts = weather
    .filter((pt) => pt.y >= rainThreshold)
    .sort((a, b) => a.x - b.x);

  const events = [];
  let curr = null;

  pts.forEach((pt) => {
    if (!curr) {
      curr = { start: pt.x, end: pt.x, sum: pt.y };
    } else {
      const gap = (pt.x - curr.end) / (1000 * 3600);
      if (gap > gapHrs) {
        events.push(curr);
        curr = { start: pt.x, end: pt.x, sum: pt.y };
      } else {
        curr.end = pt.x;
        curr.sum += pt.y;
      }
    }
  });

  if (curr) events.push(curr);
  return events;
}

export function plotRainEvents() {
  const events = clusterRainEvents();
  if (!events.length) {
    alert("No rainfall events found.");
    return;
  }

  const sums = events.map((e) => e.sum);
  const minSum = Math.min(...sums);
  const maxSum = Math.max(...sums);

  const data = events.map((ev) => {
    const center = new Date((ev.start.getTime() + ev.end.getTime()) / 2);
    const durH = (ev.end - ev.start) / (1000 * 3600);
    const radius = Math.max(4, durH);
    const opacity = (ev.sum - minSum) / (maxSum - minSum || 1) || 1;
    return {
      x: center,
      y: 0,
      r: radius,
      sum: ev.sum,
      start: ev.start,
      end: ev.end,
      opacity,
    };
  });

  const ctx = document
    .getElementById("rainEventTimeline")
    .getContext("2d");

  if (rainEventChart) rainEventChart.destroy();

  rainEventChart = new Chart(ctx, {
    type: "bubble",
    data: {
      datasets: [
        {
          label: "Rainfall Events",
          data,
          backgroundColor: data.map((d) =>
            `rgba(0,123,255,${d.opacity.toFixed(2)})`
          ),
          borderColor: "rgba(0,123,255,1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { type: "time", title: { display: true, text: "Time" } },
        y: { display: false },
      },
      plugins: {
        title: { display: true, text: "Rainfall Events Timeline" },
        tooltip: {
          callbacks: {
            label(ctx) {
              const b = ctx.raw;
              const dt = new Date(b.x);
              return [
                `Center:   ${dt.toLocaleString()}`,
                `Duration: ${(b.r / 2).toFixed(1)} h`,
                `Rain:     ${b.sum.toFixed(1)} mm`,
              ];
            },
          },
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
          },
          pan: { enabled: true, mode: "x" },
        },
      },
      onClick: (evt, elems) => {
        if (!elems.length) return;
        const ev = events[elems[0].index];
        // when you click a bubble, recalc infiltration for that event
        plotInfiltrationForEvent(ev);
      },
    },
  });
}
