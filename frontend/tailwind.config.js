/** @type {import('tailwindcss').Config} */
const coffee = {
  bean: '#120d0a',
  espresso: '#241a15',
  mocha: '#3d2e26',
  roast: '#6e5a4c',
  steam: '#9d8b7c',
  latte: '#d4c4b4',
  foam: '#ebe1d4',
  paper: '#faf6f0',
  cup: '#f5ede3',
  crema: '#b87333',
  copper: '#c9884d',
  caramel: '#7a4a24',
  sage: '#4a5c3f',
};

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        coffee,
        // Semantic aliases used across the app
        ink: coffee.bean,
        cream: coffee.foam,
        clay: coffee.copper,
        moss: coffee.sage,
      },
      boxShadow: {
        cup: '0 4px 20px -4px rgba(36, 26, 21, 0.12), 0 2px 8px -2px rgba(36, 26, 21, 0.08)',
        'cup-lg': '0 12px 40px -8px rgba(36, 26, 21, 0.15), 0 4px 16px -4px rgba(184, 115, 51, 0.08)',
      },
    },
  },
  plugins: [],
};
