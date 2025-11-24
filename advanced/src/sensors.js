// advanced/src/sensors.js

// raw Acclima IDs → labels (must match curated file)
export const sensorIdToLabel = {
  "014Acclima TR315L2.2908543": "Downhill Pit 1 (10 cm)",
  "114Acclima TR315L2.2908577": "Downhill Pit 1 (30 cm)",
  "214Acclima TR315L2.2908584": "Downhill Pit 1 (100 cm)",
  "314Acclima TR315L2.2908549": "Pit 1 (10 cm)",
  "414Acclima TR315L2.2908573": "Pit 1 (30 cm)",
  "514Acclima TR315L2.2908571": "Pit 1 (100 cm)",
  "614Acclima TR315L2.2908553": "Uphill Pit 1 (10 cm)",
  "714Acclima TR315L2.2908557": "Uphill Pit 1 (30 cm)",
  "814Acclima TR315L2.2908586": "Uphill Pit 1 (100 cm)",

  "014Acclima TR315L2.2907970": "Interspace 1 (10 cm)",
  "114Acclima TR315L2.2907958": "Interspace 1 (30 cm)",
  "214Acclima TR315L2.2907957": "Interspace 1 (100 cm)",

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

  "014Acclima TR315L2.2907966": "Replicate 1 (10 cm)",
  "114Acclima TR315L2.2907927": "Replicate 1 (30 cm)",
  "514Acclima TR315L2.2908497": "Replicate 1 (100 cm)",
  "314Acclima TR315L2.2907935": "Replicate 2 (10 cm)",
  "414Acclima TR315L2.2907964": "Replicate 2 (30 cm)",
  "814Acclima TR315L2.2908552": "Replicate 2 (100 cm)",
  "614Acclima TR315L2.2908579": "Replicate 3 (10 cm)",
  "714Acclima TR315L2.2908542": "Replicate 3 (30 cm)"
};

// location → [{rawId, depth}, ...]
export const sensorGroups = {
  "Downhill Pit 1": [
    { rawId: "014Acclima TR315L2.2908543", depth: 10 },
    { rawId: "114Acclima TR315L2.2908577", depth: 30 },
    { rawId: "214Acclima TR315L2.2908584", depth: 100 },
  ],
  "Pit 1": [
    { rawId: "314Acclima TR315L2.2908549", depth: 10 },
    { rawId: "414Acclima TR315L2.2908573", depth: 30 },
    { rawId: "514Acclima TR315L2.2908571", depth: 100 },
  ],
  "Uphill Pit 1": [
    { rawId: "614Acclima TR315L2.2908553", depth: 10 },
    { rawId: "714Acclima TR315L2.2908557", depth: 30 },
    { rawId: "814Acclima TR315L2.2908586", depth: 100 },
  ],
  "Interspace 1": [
    { rawId: "014Acclima TR315L2.2907970", depth: 10 },
    { rawId: "114Acclima TR315L2.2907958", depth: 30 },
    { rawId: "214Acclima TR315L2.2907957", depth: 100 },
  ],
  "Downhill Pit 2": [
    { rawId: "014Acclima TR315L2.2908566", depth: 10 },
    { rawId: "114Acclima TR315L2.2907936", depth: 30 },
    { rawId: "214Acclima TR315L2.2908574", depth: 100 },
  ],
  "Pit 2": [
    { rawId: "314Acclima TR315L2.2908569", depth: 10 },
    { rawId: "414Acclima TR315L2.2908546", depth: 30 },
    { rawId: "514Acclima TR315L2.2908544", depth: 100 },
  ],
  "Interspace 2": [
    { rawId: "z14Acclima TR315L2.2907959", depth: 10 },
    { rawId: "y14Acclima TR315L2.2907923", depth: 30 },
    { rawId: "x14Acclima TR315L2.2908502", depth: 100 },
  ],
  "Uphill Pit 2": [
    { rawId: "614Acclima TR315L2.2908583", depth: 10 },
    { rawId: "714Acclima TR315L2.2908564", depth: 30 },
    { rawId: "814Acclima TR315L2.2908532", depth: 100 },
  ],
  "Replicate 1": [
    { rawId: "014Acclima TR315L2.2907966", depth: 10 },
    { rawId: "114Acclima TR315L2.2907927", depth: 30 },
    { rawId: "514Acclima TR315L2.2908497", depth: 100 },
  ],
  "Replicate 2": [
    { rawId: "314Acclima TR315L2.2907935", depth: 10 },
    { rawId: "414Acclima TR315L2.2907964", depth: 30 },
    { rawId: "814Acclima TR315L2.2908552", depth: 100 },
  ],
  "Replicate 3": [
    { rawId: "614Acclima TR315L2.2908579", depth: 10 },
    { rawId: "714Acclima TR315L2.2908542", depth: 30 },
  ],
};

// canvas ID → list of locations
export const clusterGroups = {
  cluster_Set1: ["Downhill Pit 1", "Pit 1", "Uphill Pit 1", "Interspace 1"],
  cluster_Set2: ["Downhill Pit 2", "Pit 2", "Uphill Pit 2", "Interspace 2"],
  cluster_AvgSets: ["Downhill Pit 1", "Pit 1", "Uphill Pit 1", "Interspace 1"],
  cluster_Rep1: ["Replicate 1"],
  cluster_Rep2: ["Replicate 2"],
  cluster_Rep3: ["Replicate 3"],
  cluster_AvgReps: ["Replicate 1", "Replicate 2", "Replicate 3"],
};

// fill modal table
export function populateSensorInfoTable() {
  const tbody = document.getElementById("sensorInfoTable");
  if (!tbody) return;
  tbody.innerHTML = "";

  Object.entries(sensorIdToLabel).forEach(([rawId, label]) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    td1.textContent = label;
    td2.textContent = rawId;
    tr.append(td1, td2);
    tbody.appendChild(tr);
  });
}
