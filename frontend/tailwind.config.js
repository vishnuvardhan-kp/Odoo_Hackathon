/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Travel theme colors
        'travel-primary': '#0ea5e9',
        'travel-secondary': '#06b6d4',
        'travel-accent': '#10b981',
        'travel-warm': '#f59e0b',
        'travel-bg': '#f8fafc',
        'travel-card': '#ffffff',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'card': '16px',
        'input': '12px',
        'button': '12px',
      },
      backgroundImage: {
        'travel-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      }
    },
  },
  plugins: [],
}
