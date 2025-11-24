// advanced/src/tables.js

export function renderTable(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  if (!data || !data.length) return;

  const cols = Object.keys(data[0]);
  const table = document.createElement("table");
  table.className = "table table-sm table-hover";

  const theadRow = table.createTHead().insertRow();
  cols.forEach((c) => {
    const th = document.createElement("th");
    th.textContent = c;
    theadRow.appendChild(th);
  });

  const tbody = table.createTBody();
  data.slice(0, 100).forEach((rowData) => {
    const row = tbody.insertRow();
    cols.forEach((c) => {
      let v = rowData[c];
      if (v instanceof Date) {
        v = v.toISOString().slice(0, 19).replace("T", " ");
      }
      const cell = row.insertCell();
      cell.textContent = v != null ? v : "";
    });
  });

  container.appendChild(table);
}
