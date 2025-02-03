// tailwind.config.js
module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'robin-egg-blue': '#50C9CE',
        'black-olive': '#2E382E',
        'platinum': '#E2F3F4',
        'photo-blue': '#6DC7D1',
        'photo-blue-hover': '#5EAAB2',
        
      },
      backgroundColor: {
        'robin-egg-blue': '#50C9CE',
        'black-olive': '#2E382E',
        'robin-egg-blue-hover': '#45AEB2',
        'platinum': '#E2F3F4',
        'photo-blue': '#6DC7D1',
        'photo-blue-hover': '#5EAAB2',
      },
    },
  },
  variants: {},
  plugins: [],
}