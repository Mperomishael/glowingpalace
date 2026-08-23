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
        serif: ['Crimson Text', 'serif'],
        instrument: ['"Instrument Serif"', 'serif'],
      },
      colors: {
        gpcm: {
          cream: '#F6E4CF',
          dark: '#321C04',
          light: '#FFF9F2',
          muted: '#D9C4AA',
          mutedHover: '#CEBA9E',
          darkHover: '#1F1003',
          violet: '#7c3aed',
          amber: '#d97706',
        },
        // Admin-only palette — purple / gold / milk (does NOT touch the
        // public-site "gpcm.*" brown/cream palette above).
        admin: {
          purple: '#2E0A5C',      // deep royal purple — primary admin bg
          purpleMid: '#4C1D95',   // panels / cards on dark bg
          purpleLight: '#7C3AED', // accents, focus rings
          purpleHover: '#1F0740', // hovers on deep bg
          gold: '#D4AF37',        // primary accent / CTA
          goldSoft: '#E8C766',
          goldHover: '#B8952C',
          milk: '#FFFDF7',        // near-white "milk" background
          milkSoft: '#F6F1E7',
          milkMuted: '#E7DEF4',   // muted lavender-milk for secondary text on dark
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.2s ease-out forwards',
        'glass-in': 'glass-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'glass-out': 'glass-out 0.25s cubic-bezier(0.7,0,0.84,0) forwards',
        'nav-slide-in': 'nav-slide-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'nav-slide-out': 'nav-slide-out 0.4s cubic-bezier(0.7,0,0.84,0) forwards',
      },
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glass-in': {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(14px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'glass-out': {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.94) translateY(10px)' },
        },
        'nav-slide-in': {
          '0%': { transform: 'translateY(-110%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'nav-slide-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-110%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
