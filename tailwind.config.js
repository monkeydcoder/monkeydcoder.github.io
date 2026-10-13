/** @type {import('tailwindcss').Config} */
module.exports = {
  // hover: styles apply only on devices with a real pointer (no sticky hover after a tap on phones)
  future: { hoverOnlyWhenSupported: true },
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        ink: {
          950: '#07080b',
          900: '#0b0d12',
          850: '#101319',
          800: '#151922',
          700: '#1e232e',
          600: '#2a303d',
        },
        paper: '#ece9e3',
        muted: '#a4a7af',
        faint: '#71757f',
        accent: {
          DEFAULT: '#ff6a4d',
          soft: '#ff8a72',
        },
        gold: '#f2b84b',
        jade: '#5fbf8f',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
