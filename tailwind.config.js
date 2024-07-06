/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  safelist: ["bg-blue-400", "bg-green-400", "bg-red-400"],
  theme: {
    extend: {},
    fontFamily: {
      roboto: ["Roboto"], // font-roboto
    },
  },
  plugins: [],
};
