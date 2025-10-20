// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';


// Importamos nuestros componentes
import Navbar from './components/Navbar.jsx';
// (Aquí importaremos el Footer cuando lo creemos)


import ProductosPage from './pages/ProductosPage.jsx';
import CuadrosPage from './pages/CuadrosPage.jsx';
import PolerasPage from './pages/PolerasPage.jsx';
import PoleronesPage from './pages/PoleronesPage.jsx';
import SesionPage from './pages/SesionPage.jsx';
import HomePage from './pages/HomePage.jsx'
import Footer from './components/Footer.jsx';
import AdminPage from "./pages/AdminPage.jsx"; 
import RegistroPage from './pages/RegistroPage.jsx';
import SingleProductPage from './pages/SingleProductPage.jsx';

function App() {
  return (
    <>
      <Navbar /> 

      <main>
        {/* Aquí es donde React cambiará el contenido de la página */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/poleras" element={<PolerasPage />} />
          <Route path="/polerones" element={<PoleronesPage />} />
          <Route path="/cuadros" element={<CuadrosPage />} />
          <Route path="/sesion" element={<SesionPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/producto/:id" element={<SingleProductPage />} />
          {/* Más adelante agregaremos las otras rutas aquí */}
        </Routes>
      </main>
    <Footer />
      
    </>
  );
}

export default App;