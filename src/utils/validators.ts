export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password: string): boolean => password.length >= 8;

export const isValidCoordinate = (lat: number, lng: number): boolean =>
  lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
