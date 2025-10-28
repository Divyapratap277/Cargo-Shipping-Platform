/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    '@tailwindcss/postcss', // Use the specific package name here
    'autoprefixer',
  ],
};

export default config;