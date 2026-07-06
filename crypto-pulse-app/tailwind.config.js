/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        crypto: {
          bg: "#0f172a",
          surface: "#1e293b",
          card: "#334155",
          text: "#f8fafc",
          muted: "#94a3b8",
          border: "#475569",
        },
      },
      fontFamily: {
        mono: ["SpaceMono", "monospace"],
      },
      animation: {
        "ticker-scroll": "ticker-scroll 30s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "ticker-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
