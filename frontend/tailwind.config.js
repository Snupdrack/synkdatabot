/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'synk-dark': '#0a0a0f',
        'synk-gray': '#1a1a2e',
        'synk-green': '#00ff88',
        'synk-cyan': '#00d4ff',
        'synk-purple': '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}