/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				'ecom-bg-lime': '#ecfccb',
				'ecom-highlight': '#a3e635',
				'ecom-bg-teal': '#f0fdfa',
			},
		},
	},
	plugins: [
		require('tailwind-scrollbar-hide'),
		// ...
	],
};
