/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8accff',
          400: '#51b0ff',
          500: '#2890ff',
          600: '#1170f3',
          700: '#0c59df',
          800: '#1047b5',
          900: '#123d8f',
          950: '#0f2657',
        },
        secondary: {
          50: '#edfff9',
          100: '#d6fff1',
          200: '#b0ffe3',
          300: '#76ffd0',
          400: '#35f5b8',
          500: '#0be0a0',
          600: '#00b483',
          700: '#008c6b',
          800: '#066d57',
          900: '#075a49',
          950: '#00332b',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae6ff',
          200: '#f5ceff',
          300: '#eda5ff',
          400: '#e06bff',
          500: '#cc35f5',
          600: '#b318d7',
          700: '#9512b0',
          800: '#7c148f',
          900: '#671575',
          950: '#420454',
        },
        success: {
          50: '#ecfff4',
          500: '#15c55e',
          700: '#088042',
        },
        warning: {
          50: '#fff8eb',
          500: '#f5960b',
          700: '#b34509',
        },
        error: {
          50: '#fff2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
        code: {
          bg: '#1a1b26',
          text: '#a9b1d6',
          comment: '#565f89',
          string: '#9ece6a',
          keyword: '#bb9af7',
          function: '#7aa2f7',
          variable: '#e0af68',
        },
      },
      fontFamily: {
        mono: [
          'JetBrains Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
        sans: [
          'Inter var',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-left': 'slideLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right': 'slideRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-up': 'scaleUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-down': 'scaleDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-light': 'bounce 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleDown: {
          '0%': { transform: 'scale(1.05)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [],
};