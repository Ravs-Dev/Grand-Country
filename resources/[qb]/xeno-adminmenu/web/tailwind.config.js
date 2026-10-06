export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "oklch(var(--border) / <alpha-value>)",
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        ui: {
          bg: "#0f0f11",
          panel: "rgba(25,25,30,0.6)",
          layer: "#18181b",
          border: "#27272a",
          textMuted: "#a1a1aa",
          orange: "#FF7300",
          orangeBright: "#FF9100",
          success: "#10B981",
          info: "#06B6D4",
          danger: "#EF4444",
          violet: "#8B5CF6",
          blue: "#3B82F6",
          amber: "#F59E0B",
          pink: "#EC4899",
          yellow: "#EAB308",
        },
      },
      boxShadow: {
        "ui-soft": "0 8px 30px rgba(0,0,0,0.4)",
        "ui-glow": "0 0 18px rgba(255,115,0,0.45)",
      },
      borderRadius: {
        "panel-xl": "24px",
      },
      backdropBlur: {
        panel: "12px",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".45" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
