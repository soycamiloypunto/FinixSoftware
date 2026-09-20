// --- archivo: tailwind.config.js ---

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}", // <-- ESTA LÍNEA ES LA CLAVE
  ],
  theme: {
    extend: {
      colors: {
        'finix-dark': 'var(--finix-dark)',
        'finix-light': 'var(--finix-light)',
        'finix-yellow': 'var(--finix-yellow)',
        'finix-orange': 'var(--finix-orange)',
        'finix-red': 'var(--finix-red)',
      }
    },
  },
  plugins: [],
};
