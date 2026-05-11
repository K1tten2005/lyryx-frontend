/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)', 'sans-serif'],
      },
      colors: {
        background: '#f3e8ff', // Light purple
        surface: 'rgba(255, 255, 255, 0.7)', // Translucent white
        accent: {
          DEFAULT: '#a855f7', // Vibrant Frutiger purple (fuchsia-500)
          hover: '#9333ea',   // Darker purple (purple-600)
          light: '#d8b4fe',   // Light purple
        },
        success: '#44bd32', // Vibrant green
      },
      backgroundImage: {
        'frutiger-gradient': 'linear-gradient(180deg, #ffffff 0%, #f3e8ff 100%)',
        'glossy-button': 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 49%, rgba(255,255,255,0) 51%, rgba(0,0,0,0.05) 100%)',
        'glossy-button-hover': 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 49%, rgba(255,255,255,0.1) 51%, rgba(0,0,0,0.1) 100%)',
        'glass-panel': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255,255,255,1)',
        'glossy-btn': '0 4px 6px -1px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.2)',
        'inner-glow': 'inset 0 2px 10px rgba(168, 85, 247, 0.2)',
        'inset-heavy': 'inset 0 3px 6px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,1)',
      }
    },
  },
  plugins: [],
}