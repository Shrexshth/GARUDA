/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          dark: '#103625',
          forest: '#081C13',
          tint: '#EBF5F0',
          soft: '#F5FAF7',
          accent: '#287A5B',
          border: '#D7EBE1',
          text: '#081C13',
        },
        forest: {
          50: '#F5FAF7',
          100: '#EBF5F0',
          200: '#D7EBE1',
          300: '#BDE0CF',
          400: '#93CBAF',
          500: '#62B18E',
          600: '#399572',
          700: '#287A5B',
          800: '#1F6148',
          900: '#103625',
          950: '#081C13',
        },
        mint: {
          25: '#FCFDFD',
          50: '#F5FAF7',
          100: '#EBF5F0',
          200: '#D7EBE1',
          300: '#BDE0CF',
          400: '#93CBAF',
          500: '#399572',
          badge: '#EBF5F0',
        },
        zerohash: {
          dark: '#081C13',
          cardDark: '#05120D',
          codeBg: '#030A07',
          accent: '#399572',
          bright: '#62B18E',
          border: '#D7EBE1',
          borderSubtle: '#EBF5F0',
          borderDark: '#1F6148',
          glow: 'rgba(57, 149, 114, 0.15)',
        },
        status: {
          amber: '#D97706', // WCAG AA compliant on white
          red: '#DC2626',   // WCAG AA compliant on white
          green: '#287A5B',
          blue: '#2563EB',
          verified: '#287A5B',
          review: '#D97706',
          error: '#DC2626',
        },
        refinery: {
          surface: '#FFFFFF',
          canvas: '#F5FAF7', // Lightest mint
          heading: '#081C13', // Deepest forest
          text: '#174A37',    // Dark forest
          muted: '#287A5B',   // Mid-dark
        }
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'agent-hover': '0 12px 32px -4px rgba(18, 53, 39, 0.08)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}
