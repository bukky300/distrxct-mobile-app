export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export interface PasswordRequirements {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  symbol: boolean;
}

export const getPasswordRequirements = (password: string): PasswordRequirements => ({
  minLength: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  symbol: /[^A-Za-z0-9]/.test(password),
});

export const isValidPassword = (password: string): boolean =>
  Object.values(getPasswordRequirements(password)).every(Boolean);

export const isValidCoordinate = (lat: number, lng: number): boolean =>
  lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
