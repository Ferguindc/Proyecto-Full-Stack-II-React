// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';


// Importamos nuestros componentes
import Navbar from './components/navbar.jsx';
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
import ClientePage from './pages/ClientePage.jsx';
import CarritoPage from './pages/CarritoPage.jsx';
import CartSidebar from './components/CartSidebar.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import CreateBlogPostPage from './pages/CreateBlogPostPage.jsx';
import FormularioAddPage from './pages/FormularioAddPage.jsx';
import FormularioEditarPage from './pages/FormularioEditarPage.jsx';
import PanelEmpleadoPage from './pages/PanelEmpleadoPage.jsx';
import GestionEmpleadosPage from './pages/GestionEmpleadosPage.jsx';
import FormularioAddProductoPage from './pages/FormularioAddProductoPage.jsx';
import FormularioEditarProductoPage from './pages/FormularioEditarProductoPage.jsx';

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
          <Route path="/cliente" element={<ClientePage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/crear" element={<CreateBlogPostPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/producto/:id" element={<SingleProductPage />} />
          <Route path="/cliente/editar" element={<FormularioEditarPage />} />
          <Route path="/cliente/envio" element={<FormularioAddPage tipo="Envío" />} />
          <Route path="/cliente/facturacion" element={<FormularioAddPage tipo="Facturación" />} />
          <Route path="/panel-empleado" element={<PanelEmpleadoPage />} />
          <Route path="/gestion-empleados" element={<GestionEmpleadosPage />} />
          <Route path="/formulario-add" element={<FormularioAddProductoPage />} />
          <Route path="/formulario-editar/:id" element={<FormularioEditarProductoPage />} />
          {/* Más adelante agregaremos las otras rutas aquí */}
        </Routes>
      </main>
      
      {/* Carrito lateral */}
      <CartSidebar />
      
      <Footer />
    </>
  );
}

export default App;