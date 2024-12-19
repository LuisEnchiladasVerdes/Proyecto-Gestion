/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ultra: ['Ultra', 'serif'], // Agrega la fuente Ultra
        roboto: ['"Roboto Slab"', 'serif'], // Registra la fuente
      },
    },
  },
  plugins: [],
}

