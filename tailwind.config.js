const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  // mode: "jit", // this will enable Tailwind JIT compiler to make the build faster
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      xs: { min: "320px", max: "479px" },
      ...defaultTheme.screens
    }
  }, // This is where we will define our custom Tailwind CSS
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/aspect-ratio")]
};
