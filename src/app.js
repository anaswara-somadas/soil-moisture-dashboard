// src/app.js
import { loadData } from "./load.js";
import { updatePlot } from "./charts.js";
import { downloadPlot, downloadFilteredData } from "./exports.js";

// Expose functions globally for HTML inline handlers
window.loadData = loadData;
window.updatePlot = updatePlot;
window.downloadPlot = downloadPlot;
window.downloadFilteredData = downloadFilteredData;
