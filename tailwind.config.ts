import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        heading: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde6ff',
          200: '#c3d1ff',
          300: '#9db3ff',
          400: '#7a8fff',
          500: '#5c6bff',
          600: '#4049f5',
          700: '#3438dc',
          800: '#2c2fb2',
          900: '#2a2e8d',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8f9fc',
          subtle: '#f1f3f9',
          border: '#e4e7ef',
        },
        ink: {
          DEFAULT: '#0d0f1a',
          secondary: '#4b5068',
          muted: '#8b90a7',
        },
      },
    },
  },
  plugins: [],
};

export default config;
