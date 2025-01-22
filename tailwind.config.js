/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	], theme: {
		extend: {
			colors: {
				primary: '#E75B10',
				secondary: '#6379F4',
				dark: '#0F1E25',
				card: '#3F3F3F',
				modal: '#000814'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}