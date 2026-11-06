/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        stone: '#12110e',
        ivory: '#F3EFE6',
        gold: '#C6A15B',
        bronze: '#3A342A'
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif']
      }
    }
  },
  plugins: []
}
