export const getProgress = (length: number, index: number) => {
  if (length === 1) return 100; // edge case: only 1 user

  const min = 20; // last = 20%
  const max = 100; // first = 100%

  const value = max - (index / (length - 1)) * (max - min);
  return value; // 100 → 20
};
