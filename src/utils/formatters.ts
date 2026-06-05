export const formatDistance = (metres: number): string => {
  if (metres < 1000) return `${Math.round(metres)}m`;
  return `${(metres / 1000).toFixed(1)}km`;
};

export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatRating = (rating: number): string => rating.toFixed(1);

export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
