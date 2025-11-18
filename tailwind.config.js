/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--primary-color-rgb) / 0.1)',
          100: 'rgb(var(--primary-color-rgb) / 0.2)',
          200: 'rgb(var(--primary-color-rgb) / 0.3)',
          300: 'rgb(var(--primary-color-rgb) / 0.5)',
          400: 'rgb(var(--primary-color-rgb) / 0.7)',
          500: 'var(--primary-color)', // Main color from CSS variable
          600: 'rgb(var(--primary-color-rgb) / 1.2)',
          700: 'rgb(var(--primary-color-rgb) / 1.5)',
          800: 'rgb(var(--primary-color-rgb) / 1.7)',
          900: 'rgb(var(--primary-color-rgb) / 2)',
        },
        secondary: {
          50: 'rgb(var(--secondary-color-rgb) / 0.1)',
          100: 'rgb(var(--secondary-color-rgb) / 0.2)',
          200: 'rgb(var(--secondary-color-rgb) / 0.3)',
          300: 'rgb(var(--secondary-color-rgb) / 0.5)',
          400: 'rgb(var(--secondary-color-rgb) / 0.7)',
          500: 'var(--secondary-color)', // Main color from CSS variable
          600: 'rgb(var(--secondary-color-rgb) / 1.2)',
          700: 'rgb(var(--secondary-color-rgb) / 1.5)',
          800: 'rgb(var(--secondary-color-rgb) / 1.7)',
          900: 'rgb(var(--secondary-color-rgb) / 2)',
        },
      },
    },
  },
  plugins: [],
}

