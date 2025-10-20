// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import SesionPage from "./pages/SesionPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';


// --- ¡¡LA PARTE MÁS IMPORTANTE!! ---
// Si estas líneas faltan o están mal escritas, NADA se verá bien.
// Esta línea carga la grilla (row, col, etc.)

import 'bootstrap/dist/css/bootstrap.min.css';
// Esta carga los iconos
import 'bootstrap-icons/font/bootstrap-icons.css';

// Esta carga el JavaScript (para el carrusel, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


// --- Tu CSS global (el style.css original) ---
import './globals.css';
import './utils.css'; // Nuevas utilidades CSS
import './performance.css'; // Optimizaciones de performance
import './unified-styles.css'; // Estilos unificados para botones y campos

import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)