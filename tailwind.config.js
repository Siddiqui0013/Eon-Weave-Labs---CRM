/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      colors: {
        primary: "#E75B10",
        secondary: "#6379F4",
        dark: "#0F1E25",
        card : "#3F3F3F"
    },    
    },
  },
  plugins: [],
}