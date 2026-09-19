/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        // ── 2026 design tokens ──────────────────────────────────────────
        'bg-base':     '#FAF3E8',
        surface: {
          DEFAULT: '#F2E6D4',
          card:    '#F2E6D4',
        },
        'border-card': '#E0CDB4',
        ink: {
          DEFAULT: '#4A3426',
          muted:   '#8A7560',
        },
        accent:  '#E89B6F',
        success: '#9CAF88',
        // ── Legacy tokens (kept for backward compat) ────────────────────
        cream: {
          50:  '#FFFDF8',
          100: '#F6E5CC',
          200: '#EDD9B8',
          300: '#E0C9A5',
          400: '#D4BFA3',
          bg:  '#F6E5CC',
        },
        cocoa: {
          50:  '#8C7461',
          100: '#6B5647',
          200: '#4A3A2E',
          300: '#24130D',
          text: '#24130D',
        },
        peach: {
          100: '#F0A275',
          200: '#E8956A',
          300: '#D98255',
          accent: '#F0A275',
        },
        olive: {
          50:  '#B8C5A8',
          100: '#A8B89A',
          200: '#8FA67D',
          300: '#7A9268',
          accent: '#A8B89A',
        },
        danger:  '#E88B8B',
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Nunito', 'DM Sans', 'system-ui', 'sans-serif'],
        body:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        dream: '0 24px 64px -24px rgba(0, 0, 0, 0.65)',
        card:  '0 18px 48px -30px rgba(0, 0, 0, 0.7)',
        soft:  '0 2px 8px rgba(74, 52, 38, 0.12)',
      },
      backgroundImage: {
        'cream-gradient': 'linear-gradient(180deg, #FAF3E8 0%, #F0E4CC 50%, #E8D8BA 100%)',
        'cream-glow':     'radial-gradient(ellipse at 50% 0%, rgba(232, 155, 111, 0.12) 0%, rgba(232, 155, 111, 0.04) 35%, transparent 72%)',
      },
    },
  },
  plugins: [],
};
