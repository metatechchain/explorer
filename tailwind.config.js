/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        mlg: "930px", // Custom breakpoint
      },
      maxHeight: {
        '400': '25rem',
      }
    },
  },
  plugins: [],
};
