/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C0392B",
        bg1: "#F9F9F9",
        secondary: "#C70909",
        three: "#2D75DE",
        font1: "#0E1422",
        font2: "#5C5F6A",
        font3: "#878A92",
        borderPrimary: "#E6E7E8",
        bgHero: "#F6F6F6",
      },
    },
  },
  plugins: [],
};
