// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: { },
  },
  plugins: [],
  corePlugins: {
    preflight: true, // 강제로 다시 활성화
  },
}

