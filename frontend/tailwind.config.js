/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-yellow": "#FFBB20",
        "background-green": "#DEE2D9",
        "main-green": "#8DA290",
        "sub-yellow": '#BE912B',
        "complement": '#A28D9F'
      },
    },
  },
  plugins: [],
};
