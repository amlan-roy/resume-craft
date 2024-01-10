import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "brand-primary-green-1": "var(--brand-primary-green-1)",
        "brand-primary-green-2": "var(--brand-primary-green-2)",
        "brand-primary-green-3": "var(--brand-primary-green-3)",
        "brand-primary-green-4": "var(--brand-primary-green-4)",
        "brand-primary-green-5": "var(--brand-primary-green-5)",
        "brand-primary-brown-1": "var(--brand-primary-brown-1)",
        "brand-primary-brown-2": "var(--brand-primary-brown-2)",
        "brand-primary-brown-3": "var(--brand-primary-brown-3)",
        "brand-primary-brown-4": "var(--brand-primary-brown-4)",
        "brand-primary-brown-5": "var(--brand-primary-brown-5)",
        "brand-secondary-green-1": "var(--brand-secondary-green-1)",
        "brand-secondary-green-2": "var(--brand-secondary-green-2)",
        "brand-secondary-green-3": "var(--brand-secondary-green-3)",
        "brand-secondary-green-4": "var(--brand-secondary-green-4)",
        "brand-secondary-green-5": "var(--brand-secondary-green-5)",
        "brand-secondary-blue-1": "var(--brand-secondary-blue-1)",
        "brand-secondary-blue-2": "var(--brand-secondary-blue-2)",
        "brand-secondary-blue-3": "var(--brand-secondary-blue-3)",
        "brand-secondary-blue-4": "var(--brand-secondary-blue-4)",
        "brand-secondary-blue-5": "var(--brand-secondary-blue-5)",
        "brand-secondary-cyan-1": "var(--brand-secondary-cyan-1)",
        "brand-secondary-cyan-2": "var(--brand-secondary-cyan-2)",
        "brand-secondary-cyan-3": "var(--brand-secondary-cyan-3)",
        "brand-secondary-cyan-4": "var(--brand-secondary-cyan-4)",
        "brand-secondary-cyan-5": "var(--brand-secondary-cyan-5)",
        "brand-neutral-1": "var(--brand-neutral-1)",
        "brand-neutral-2": "var(--brand-neutral-2)",
        "brand-neutral-3": "var(--brand-neutral-3)",
        "brand-neutral-4": "var(--brand-neutral-4)",
        "brand-neutral-5": "var(--brand-neutral-5)",
        "brand-neutral-6": "var(--brand-neutral-6)",
        "brand-neutral-7": "var(--brand-neutral-7)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
