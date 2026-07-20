/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        mint: '#E2EDE6',
        forest: '#1C3D2E',
        brand: '#2A5C40',
        surface: '#F3F4F6',
        hairline: '#E5E7EB',
        muted: '#6B7280',
        'muted-light': '#9CA3AF',
        danger: '#DC2626',
        'danger-bg': '#FCE7EC',
      },
      fontFamily: {
        roboto: ['Roboto_400Regular'],
        'roboto-medium': ['Roboto_500Medium'],
        'roboto-bold': ['Roboto_700Bold'],
        'roboto-black': ['Roboto_900Black'],
      },
    },
  },
  plugins: [],
};
