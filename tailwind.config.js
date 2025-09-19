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
        'regal-dark': '#283046',
        'regal-deep-dark': '#1E2638'
      }
    }
  },
  plugins: []
}
