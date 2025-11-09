export const formatDateToDayMonYear = (isoString: string) => {
  const date = new Date(isoString);

  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
};
