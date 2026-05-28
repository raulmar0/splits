import type { Activity, LoadPoint } from "./types";

const CTL_TC = 42;
const ATL_TC = 7;

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setUTCDate(c.getUTCDate() + n);
  return c;
}

export function computeLoadSeries(activities: Pick<Activity, "date" | "tss">[], days: number): LoadPoint[] {
  const tssByDay = new Map<string, number>();
  for (const a of activities) {
    if (!a.date || !Number.isFinite(a.tss)) continue;
    tssByDay.set(a.date, (tssByDay.get(a.date) ?? 0) + a.tss);
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const sortedDates = [...tssByDay.keys()].sort();
  const earliest = sortedDates[0] ? new Date(sortedDates[0]) : today;
  const warmStart = addDays(earliest, -90);
  const start = warmStart < addDays(today, -days) ? warmStart : addDays(today, -days);

  let ctl = 0;
  let atl = 0;
  const all: LoadPoint[] = [];
  for (let d = new Date(start); d <= today; d = addDays(d, 1)) {
    const key = isoDay(d);
    const tss = tssByDay.get(key) ?? 0;
    ctl = ctl + (tss - ctl) / CTL_TC;
    atl = atl + (tss - atl) / ATL_TC;
    all.push({
      date: key,
      ctl: Math.round(ctl * 10) / 10,
      atl: Math.round(atl * 10) / 10,
      tsb: Math.round((ctl - atl) * 10) / 10,
      tss,
    });
  }

  return all.slice(-(days + 1));
}
