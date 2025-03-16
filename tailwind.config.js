/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#006D77',
        secondary: '#FFDDD2',
        accent: '#E29578',
        background: '#EDFCFD',
        textColor: '#1A3A3A',
      },
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};