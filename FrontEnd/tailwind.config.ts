/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0080C8',
        secondary: '#D4AF37',
      },
      backgroundColor: {
        'primary': '#0080C8',
        'light': '#F8FAFC',
      },
      textColor: {
        'primary': '#0080C8',
      },
    },
  },
  plugins: [],
} as const;
