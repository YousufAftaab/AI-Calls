import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18073',
          700: '#846458',
          800: '#674d43',
          900: '#4e3a32',
          950: '#2b1e19',
        },
        roseGold: {
          50: '#fbf7f6',
          100: '#f6ecea',
          200: '#eedad6',
          300: '#e1bfb8',
          400: '#cf9c92',
          500: '#b87364',
          600: '#a05849',
          700: '#844539',
          800: '#6e3a31',
          900: '#5c332b',
        },
        accent: {
          gold: '#d4af37',
          bronze: '#cd7f32',
          rose: '#e07a5f',
          emerald: '#10b981',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 2s linear infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
