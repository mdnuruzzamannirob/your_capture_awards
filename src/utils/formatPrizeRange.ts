export const formatPrizeRange = (min: number | null = null, max: number | null = null) => {
  const format = (v: number | null) =>
    v != null ? '$' + Intl.NumberFormat('en', { notation: 'compact' }).format(v) : null;

  const fMin = format(min);
  const fMax = format(max);

  if (fMin && fMax) return `${fMin} - ${fMax}`;
  if (fMin) return fMin;
  if (fMax) return fMax;

  return '';
};
