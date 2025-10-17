// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';


// Importamos nuestros componentes
import Navbar from './components/Navbar.jsx';
// (Aquí importaremos el Footer cuando lo creemos)


import ProductosPage from './pages/ProductosPage.jsx';
import CuadrosPage from './pages/CuadrosPage.jsx';
import SesionPage from './pages/SesionPage.jsx';
import HomePage from './pages/HomePage.jsx'
import Footer from './components/Footer.jsx';


function App() {
  return (
    <>
      <Navbar /> 

      <main>
        {/* Aquí es donde React cambiará el contenido de la página */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/cuadros" element={<CuadrosPage />} />
          <Route path="/sesion" element={<SesionPage />} />

          {/* Más adelante agregaremos las otras rutas aquí */}
        </Routes>
      </main>
    <Footer />
      
    </>
  );
}

export default App;