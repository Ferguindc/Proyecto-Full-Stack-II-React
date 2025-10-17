// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Importaciones de estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- 2. ENVUELVE TU APP */}
      <App />
    </BrowserRouter> {/* <-- 3. CIERRA EL ENVOLTORIO */}
  </React.StrictMode>,
)