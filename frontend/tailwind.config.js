/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        // Premium Quant Theme Colors - Cyber Teal & Deep Navy
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Teal 500
          600: '#0d9488', // Teal 600
          700: '#0f766e', // Teal 700
          900: '#134e4a',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          DEFAULT: '#0ea5e9', // Sky blue
          glow: '#38bdf8'
        }
      }
    },
  },
  plugins: [],
}
