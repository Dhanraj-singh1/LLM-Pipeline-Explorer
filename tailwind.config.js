/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        stark: {
          dark: '#08090d',
          darker: '#040507',
          card: '#0e111a',
          cardHover: '#141824',
          border: 'rgba(234, 179, 8, 0.2)',
          borderRed: 'rgba(239, 68, 68, 0.3)',
          borderCyan: 'rgba(0, 245, 255, 0.3)',
          gold: '#ffd700',
          goldDim: '#d97706',
          red: '#ef4444',
          crimson: '#991b1b',
          arc: '#00f5ff',
          arcDim: '#0284c7',
        },
        armor: {
          950: '#06070a',
          900: '#0c0e14',
          850: '#12151e',
          800: '#181c28',
          700: '#232839',
          600: '#343b52',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'arc': '0 0 20px rgba(0, 245, 255, 0.4), 0 0 40px rgba(0, 245, 255, 0.2)',
        'arc-sm': '0 0 10px rgba(0, 245, 255, 0.3)',
        'stark-gold': '0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(217, 119, 6, 0.2)',
        'stark-red': '0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(153, 27, 27, 0.2)',
        'hud-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255, 215, 0, 0.15)',
      },
      animation: {
        'pulse-arc': 'pulseArc 2.5s infinite ease-in-out',
        'scanline': 'scanline 8s linear infinite',
        'hud-spin': 'hudSpin 20s linear infinite',
        'hud-spin-reverse': 'hudSpinRev 15s linear infinite',
      },
      keyframes: {
        pulseArc: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.05)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        hudSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        hudSpinRev: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        }
      }
    },
  },
  plugins: [],
};
