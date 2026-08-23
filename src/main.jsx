import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ReactGA from 'react-ga4';

// Initialisation Google Analytics 4 différée :
// on ne bloque pas le premier rendu du site.
const initGA = () => ReactGA.initialize('G-F2SES7CPB3');
if (document.readyState === 'complete') {
  initGA();
} else {
  window.addEventListener('load', initGA, { once: true });
}

// Point d'entrée unique de l'application React
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
