    import type { Config } from 'tailwindcss';

    const config: Config = {
      content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Correct path for Pages Router
        './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Keep this if you plan to add a components folder
      ],
      theme: {
        extend: {
          // You can keep existing theme extensions or add new ones
          backgroundImage: {
           'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
           'gradient-conic':
             'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          },
        },
      },
      plugins: [],
    };
    export default config;
    
