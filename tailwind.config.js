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
        // Light mode colors (warm cream/brown)
        cream: {
          50: '#fefdfb',
          100: '#f9f6f0',
          200: '#f0ebe0',
          300: '#e5dccb',
          400: '#d4c4a8',
          500: '#c9b896',
          600: '#b5a07a',
          700: '#8B7355',
          800: '#5C4A2A',
          900: '#3D3124',
        },
        // Aurora colors for dark mode
        aurora: {
          cyan: '#22d3ee',
          emerald: '#34d399',
          purple: '#a855f7',
          pink: '#ec4899',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(34, 211, 238, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
