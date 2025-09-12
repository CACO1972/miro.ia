/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}","./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#020617",
        neon: "#00f0ff",
        whiteMate: "#f8fafc",
      },
      fontFamily: {
        monda: ["Monda", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      dropShadow: {
        neon: "0 0 20px #00f0ff",
      }
    },
  },
  plugins: [],
};
