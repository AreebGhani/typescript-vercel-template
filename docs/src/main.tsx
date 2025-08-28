import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css';

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log(
    '%cDEV_MODE%c => development server started!',
    'color: red; font-size: 12px;',
    'color: orange; font-size: 10px;'
  );
}

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(<App />);
}
