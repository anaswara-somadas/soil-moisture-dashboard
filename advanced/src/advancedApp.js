// advanced/src/advancedApp.js
import { loadMasterData, loadWeatherData } from "./loaders.js";
import { plotData } from "./hydrograph.js";
import { plotRainEvents, clusterRainEvents } from "./rainfall.js";
import { plotInfiltrationForEvent } from "./infiltration.js";
import { populateSensorInfoTable } from "./sensors.js";

// register zoom plugin
if (typeof ChartZoom !== "undefined") {
  Chart.register(ChartZoom);
}

document.addEventListener("DOMContentLoaded", () => {
  const loadMasterBtn = document.getElementById("loadMasterBtn");
  const loadWeatherBtn = document.getElementById("loadWeatherBtn");
  const plotBtn = document.getElementById("plotBtn");
  const plotRainBtn = document.getElementById("plotRainBtn");
  const plotInfilBtn = document.getElementById("plotInfilBtn");

  if (loadMasterBtn) loadMasterBtn.addEventListener("click", loadMasterData);
  if (loadWeatherBtn) loadWeatherBtn.addEventListener("click", loadWeatherData);
  if (plotBtn) plotBtn.addEventListener("click", plotData);
  if (plotRainBtn) plotRainBtn.addEventListener("click", plotRainEvents);
  if (plotInfilBtn) {
    plotInfilBtn.addEventListener("click", () => {
      const events = clusterRainEvents();
      if (!events.length) {
        alert("No rainfall events found.");
        return;
      }
      plotInfiltrationForEvent(events[0]); // pick first event for now
    });
  }

  // fill sensor info modal table
  populateSensorInfoTable();
});
