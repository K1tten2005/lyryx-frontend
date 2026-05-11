/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        background: '#FAF9F6', // Off-white pearl
        foreground: '#111111', // Near black
        surface: '#FFFFFF',
        accent: {
          DEFAULT: '#7C3AED', // Vibrant purple
          hover: '#6D28D9',
          light: '#DDD6FE',
          dark: '#4C1D95',
        },
        border: '#111111', // Brutalist borders
        muted: '#737373',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(17, 17, 17, 1)',
        'brutal-lg': '8px 8px 0px 0px rgba(17, 17, 17, 1)',
        'brutal-sm': '2px 2px 0px 0px rgba(17, 17, 17, 1)',
      }
    },
  },
  plugins: [],
}