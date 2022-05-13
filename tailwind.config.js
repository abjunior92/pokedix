const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  // mode: "jit", // this will enable Tailwind JIT compiler to make the build faster
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      xs: { min: "320px", max: "479px" },
      ...defaultTheme.screens
    },
    extend: {
      colors: {
        primary: "#7f5af0",
        secondary: "#72757e",
        tertiary: "#2cb67d",
        gitGreyNeutral: "#2d333b",
        gitGreyDark: "#22272e"
      }
    }
  }, // This is where we will define our custom Tailwind CSS
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/aspect-ratio")]
};
