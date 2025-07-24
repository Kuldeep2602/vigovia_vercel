/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./backend/src/templates/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        vigovia: {
          primary: '#541C9C',     // Main Purple from palette
          secondary: '#680099',   // Dark Purple from palette  
          accent: '#936FE0',      // Light Purple from palette
          dark: '#321E5D',        // Very Dark Purple from palette
          light: '#FBF4FF'        // Very Light Purple/White from palette
        },
        // Legacy support for existing code
        'vigovia-primary': '#541C9C',
        'vigovia-accent': '#936FE0',
        'vigovia-secondary': '#680099',
        'vigovia-dark': '#321E5D',
        'vigovia-light': '#FBF4FF',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      backgroundImage: {
        'vigovia-gradient': 'linear-gradient(135deg, #936FE0 0%, #541C9C 100%)',
        'vigovia-dark': 'linear-gradient(135deg, #541C9C 0%, #321E5D 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gentle': 'pulse 2s infinite',
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
      },
    },
  },
  plugins: [],
}

