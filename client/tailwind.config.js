/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", 'serif'],
        lexend: ["Lexend Giga", 'serif'],
        source_code_pro: ["Source Code Pro", 'serif']
      }
    },
  },
  plugins: [],
}