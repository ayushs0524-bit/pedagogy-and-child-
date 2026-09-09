/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgpage: "#EDEAE0",
        slate: "#24413B",
        slatelight: "#345F55",
        marigold: "#E8A33D",
        marigolddark: "#B97A22",
        paper: "#FBF8F2",
        ink: "#1E2523",
        inksoft: "#5B6B66",
        line: "#DCD6C6",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};
