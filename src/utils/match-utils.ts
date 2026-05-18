export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '00h:00m:00s';
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}h:${String(m).padStart(2, '0')}m:${String(s).padStart(2, '0')}s`;
}

export function formatShortTime(ms: number): string {
  if (ms <= 0) return 'Ended';
  const totalMins = Math.floor(ms / 60000);
  if (totalMins < 60) return `${totalMins}m left`;
  const h = Math.floor(totalMins / 60);
  return `${h}h ${totalMins % 60}m left`;
}
