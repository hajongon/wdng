/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: {
          background: '#efeae1', // Main background color
          text: '#000000', // Black text
          key: '#ff6347', // Example key color (Tomato red)
        },
      },
    },
  },
  plugins: [],
}
