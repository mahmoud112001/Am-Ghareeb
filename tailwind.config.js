/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        transit: {
          50: '#ecfdf7',
          100: '#d1fae6',
          200: '#a7f3cf',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#0f766e',
          700: '#115e59',
          800: '#134e4a',
          900: '#0f172a'
        },
        amberTransit: {
          50: '#fff8e1',
          100: '#ffedb5',
          200: '#ffe08a',
          300: '#ffd15c',
          400: '#ffbe2e',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        }
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
        display: ['Amiri', 'Georgia', 'serif']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(245, 158, 11, 0.15), 0 12px 40px rgba(15, 23, 42, 0.35)'
      },
      backgroundImage: {
        'mesh-dark': 'radial-gradient(circle at top left, rgba(20, 184, 166, 0.16), transparent 28%), radial-gradient(circle at top right, rgba(245, 158, 11, 0.14), transparent 22%), linear-gradient(180deg, rgba(2, 6, 23, 0.98), rgba(15, 23, 42, 0.98))'
      }
    }
  },
  plugins: []
};
