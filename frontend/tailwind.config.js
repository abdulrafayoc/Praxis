/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0A0F1E',
        surface: '#111827',
        'surface-elevated': '#1E2433',
        primary: '#06B6D4',
        'primary-dark': '#0891B2',
        accent: '#7C3AED',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        border: '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-16px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(6,182,212,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(6,182,212,0)' } },
        countUp: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
