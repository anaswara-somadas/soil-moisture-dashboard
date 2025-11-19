// src/state.js

let dataRows = [];
let sensorIdToPrefix = {};
let mainChart = null;

export function getDataRows() {
  return dataRows;
}

export function setDataRows(rows) {
  dataRows = rows || [];
}

export function getSensorIdToPrefix() {
  return sensorIdToPrefix;
}

export function setSensorIdToPrefix(map) {
  sensorIdToPrefix = map || {};
}

export function getMainChart() {
  return mainChart;
}

export function setMainChart(chartInstance) {
  mainChart = chartInstance;
}
