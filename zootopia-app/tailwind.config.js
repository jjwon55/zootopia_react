/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
export default {
  prefix: 'tw-',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    prefix: 'tw-',
    themes: ["light", "dark"]
  },
}
