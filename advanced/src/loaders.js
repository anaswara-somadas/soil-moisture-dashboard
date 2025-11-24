// advanced/src/loaders.js
import {
  setDataRows,
  setSensorIdToPrefix,
  setWeatherData,
  getDataRows,
} from "./state.js";
import { buildDatetime, toLocal } from "./parsing.js";
import { sensorIdToLabel } from "./sensors.js";
import { renderTable } from "./tables.js";

export function loadMasterData() {
  const file = document.getElementById("masterFileInput")?.files?.[0];
  if (!file) {
    alert("Select master data file first.");
    return;
  }

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    delimiter: ";",
    complete: (res) => {
      const rows = res.data || [];
      if (!rows.length) {
        alert("No rows in master data.");
        return;
      }

      rows.forEach((r) => {
        if (!r.datetime && r.date != null && r.time != null) {
          r.datetime = buildDatetime(r);
        } else if (r.datetime) {
          r.datetime = new Date(
            r.datetime.toString().replace(/[_ ]+/, "T")
          );
        }
      });

      // build rawId → prefix from *_sensor columns
      const sensorMap = {};
      const sample = rows[0];
      Object.keys(sample).forEach((col) => {
        if (col.endsWith("_sensor")) {
          const prefix = col.replace("_sensor", "");
          const rawId = sample[col];
          if (rawId) sensorMap[rawId] = prefix;
        }
      });
      setSensorIdToPrefix(sensorMap);

      const valid = rows.filter(
        (r) => r.datetime instanceof Date && !isNaN(r.datetime)
      );
      setDataRows(valid);

      renderTable(valid, "masterTable");
      initFilters();
      alert(`Loaded ${valid.length} master records.`);
    },
  });
}

export function loadWeatherData() {
  const file = document.getElementById("weatherFileInput")?.files?.[0];
  if (!file) {
    alert("Select weather-data file first.");
    return;
  }

  Papa.parse(file, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
    complete: (res) => {
      const raw = res.data || [];
      if (!raw.length) {
        alert("No rows in weather file.");
        return;
      }

      const keys = Object.keys(raw[0]);
      const dtKey = keys.find((k) => /date|time/i.test(k));
      const valKey = keys.find((k) => /(rain|precip|value)/i.test(k));

      raw.forEach((r) => {
        r[dtKey] = new Date(r[dtKey]);
      });

      const weather = raw
        .map((r) => ({ x: r[dtKey], y: +r[valKey] }))
        .filter((pt) => pt.x && !isNaN(pt.y));

      setWeatherData(weather);
      renderTable(raw, "weatherTable");
      alert(`Loaded ${weather.length} weather records.`);
    },
  });
}

function initFilters() {
  const rows = getDataRows();
  if (!rows.length) return;

  const timestamps = rows
    .map((r) => r.datetime && r.datetime.getTime())
    .filter(Boolean);
  if (!timestamps.length) return;

  const min = new Date(Math.min(...timestamps));
  const max = new Date(Math.max(...timestamps));

  const startEl = document.getElementById("startDate");
  const endEl = document.getElementById("endDate");
  if (startEl) startEl.value = toLocal(min);
  if (endEl) endEl.value = toLocal(max);

  // sensor dropdown based on sensorIdToPrefix
  const sel = document.getElementById("sensorSelect");
  if (!sel) return;
  sel.innerHTML = "";

  // we need the mapping built in loadMasterData
  const sample = rows[0];
  const rawIds = new Set();
  Object.keys(sample).forEach((col) => {
    if (col.endsWith("_sensor")) {
      const rawId = sample[col];
      if (rawId) rawIds.add(rawId);
    }
  });

  Array.from(rawIds).forEach((rawId) => {
    const opt = document.createElement("option");
    opt.value = rawId;
    opt.text = sensorIdToLabel[rawId] || rawId;
    sel.appendChild(opt);
  });
}
