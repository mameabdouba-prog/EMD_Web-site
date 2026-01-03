import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // <-- modifié pour index.css
import ReactGA from 'react-ga4';
import { BrowserRouter } from 'react-router-dom';

// Point d'entrée de l'application React
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


ReactGA.initialize('G-F2SES7CPB3'); // 👈 TON ID GA4

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/EMD_Web-site">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
