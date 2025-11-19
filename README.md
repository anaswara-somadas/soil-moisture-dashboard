# Soil-moisture-dashboard   
Soil moisture data visualization dashboard for Badia watershed restoration monitoring (JavaScript + Chart.js)

This is an interactive dashboard to visualize high-frequency (30-minute interval) soil moisture data recorded by **Acclima TR-315L** sensors at three depths (-10 cm, -30 cm, -100 cm) from the **Al-Khanasri micro-water harvesting (MWH) site**, part of the Jordan Badia Restoration Initiative led by ICARDA.

---

##  Background

Rangeland degradation in arid regions such as Jordan’s Badia threatens the sustainability of agro-pastoral livelihoods by accelerating soil erosion, depleting vegetation cover, and reducing the land’s capacity to retain the annual rainfall (less than 200 mm). To reverse these trends, ICARDA has piloted two innovative Sustainable Land Management (SLM) technologies at the Badia Research Site (BRS) (Strohmeier et al., 2021): mechanized micro-water harvesting (MWH) using the Vallerani “Delfino” plow, and the traditional Marab system.

Installed in early 2022 at the Al-Khanasri research site, the Vallerani plow deep-rips the subsoil to about 0.5 m and carves a series of semi-circular pits, each roughly 0.5 m wide and deep along the contour. During rainfall, these pits intercept runoff, boost infiltration, and help recharge deeper soil layers and fractured karst aquifers.

To quantify the effectiveness of these methods, advanced **Acclima soil moisture sensors** were strategically installed at various depths. These sensors provide high-resolution data at 30-minute intervals, recording vital parameters such as:

- Volumetric water content (θ)  
- Soil temperature  
- Apparent permittivity  
- Bulk electrical conductivity  
- Pore-water conductivity  

Complementary weather stations continuously log rainfall intensity, wind speed, temperature, humidity etc. Together, these datasets are invaluable for understanding the hydrological impact of MWH and Marab systems on soil moisture dynamics and rangeland restoration.

 **Public dataset download:**  
https://data.mel.cgiar.org/dataset.xhtml?persistentId=hdl:20.500.11766.1/FK2/7S3BIP

---

##  Getting Started

### **1. Clone or download this repository**
```bash
git clone https://github.com/<your-username>/soil-moisture-dashboard.git
```

### **2. Run the dashboard **

Recommended to run using python

### **3. Upload curated data**
- Click **Upload CSV**
- Load the Al Khanasri soil moisture dataset
- The preview table loads the first 100 rows automatically

### **4. Visualize**
Choose:
- Parameter  
- Sensors  
- Time window  
- Interval  

Then click **Plot**.
<img width="1506" height="1041" alt="image" src="https://github.com/user-attachments/assets/529caad5-b18c-41e2-acac-053d5109c7c4" />


### **5. Export**
- **Download Data** → CSV  
- **Download Plot** → PNG  

---


##  Repository Structure

.
├── index.html                 # Dashboard UI and layout
└── src/                       # Modular JavaScript
    ├── app.js                 # Entrypoint (exposes global functions)
    ├── load.js                # Uploading, CSV parsing, preview table, filter initialization
    ├── charts.js              # Chart.js plotting + aggregation logic
    ├── exports.js             # PNG + CSV export functions
    ├── parsing.js             # Date/time parsing utilities
    ├── state.js               # Shared in-memory state (dataRows, chart instance)
    └── constants.js           # Sensor ID → human-readable mapping



##  Research Context

This dashboard supports research on:

- Dryland hydrology  
- Soil moisture response in restoration systems  
- Micro-water harvesting evaluation  
- Jordan Badia restoration  
- Environmental sensor analytics  

---

##  Technologies Used

| Technology | Purpose |
|-----------|---------|
| **JavaScript** | Core logic |
| **PapaParse** | CSV parsing |
| **Chart.js** | Plotting |
| **Bootstrap 5** | UI |
| **HTML + CSS** | Structure & styling |


---

##  Author

**Anaswara T. S.**  
MSc Geo-information Science & Earth Observation  
ITC, University of Twente  

- Hydrology  
- Remote Sensing  
- Dryland Restoration  
- Soil Moisture Analysis  

GitHub: https://github.com/anaswara-somadas  
LinkedIn: www.linkedin.com/in/anaswara-somadas

---


---


