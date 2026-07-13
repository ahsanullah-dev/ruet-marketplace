/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ruet: {
          maroon: '#7a0019',
          gold: '#c9a227',
        },
      },
    },
  },
  plugins: [],
};
