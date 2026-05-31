/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Preflight off: the app is hand-styled in src/styles/theme.css (mirrors
  // aiSafePlate). Tailwind's reset would otherwise fight the design system.
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
}
