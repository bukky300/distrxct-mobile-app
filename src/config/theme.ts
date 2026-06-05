export const colors = {
  primary: '#FF5A36',
  primaryDark: '#E03D1E',
  secondary: '#1A1A2E',
  accent: '#F4C430',

  background: '#0a0a0a',
  backgroundLight: '#FFFFFF',
  surface: '#1C1C1E',
  surfaceLight: '#F2F2F7',

  text: '#FFFFFF',
  textLight: '#000000',
  textMuted: '#8E8E93',
  textMutedLight: '#6C6C70',

  border: '#2C2C2E',
  borderLight: '#E5E5EA',

  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#0A84FF',

  starFilled: '#F4C430',
  starEmpty: '#48484A',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h4: { fontSize: 17, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
} as const;
