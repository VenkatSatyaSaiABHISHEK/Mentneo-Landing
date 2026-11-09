import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary, #000000)",
        foreground: "var(--text-primary, #F2F2F0)",
        paper: {
          DEFAULT: "#F5F4F0",
          card: "#FFFFFF",
          border: "#E9E7E1",
          subtle: "#ECEAE4",
        },
        ink: {
          DEFAULT: "#0B0C0E",
          secondary: "#4A4E57",
          muted: "#737883",
        },
        mentneo: {
          pure: "#000000",
          ink: "#07080A",
          graphite: "#0E1013",
          slate: "#12151A",
          warm: "#0D0B0A",
          paper: "#F5F4F0",
          surface: "rgba(255, 255, 255, 0.025)",
          border: "rgba(255, 255, 255, 0.08)",
          "border-subtle": "rgba(255, 255, 255, 0.04)",
          "border-bright": "rgba(255, 255, 255, 0.18)",
          text: {
            primary: "#F2F2F0",
            secondary: "#8A8F98",
            tertiary: "#525866",
            muted: "#363A45",
          },
          accent: {
            signature: "#2F5BFF", // Deep Electric Blue
            ice: "#7DA4D8",
            amber: "#E8A23B", // Soft tungsten amber for Neuro HGI Chip
            sage: "#7EB8A2",
            cobalt: "#7899E8",
            ochre: "#C49F6E",
            platinum: "#E2E8F0",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        tight: "-0.02em",
        wideMono: "0.08em",
        wideBranded: "0.15em",
      },
      boxShadow: {
        hairline: "0 0 0 1px rgba(255, 255, 255, 0.08)",
        "hairline-bright": "0 0 0 1px rgba(255, 255, 255, 0.18)",
        "hairline-paper": "0 0 0 1px #E9E7E1",
        "glass-card": "0 20px 40px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
        "paper-card": "0 10px 30px -5px rgba(11, 12, 14, 0.05), 0 1px 3px rgba(11, 12, 14, 0.02), inset 0 1px 0 #FFFFFF",
        "paper-card-hover": "0 20px 45px -10px rgba(11, 12, 14, 0.08), 0 4px 12px rgba(11, 12, 14, 0.03), inset 0 1px 0 #FFFFFF",
        "specular-blue": "0 0 50px -10px rgba(47, 91, 255, 0.25)",
        "specular-amber": "0 0 50px -10px rgba(232, 162, 59, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
