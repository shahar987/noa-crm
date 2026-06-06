import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
        display: ['Heebo', 'system-ui', 'sans-serif'],
      },
      colors: {
        blush: {
          50:  '#fdf6f9',
          100: '#fbedf3',
          200: '#f7dbe7',
          300: '#f0c0d4',
          400: '#e69cba',
          500: '#d97a9f',
          600: '#c25c84',
        },
        rosegold: {
          300: '#e9c9bf',
          400: '#d8a799',
          500: '#bd8175',
          600: '#a36a60',
        },
        gold: {
          400: '#d8bb83',
          500: '#c4a063',
          600: '#a8853f',
        },
        berry: {
          700: '#5c2e44',
          800: '#46213a',
          900: '#33182b',
        },
      },
      boxShadow: {
        royal:    '0 10px 40px -12px rgba(157,74,110,0.25)',
        'royal-sm': '0 6px 20px -8px rgba(157,74,110,0.22)',
        'royal-lg': '0 24px 60px -18px rgba(157,74,110,0.32)',
      },
      borderRadius: {
        '2xl': '1.1rem',
        '3xl': '1.6rem',
      },
    },
  },
  plugins: [],
};

export default config;
