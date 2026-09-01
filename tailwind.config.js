/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#000000', // Pitch black for trap aesthetic
          800: '#0a0a0a',
          700: '#141414',
        },
        accent: {
          DEFAULT: '#ff0000', // Aggressive pure red
          dark: '#b30000',
          light: '#ff4d4d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'strobe': 'strobe 3s infinite',
        'strobe-fast': 'strobe-fast 0.5s infinite',
        'marquee': 'marquee 15s linear infinite',
      },
      keyframes: {
        strobe: {
          '0%, 48%, 52%, 100%': { opacity: '1' },
          '49%, 51%': { opacity: '0.1' },
          '50%': { opacity: '0.8' },
        },
        'strobe-fast': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
