/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heebo': ['Heebo', 'sans-serif'],
      },
      colors: {
        'baby': {
          50: '#fdf8f6',
          100: '#f9ede7',
          200: '#f5ddd2',
          300: '#ecc4b0',
          400: '#dfa285',
          500: '#d08460',
          600: '#c06d4a',
          700: '#a05a3e',
          800: '#854b37',
          900: '#6d4031',
        },
        'sage': {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c6cfc6',
          300: '#a3b1a3',
          400: '#7d8f7d',
          500: '#627462',
          600: '#4d5c4d',
          700: '#404b40',
          800: '#363e36',
          900: '#2e342e',
        },
        'cream': {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#faf3e6',
          300: '#f5e9d4',
          400: '#eddcbd',
          500: '#e4cca3',
        }
      }
    },
  },
  plugins: [],
}
