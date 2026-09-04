/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lioc: {
          dark: "#081b33",
          navy: "#0B2545",
          navyLight: "#133E70",
          teal: "#0D9488",
          tealLight: "#14B8A6",
          tealDark: "#0F766E",
          cyan: "#0284C7",
          cyanLight: "#38BDF8",
          gold: "#D97706",
          goldLight: "#F59E0B",
          slateBg: "#F8FAFC",
          cardBg: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(11, 37, 69, 0.08)",
        card: "0 10px 30px -4px rgba(11, 37, 69, 0.1)",
        glow: "0 0 25px rgba(13, 148, 136, 0.25)",
      },
    },
  },
  plugins: [],
};
