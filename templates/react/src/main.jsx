import React from 'react';
import { createRoot } from 'react-dom/client';
import SocialWidget from './SocialWidget.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocialWidget />
  </React.StrictMode>,
);
