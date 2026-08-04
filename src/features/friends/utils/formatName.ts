function capitalizeFirstWord(word?: string | null): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function fullName(firstName?: string | null, lastName?: string | null): string {
  return `${capitalizeFirstWord(firstName)} ${capitalizeFirstWord(lastName)}`.trim();
}

export { capitalizeFirstWord };
