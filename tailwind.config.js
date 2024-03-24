module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx.tsx}'],

  theme: {
    extend: {
      transitionProperty: {
        width: 'width',
        spacing: 'margin, padding'
      },
      colors: {
        'regal-dark': '#283046'
      }
    }
  },
  plugins: []
}
