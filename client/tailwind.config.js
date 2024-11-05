/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "black-color-override": "var(--black-color)",
        "white-color-override": "var(--white-color)",
      },
    },
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
    container: {
      center: true,
      screens: {
        sm: "570px",
        md: "720px",
        lg: "960px",
        xl: "1140px",
      },
    },
  },
  plugins: [],
};
