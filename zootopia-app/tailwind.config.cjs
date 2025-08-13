import daisyui from 'daisyui';

// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        likePop: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.3)' },
          '60%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        burst: {
          '0%': { opacity: '1', transform: 'scale(0.5)' },
          '100%': { opacity: '0', transform: 'scale(2)' },
        },
      },
      animation: {
        likePop: 'likePop 0.4s ease-out',
        burst: 'burst 0.5s ease-out',
      }
    },
  },
  plugins: [daisyui],
  corePlugins: {
    preflight: true, // 강제로 다시 활성화
  },
}

