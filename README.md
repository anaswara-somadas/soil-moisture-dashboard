# 🌿 Soil Moisture Dashboard  
### *A Web-Based Tool for Visualizing Soil Moisture Dynamics in the Jordan Badia Watershed Restoration Site*

> This dashboard was developed during my internship at **ICARDA Jordan**, as part of my MSc in Geo-information Science & Earth Observation (Natural Resources Management) at the University of Twente. It transforms raw half-hourly Acclima sensor data into meaningful, interactive hydrological insights — enabling researchers to analyse soil–water processes behind micro-water harvesting interventions.

---

<p align="center">
  <img src="assets/dashboard_demo.gif" width="750">
</p>

The **Soil Moisture Dashboard** is a browser-based, fully client-side application designed to handle curated soil moisture and weather datasets from the **Al-Khanasri Badia Research Site**, where ICARDA investigates sustainable land management strategies such as **micro-water harvesting using Vallerani “Delfino” pits**.

The tool provides two interfaces:
- 🌱 **Main Dashboard** — intuitive time-series soil moisture visualization  
- 🌧️ **Advanced Dashboard** — rainfall event detection & infiltration analysis  

---

# 🌍 Background

Jordan’s Badia region faces severe land degradation, low annual rainfall (<200 mm), and declining infiltration capacity. ICARDA implements **micro-water harvesting (MWH)** using the Vallerani “Delfino” plow to restore soil hydrological functioning.

The site hosts a dense network of Acclima TR-315 sensors across:
- Downhill pits  
- Pit centers  
- Uphill pits  
- Interspaces  
- Untreated replicates

<img width="848" height="487" alt="image" src="https://github.com/user-attachments/assets/443073c6-6757-4b68-b9b3-4004dba174ab" />

<img width="820" height="485" alt="image" src="https://github.com/user-attachments/assets/230ce9b6-d9ac-4455-8778-b76ece0ca34a" />

These track:
- Volumetric water content (θ)  
- Temperature  
- Permittivity  
- Bulk EC  
- Pore-water EC  

High-frequency data rapidly grows to millions of rows — impossible to analyze manually.  
This dashboard automates the workflow with a clean, modern UI.

---

# 🎯 Features

## 📊 1. Soil Moisture Visualization (Main Dashboard)
- Upload curated CSV (cleaned using R preprocessing script)  
- Preview first 100 rows  
- Select:
  - date range
  - multiple sensors
  - parameter (`wc`, `temp`, `perm`, `bulkEC`, `poreEC`)
  - aggregation interval (30 min → monthly)
- Fully interactive Chart.js time-series plot  
- Zoom, pan, export plot, export filtered dataset  

## 🌧️ 2. Rainfall Event Detection (Advanced Dashboard)
Detects rainfall events based on:
- ≥ **0.2 mm** rainfall threshold
- ≥ **6 hours** separation between events

Visualized as a **bubble timeline**, where:
- Bubble radius = event duration  
- Bubble color = total rainfall  
- Clicking an event updates the infiltration charts  

## 🌊 3. Infiltration Depth Estimation
For each rainfall event:

Infiltration (mm) = (θmax − θ0) × depth_mm


Computed across:
- Set 1 (Pit 1 & neighbors)  
- Set 2 (Pit 2 & neighbors)  
- Replicates 1–3  
- Average sets  
- Average replicates  

Results shown as clean, stacked horizontal bar charts.

## 🧩 4. Modular Code Architecture (ES Modules)
Both dashboards use a structured ES-module system:
- `parsing.js`
- `loaders.js`
- `hydrograph.js`
- `rainfall.js`
- `infiltration.js`
- `sensors.js`
- `state.js`
- `tables.js`
- `advancedApp.js` (advanced entrypoint)
- `app.js` (main entrypoint)

---

# 🗂️ Project Structure
├── index.html # Main dashboard
├── src/
│ ├── app.js
│ ├── parsing.js
│ ├── load.js
│ ├── charts.js
│ ├── constants.js
│ └── state.js
│
└── advanced/
├── advanced.html # Advanced dashboard
└── src/
├── advancedApp.js
├── loaders.js
├── parsing.js
├── hydrograph.js
├── rainfall.js
├── infiltration.js
├── sensors.js
├── tables.js
└── state.js


---

# 📥 Downloading the Data (Open Access via ICARDA MEL)

The curated soil moisture dataset used by this dashboard is available **open access** through the  
🌐 **ICARDA MEL Data Repository (Monitoring, Evaluation & Learning)**.

You can freely download the full dataset here:

https://data.mel.cgiar.org/dataset.xhtml?persistentId=hdl:20.500.11766.1/FK2/7S3BIP

# 📁 Input Data Format (Curated CSV)

The dashboard reads the curated file with structure:

| Column | Description |
|--------|-------------|
| `date` | `YYYYMMDD` |
| `time` | `h00:30`, `00:30`, `13:00`… |
| `<prefix>_sensor` | Raw Acclima ID |
| `<prefix>_wc` | Volumetric water content |
| `<prefix>_temp` | Temperature |
| `<prefix>_perm` | Permittivity |
| `<prefix>_bulkEC` | Bulk EC |
| `<prefix>_poreEC` | Pore-water EC |

Prefix example:

DH1_10_sensor = "014Acclima TR315L2.2908543"
DH1_10_wc = 0.237
DH1_10_temp = 19.3


Prefixes correspond to location × depth.

---

# 🚀 Running the Dashboard

This is a **static JavaScript application** and requires a local server.

## Option 1 — Python (recommended)

```bash
python -m http.server

http://localhost:8000/index.html
http://localhost:8000/advanced/advanced.html
```

## Option 2 — VS Code Live Server
```

Right-click → Open with Live Server
```
# 📌 Scientific Context

This dashboard supports hydrological analysis in the ICARDA Badia Restoration Site, enabling:

Visualization of soil moisture pulses after rain

Comparison of Vallerani-treated vs. untreated plots

Understanding slope effects and interspace responses

Event-scale infiltration dynamics

Rapid QC and exploration of multi-year datasets

# Author
Anaswara Tharavanthedath Somadas
MSc Geo-information Science & Earth Observation (Natural Resources)
University of Twente · ICARDA Jordan (2024–2025)

