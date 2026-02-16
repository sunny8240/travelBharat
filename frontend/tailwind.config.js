/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#3B2B1F',
        muted: '#5A4636',
        accent: '#9B4A1A',
        paper: '#F6EFE4',
        'light-accent': '#D4844F',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
}
