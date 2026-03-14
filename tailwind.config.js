/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#E7E8E3', // Lightest - Main background
        'bg-secondary': '#C8C7C3', // Light gray - Secondary surfaces
        'accent-green': '#B4BCAF', // Soft green - Accents
        'accent-teal': '#718E92', // Teal - Primary buttons (contrast)
        'accent-red': '#F64134', // Red - Danger/alerts
        'text-primary': '#3F4245', // Darkest - Text and borders
      },
    },
  },
  plugins: [],
};
