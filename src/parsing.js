// src/parsing.js

// Build a Date from 'date' + 'time' columns
// date: 20230221 (YYYYMMDD)
// time: "h00:30", "h01:00", ...
export function getRowDate(row) {
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
export function toLocalInput(d) {
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}
