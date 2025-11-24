// advanced/src/state.js

let dataRows = [];
let weatherData = [];
let mainChart = null;
let sensorIdToPrefix = {};

export function getDataRows() {
  return dataRows;
}
export function setDataRows(rows) {
  dataRows = rows || [];
}

export function getWeatherData() {
  return weatherData;
}
export function setWeatherData(rows) {
  weatherData = rows || [];
}

export function getMainChart() {
  return mainChart;
}
export function setMainChart(chart) {
  mainChart = chart;
}

export function getSensorIdToPrefix() {
  return sensorIdToPrefix;
}
export function setSensorIdToPrefix(map) {
  sensorIdToPrefix = map || {};
}
