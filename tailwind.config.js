/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#1e1b4b', // Deep Indigo for high-contrast accents
          900: '#312e81',
          800: '#3730a3',
          700: '#4338ca',
        }
      }
    },
  },
  plugins: [],
}