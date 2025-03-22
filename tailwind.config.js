/** @type {import('tailwindcss').Config} */
import { withAccountKitUi } from "@account-kit/react/tailwind";

export default withAccountKitUi({
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
}, {
  // Optional: Customize Account Kit UI to match PTH branding
  colors: {
    "btn-primary": '#006D77', // Matches your primary color
    "text-primary": '#1A3A3A', // Matches your textColor
  },
});