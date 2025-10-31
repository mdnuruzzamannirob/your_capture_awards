export const totalLevels = 5;
export const labels = ['L', '', 'M', '', 'H'];

export function valueToLevel(value: number): number {
  const clamped = Math.max(0, Math.min(100, value));
  return Math.ceil((clamped / 100) * totalLevels);
}
