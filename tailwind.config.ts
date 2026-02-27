import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // App semantic tokens (powered by CSS variables)
        background: "rgb(var(--bg) / <alpha-value>)",
        foreground: "rgb(var(--text) / <alpha-value>)",

        panel: "rgb(var(--panel) / <alpha-value>)",
        "panel-solid": "rgb(var(--panelSolid) / <alpha-value>)",

        border: "rgb(var(--border) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",

        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-hover": "rgb(var(--primaryHover) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",

        // Optional semantic statuses
        danger: "rgb(var(--danger) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
      },
      boxShadow: {
        soft: "0 18px 50px rgb(var(--shadow) / 1)",
        strong: "0 24px 70px rgb(var(--shadowStrong) / 1)",
      },
      borderRadius: {
        xl2: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
