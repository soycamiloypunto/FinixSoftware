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
        'finix-dark': '#3D348B',
        'finix-light': '#7678ED',
        'finix-yellow': '#F7B801',
        'finix-orange': '#F18701',
        'finix-red': '#F35B04',
      }
    },
  },
  plugins: [],
};