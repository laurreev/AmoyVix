/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        instagram: {
          start: '#f58529', // orange
          mid1: '#dd2a7b', // pink
          mid2: '#8134af', // purple
          end: '#515bd4', // blue
        },
      },
    },
  },
  plugins: [],
};
