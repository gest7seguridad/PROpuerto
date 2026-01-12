/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores corporativos del Ayuntamiento de Puerto del Rosario
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#c77dab',
          500: '#9B4D7B',
          600: '#7B2D5B', // Color principal
          700: '#5c1f43',
          800: '#4a1a37',
          900: '#3d162e',
        },
        granate: {
          DEFAULT: '#7B2D5B',
          light: '#9B4D7B',
          dark: '#5c1f43',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
