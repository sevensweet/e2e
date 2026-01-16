/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#101216',
        mist: '#eef2f7',
        ember: '#ff6b4a',
        ocean: '#1d4ed8',
        jade: '#12a594',
      },
      boxShadow: {
        glow: '0 20px 45px -30px rgba(15, 23, 42, 0.5)',
      },
    },
  },
  plugins: [],
}
