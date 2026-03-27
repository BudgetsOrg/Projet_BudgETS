import type { Config } from "tailwindcss";

const config: Config & { corePlugins?: any } = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#125b48",
        secondary: "#96c16e",
        delete: "#e93939",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // désactive le reset global
  },
};

export default config;