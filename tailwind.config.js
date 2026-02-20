/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'india-saffron': '#FF9933',
        'india-white': '#FFFFFF',
        'india-green': '#138808',
        'india-navy': '#000080',
        'tripfit-teal': '#008080',
        'tripfit-cream': '#FFFDD0',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
