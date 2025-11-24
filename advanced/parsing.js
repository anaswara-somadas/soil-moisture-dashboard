// advanced/src/parsing.js

// date: 20230221, time: "h00:30" or "00:30"
export function buildDatetime(row) {
  const dVal = row.date;
  const tVal = row.time;
  if (dVal == null || tVal == null) return null;

  const s = String(Math.trunc(dVal));
  if (s.length !== 8) return null;
  const year  = Number(s.slice(0, 4));
  const month = Number(s.slice(4, 6));
  const day   = Number(s.slice(6, 8));

  let ts = String(tVal).trim();
  if (/^h/i.test(ts)) ts = ts.slice(1);
  const [hhStr, mmStr] = ts.split(":");
  const hour = Number(hhStr);
  const min  = Number(mmStr);

  if (
    Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day) ||
    Number.isNaN(hour) || Number.isNaN(min)
  ) return null;

  return new Date(year, month - 1, day, hour, min, 0, 0);
}

export function toLocal(d) {
  const pad = (n) => n.toString().padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

// aggregate & average by interval
export function aggregateData(points, interval) {
  const groups = {};
  points.forEach((pt) => {
    if (pt.y == null || isNaN(pt.y)) return;
    const dt = pt.x;
    let bucket;

    switch (interval) {
      case "hourly":
        bucket = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours());
        break;
      case "daily":
        bucket = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        break;
      case "weekly": {
        const d = new Date(dt);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        bucket = new Date(d.setDate(diff));
        bucket.setHours(0, 0, 0, 0);
        break;
      }
      case "monthly":
        bucket = new Date(dt.getFullYear(), dt.getMonth(), 1);
        break;
      case "30min":
      default: {
        const mins = Math.floor(dt.getMinutes() / 30) * 30;
        bucket = new Date(
          dt.getFullYear(),
          dt.getMonth(),
          dt.getDate(),
          dt.getHours(),
          mins
        );
      }
    }

    const key = bucket.getTime();
    if (!groups[key]) groups[key] = { sum: 0, count: 0, date: bucket };
    groups[key].sum += pt.y;
    groups[key].count++;
  });

  return Object.values(groups)
    .map((g) => ({
      x: g.date,
      y: g.count ? g.sum / g.count : null,
    }))
    .sort((a, b) => a.x - b.x);
}
