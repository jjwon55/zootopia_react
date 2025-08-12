import daisyui from 'daisyui';

// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        bounceTwice: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-15px)' },
          '60%': { transform: 'translateY(-7px)' },
        }
      },
      animation: {
        'bounce-twice': 'bounceTwice 1s ease-in-out infinite',
      }
    },
  },
  plugins: [daisyui],
  corePlugins: {
    preflight: true, // 강제로 다시 활성화
  },
}