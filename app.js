let dataRows = [];
let sensorIdToPrefix = {};
let mainChart;

// Map raw Acclima IDs (from *_sensor columns) to human-readable labels
const sensorIdToLabel = {
  "014Acclima TR315L2.2908543": "Downhill Pit 1 (10 cm)",
  "114Acclima TR315L2.2908577": "Downhill Pit 1 (30 cm)",
  "214Acclima TR315L2.2908584": "Downhill Pit 1 (100 cm)",
  "314Acclima TR315L2.2908549": "Pit 1 (10 cm)",
  "414Acclima TR315L2.2908573": "Pit 1 (30 cm)",
  "514Acclima TR315L2.2908571": "Pit 1 (100 cm)",
  "614Acclima TR315L2.2908553": "Uphill Pit 1 (10 cm)",
  "714Acclima TR315L2.2908557": "Uphill Pit 1 (30 cm)",
  "814Acclima TR315L2.2908586": "Uphill Pit 1 (100 cm)",

  "014Acclima TR315L2.2908566": "Downhill Pit 2 (10 cm)",
  "114Acclima TR315L2.2907936": "Downhill Pit 2 (30 cm)",
  "214Acclima TR315L2.2908574": "Downhill Pit 2 (100 cm)",
  "314Acclima TR315L2.2908569": "Pit 2 (10 cm)",
  "414Acclima TR315L2.2908546": "Pit 2 (30 cm)",
  "514Acclima TR315L2.2908544": "Pit 2 (100 cm)",
  "614Acclima TR315L2.2908583": "Uphill Pit 2 (10 cm)",
  "714Acclima TR315L2.2908564": "Uphill Pit 2 (30 cm)",
  "814Acclima TR315L2.2908532": "Uphill Pit 2 (100 cm)",

  "x14Acclima TR315L2.2908502": "Interspace 2 (100 cm)",
  "y14Acclima TR315L2.2907923": "Interspace 2 (30 cm)",
  "z14Acclima TR315L2.2907959": "Interspace 2 (10 cm)",

  "014Acclima TR315L2.2907970": "Interspace 1 (10 cm)",
  "114Acclima TR315L2.2907958": "Interspace 1 (30 cm)",
  "214Acclima TR315L2.2907957": "Interspace 1 (100 cm)",

  "014Acclima TR315L2.2907966": "Untreated 1 (10 cm)",
  "114Acclima TR315L2.2907927": "Untreated 1 (30 cm)",
  "314Acclima TR315L2.2907935": "Untreated 2 (10 cm)",
  "414Acclima TR315L2.2907964": "Untreated 2 (30 cm)",
  "514Acclima TR315L2.2908497": "Untreated 2 (100 cm)",
  "614Acclima TR315L2.2908579": "Untreated 3 (10 cm)",
  "714Acclima TR315L2.2908542": "Untreated 3 (30 cm)",
  "814Acclima TR315L2.2908552": "Untreated 3 (100 cm)"
};

// ---------------------- LOADING ----------------------------------------

function loadData() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) {
    alert('Please upload a file.');
    return;
  }

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    delimiter: ';',
    complete: res => {
      dataRows = res.data || [];
      if (!dataRows.length) {
        alert('No rows found in the file.');
        return;
      }

      // Build map from raw sensor ID -> prefix in column names (e.g. DH1_10)
      buildSensorPrefixMap(dataRows[0]);

      drawTablePreview();
      initFilters();
    }
  });
}

// Map raw sensor IDs (from *_sensor cols) to prefixes (DH1_10, UT2_30, etc.)
function buildSensorPrefixMap(row) {
  sensorIdToPrefix = {};
  for (let col of Object.keys(row)) {
    if (col.endsWith('_sensor')) {
      const raw = row[col];                 // e.g. "014Acclima TR..."
      const prefix = col.replace('_sensor', ''); // e.g. "DH1_10"
      if (raw) sensorIdToPrefix[raw] = prefix;
    }
  }
}

// ---------------------- PREVIEW TABLE ----------------------------------

function drawTablePreview() {
  const preview = document.getElementById('previewTable');
  preview.innerHTML = '';
  if (!dataRows.length) return;

  const table = document.createElement('table');
  table.className = 'table table-sm table-bordered';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const keys = Object.keys(dataRows[0] || {});
  thead.innerHTML = '<tr>' + keys.map(k => `<th>${k}</th>`).join('') + '</tr>';

  const max = Math.min(100, dataRows.length);
  for (let i = 0; i < max; i++) {
    const r = dataRows[i];
    const rowHtml =
      '<tr>' + keys.map(k => `<td>${r[k] ?? ''}</td>`).join('') + '</tr>';
    tbody.insertAdjacentHTML('beforeend', rowHtml);
  }

  table.append(thead, tbody);
  preview.appendChild(table);
}

// ---------------------- TIME HANDLING ----------------------------------

// Build a Date from 'date' + 'time' columns
// date: 20230221 (YYYYMMDD)
// time: "h00:30", "h01:00", ...
function getRowDate(row) {
  let d = row.date;
  let t = row.time;
  if (d == null || t == null) return null;

  // Date part
  let s = String(Math.trunc(d)); // handle numeric
  if (s.length !== 8) return null;
  const year  = Number(s.slice(0, 4));
  const month = Number(s.slice(4, 6));
  const day   = Number(s.slice(6, 8));

  // Time part
  let ts = String(t).trim();
  // Remove leading 'h' if present (e.g. "h00:30")
  if (/^h/i.test(ts)) ts = ts.slice(1);
  const [hhStr, mmStr] = ts.split(':');
  const hour = Number(hhStr);
  const min  = Number(mmStr);

  if (
    Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day) ||
    Number.isNaN(hour) || Number.isNaN(min)
  ) return null;

  return new Date(year, month - 1, day, hour, min, 0, 0);
}

// For datetime-local input (YYYY-MM-DDTHH:MM)
function toLocalInput(d) {
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

// ---------------------- FILTER INIT ------------------------------------

function initFilters() {
  const dates = dataRows.map(getRowDate).filter(Boolean);
  if (!dates.length) return;

  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));

  document.getElementById('startDate').value = toLocalInput(min);
  document.getElementById('endDate').value   = toLocalInput(max);

  const sel = document.getElementById('sensorSelect');
  sel.innerHTML = '';

  // Only include sensors that actually appear in this curated file
  Object.entries(sensorIdToLabel).forEach(([id, label]) => {
    if (!sensorIdToPrefix[id]) return; // skip if no matching *_sensor col
    const opt = new Option(label, id);
    sel.appendChild(opt);
  });
}

// ---------------------- AGGREGATION ------------------------------------

function aggregateData(points, interval) {
  const buckets = {};
  for (let { x, y } of points) {
    if (!x || y == null || isNaN(y)) continue;
    const d = new Date(x);

    if (interval === '30min') {
      // Snap to 0 or 30 minutes
      const m = d.getMinutes();
      d.setMinutes(m < 30 ? 0 : 30, 0, 0);
    } else if (interval === 'hourly') {
      d.setMinutes(0, 0, 0);
    } else if (interval === 'daily') {
      d.setHours(0, 0, 0, 0);
    } else if (interval === 'weekly') {
      const day = d.getDay(); // 0 = Sunday
      const diff = (day === 0 ? -6 : 1) - day; // Monday as start
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
    } else if (interval === 'monthly') {
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
    }

    const key = d.toISOString();
    if (!buckets[key]) buckets[key] = { x: d, sum: 0, count: 0 };
    buckets[key].sum += y;
    buckets[key].count++;
  }

  return Object.values(buckets)
    .map(b => ({ x: b.x, y: b.sum / b.count }))
    .sort((a, b) => a.x - b.x);
}

// ---------------------- PLOTTING ---------------------------------------

function updatePlot() {
  if (!dataRows.length) {
    alert('Load data first.');
    return;
  }

  const start = new Date(document.getElementById('startDate').value);
  const end   = new Date(document.getElementById('endDate').value);
  const param = document.getElementById('paramSelect').value;    // wc, temp ...
  const interval = document.getElementById('intervalSelect').value;

  const sensors = Array.from(
    document.getElementById('sensorSelect').selectedOptions
  ).map(o => o.value); // raw IDs

  if (!sensors.length) {
    alert('Select at least one sensor.');
    return;
  }

  const filtered = dataRows.filter(r => {
    const dt = getRowDate(r);
    return dt && dt >= start && dt <= end;
  });

  const datasets = sensors.map(id => {
    const prefix = sensorIdToPrefix[id];
    if (!prefix) return null;

    const pts = filtered.map(r => {
      const dt = getRowDate(r);
      const val = r[`${prefix}_${param}`]; // e.g. "DH1_10_wc"
      return { x: dt, y: val };
    }).filter(p => p.x && p.y != null && !isNaN(p.y));

    const data = aggregateData(pts, interval);
    return {
      label: sensorIdToLabel[id],
      data,
      fill: false
    };
  }).filter(Boolean);

  if (!datasets.length) {
    alert('No data for this selection.');
    return;
  }

  if (mainChart) mainChart.destroy();
  const ctx = document.getElementById('mainChart').getContext('2d');
  mainChart = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      interaction: { mode: 'nearest', intersect: false },
      scales: {
        x: {
          type: 'time',
          time: { tooltipFormat: 'yyyy-MM-dd HH:mm' },
          title: { display: true, text: 'Date' }
        },
        y: {
          title: { display: true, text: param.toUpperCase() }
        }
      },
      plugins: {
        legend: { position: 'top' },
        title: { display: false }
      }
    }
  });
}

// ---------------------- EXPORTS ----------------------------------------

function downloadPlot() {
  if (!mainChart) {
    alert('Nothing to download yet.');
    return;
  }
  const link = document.createElement('a');
  link.href = mainChart.toBase64Image();
  link.download = 'soil_plot.png';
  link.click();
}

function downloadFilteredData() {
  if (!dataRows.length) {
    alert('Load data first.');
    return;
  }

  const start = new Date(document.getElementById('startDate').value);
  const end   = new Date(document.getElementById('endDate').value);
  const param = document.getElementById('paramSelect').value;

  const sensors = Array.from(
    document.getElementById('sensorSelect').selectedOptions
  ).map(o => o.value); // raw IDs

  if (!sensors.length) {
    alert('Select at least one sensor.');
    return;
  }

  const header = ['datetime', ...sensors.map(id => sensorIdToLabel[id])];

  const rows = dataRows.map(r => {
    const dt = getRowDate(r);
    if (!dt || dt < start || dt > end) return null;

    const values = sensors.map(id => {
      const prefix = sensorIdToPrefix[id];
      return prefix ? (r[`${prefix}_${param}`] ?? '') : '';
    });

    return [formatDate(dt), ...values];
  }).filter(Boolean);

  if (!rows.length) {
    alert('No rows to export for this selection.');
    return;
  }

  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'filtered_data.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(d) {
  const pad = n => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
