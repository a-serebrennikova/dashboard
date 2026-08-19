module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "brand-bg": "#0f172a",
        "brand-text": "#f1f5f9",
        muted: "#94a3b8",
        "accent-blue": "#3b82f6",
        "accent-green": "#22c55e",
        "border-default": "#334155",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        body: {
          backgroundColor: theme("colors.brand-bg"),
          color: theme("colors.brand-text"),
          fontFamily: (function () {
            const ff = theme("fontFamily.sans");
            return Array.isArray(ff)
              ? ff.join(", ")
              : ff || "system-ui, -apple-system, sans-serif";
          })(),
          minHeight: "100vh",
        },
      });
    },
  ],
};
