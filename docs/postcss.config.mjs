import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {
      config: path.resolve(__dirname, './tailwind.config.ts'),
    },
    autoprefixer: {},
  },
};

export default config;
