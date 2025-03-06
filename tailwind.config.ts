/** @type {import('tailwindcss').Config} */
module.exports = {
	theme: {
		extend: {
			animation: {
				"line-shadow": "line-shadow 5s linear infinite",
			},
			keyframes: {
				"line-shadow": {
					"0%": { "background-position": "0 0" },
					"100%": { "background-position": "100% 100%" },
				},
			},
		},
	},
};
