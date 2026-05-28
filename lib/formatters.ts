export function fmtTime(dur: string): string {
  return dur;
}

export function fmtPower(w: number): string {
  return `${Math.round(w)}W`;
}

export function fmtTSS(tss: number): string {
  return `${Math.round(tss)}`;
}

export function fmtIF(ifVal: number): string {
  return ifVal.toFixed(2);
}

export function fmtDist(km: number): string {
  if (km === 0) return "0";
  if (km < 100) return `${km.toFixed(1)}`;
  return `${Math.round(km)}`;
}

export function fmtElev(m: number): string {
  const s = Math.round(m).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");
}

export function fmtPct(pct: number): string {
  return `${Math.round(pct)}%`;
}

export function fmtHR(bpm: number): string {
  return `${Math.round(bpm)}`;
}
