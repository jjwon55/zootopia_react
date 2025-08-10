import daisyui from 'daisyui';
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [daisyui],
  theme: {
    extend: {
      backgroundImage: {
        'funeral-bg': "url('src/assets/img/background/funeral_background1.jpg')",
      },
    },
  },
  corePlugins: {
    preflight: true, // 강제로 다시 활성화
  },
}