// tailwind.config.ts
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}", // <- must include your shadcn/ui component locations
  ],
  theme: {
    extend: {
      transitionDuration: {
        '300': '300ms',
      }
    },
  },
  darkMode: "class", // or "media" if that's what you use
  plugins: [],
};
