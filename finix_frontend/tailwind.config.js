// --- archivo: tailwind.config.js ---

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // <-- ESTA LÍNEA ES LA CLAVE
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};