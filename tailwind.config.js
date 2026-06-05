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
