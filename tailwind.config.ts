import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Lato", "Lato-regular", ...defaultTheme.fontFamily.sans],
      light: ["LatoThin", "Lato-Thin-Italic"],
      bold: ["LatoBold", "Lato-Bold-Italic"],
      black: ["LatoBlack", "Lato-Black-Italic"]
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
