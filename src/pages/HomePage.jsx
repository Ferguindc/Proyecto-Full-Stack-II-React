// src/pages/HomePage.jsx

import React, { useRef } from 'react';
import { Link } from 'react-router-dom'; // <-- IMPORTANTE: importamos Link

// IMPORTAMOS LAS IMÁGENES Y VIDEOS
import logo from '../assets/img/LOGODEF (2).png';
import carouselImg1 from '../assets/img/Sin título-1.png';
import carouselImg2 from '../assets/img/samurai_champloo__by_fisher903_dby4djr-pre.jpg';
import productoArana from '../assets/img/araña.png';
import productoOriginal from '../assets/img/ORIGINAL 2.png';
import productoCuadros from '../assets/img/d01dc658-1457-4c3a-86b1-d3c39c63af55.jpg';
import productoGorro from '../assets/img/gorro.avif';
import productoSatoru from '../assets/img/satoru 2.jpg';
import producto6 from '../assets/img/62419863-4d2a-429d-9c26-6e29411812f0.jpg';
import productoPoleron from '../assets/img/poleron.avif';
import bannerWeb from '../assets/img/photo-1706977470443-e71503f38c1d.avif';
import colImg1 from '../assets/img/neg1.avif';
import colImg2 from '../assets/img/rub1.avif';
import cat1 from '../assets/img/11.png';
import cat2 from '../assets/img/22.png';
import cat3 from '../assets/img/223.png';
import cat4 from '../assets/img/cuadroanime.png';
import bannerFinal from '../assets/img/BANNER_18_DE_SEPTIEBRE_2025.webp';
import videoGorra from '../assets/img/gorras.mp4';
import video2 from '../assets/img/video2.mp4';
import video3 from '../assets/img/video3.mp4';
import video4 from '../assets/img/video4.mp4';
import video5 from '../assets/img/Premium hoodie with low price, get extra discount now (1).mp4';
// import ruletaImg from '../assets/img/pngtree-roulette-lottery-wheel-of-fortune-illustration-with-vector-png-image_2992805.jpg';


function HomePage() {
  const productSliderRef = useRef(null);
  const categorySliderRef = useRef(null);
  const videoSliderRef = useRef(null);

  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300; 
      if (direction === 'left') {
        ref.current.scrollLeft -= scrollAmount;
      } else {
        ref.current.scrollLeft += scrollAmount;
      }
    }
  };


  return (
    <>
      {/* El Navbar ya no va aquí, va en App.jsx */}

      {/* ----- Carrusel Principal (Este funciona con Bootstrap) ----- */}
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="2000">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={carouselImg1} className="d-block w-100" alt="Banner 1" />
          </div>
          <div className="carousel-item">
            <img src={carouselImg2} className="d-block w-100" alt="Banner 2" />
          </div>
          {/* ... más items ... */}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
          <span className="carousel-control-prev-icon custom-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon custom-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* ===== Sección de Productos (Slider 1) ===== */}
      <section className="productos-destacados animate-fadeIn">
        <h2 className="titulo text-gradient">----------- Seccion de Productos -----------</h2>
        <div className="slider-container">
          <button className="btn prev" onClick={() => handleScroll(productSliderRef, 'left')}>❮</button>
          
          <div className="slider" ref={productSliderRef}>
            <div className="card hover-lift animate-fadeInLeft">
              {/* --- ENLACE CORREGIDO --- */}
              <Link to="/productos"> <img src={productoArana} alt="Producto 1" /></Link>
              <div className="card-info">
                <h3>DISEÑOS</h3>
                {/* --- ENLACE CORREGIDO --- */}
                <Link to="/productos"> <button className="btn-gradient">COMPRA AHORA</button></Link>
              </div>
            </div>
            <div className="card hover-lift animate-fadeInLeft delay-100">
              <img src={productoOriginal} alt="Producto 2" />
              <div className="card-info">
                <h3>2 POR $35</h3>
                <h3>POLERAS BÁSICAS</h3>
                {/* --- ENLACE CORREGIDO --- */}
                <Link to="/productos"> <button className="btn-gradient">COMPRA AHORA</button></Link>
              </div>
            </div>
            <div className="card hover-lift animate-fadeInLeft delay-200">
              <img src={productoCuadros} alt="Producto 3" />
              <div className="card-info">
                <h3>CUADROS ANIME</h3>
                {/* --- ENLACE CORREGIDO --- */}
                <Link to="/cuadros"><button className="btn-gradient">COMPRA AHORA</button></Link>
              </div>
            </div>
            <div className="card hover-lift animate-fadeInLeft delay-300">
              <img src={productoGorro} alt="Producto 4" />
              <div className="card-info">
                <h3>PRODUCTOS</h3>
                {/* --- ENLACE CORREGIDO --- */}
                <Link to="/productos"> <button className="btn-gradient">COMPRA AHORA</button></Link>
              </div>
            </div>
          </div>
          
          <button className="btn next" onClick={() => handleScroll(productSliderRef, 'right')}>❯</button>
        </div>
      </section>

      <div className="imagenweb img-fluid">
        <img src={bannerWeb} alt="Banner intermedio" />
      </div>

      {/* ----- Contenedor 2 columnas ----- */}
      <div className="contenedor">
        <div className="col">
          <img src={colImg1} alt="Imagen 1" className="imagengrande" />
          <div className="texto">
            <h3>NUEVA ERA 'CORAL'</h3>
            {/* --- ENLACE CORREGIDO --- */}
            <Link to="/productos"><button>COMPRA AHORA</button></Link>
          </div>
        </div>
        <div className="col">
          <img src={colImg2} alt="Imagen 2" />
          <div className="texto">
            <h3>LOITER 'VERANO'</h3>
            {/* --- ENLACE CORREGIDO --- */}
            <Link to="/productos"> <button>COMPRA AHORA</button></Link>
          </div>
        </div>
      </div>

      {/* ===== Sección Categorías (Slider 2) ===== */}
      <section className="productos-destacados animate-slideInUp">
        <h2 className="titulo text-gradient">----------- CATEGORIAS -----------</h2>
        <div className="slider-container">
          <button className="btn prev" onClick={() => handleScroll(categorySliderRef, 'left')}>❮</button>
          
          <div className="slider" ref={categorySliderRef}>
            <div className="card">
              <img src={cat1} alt="Categoría 1" />
              <div className="card-info">
                <h3>2 por $40.000</h3>
                {/* --- ENLACE CORREGIDO --- */}
                <Link to="/productos"><button>COMPRA AHORA</button></Link>
              </div>
            </div>
            <div className="card">
              <img src={cat2} alt="Categoría 2" />
              <div className="card-info">
                <h3>POLERAS PARA VERANO</h3>
                {/* --- ENLACE CORREGIDO --- */}
                <Link to="/productos"><button>COMPRA AHORA</button></Link>
              </div>
            </div>
            {/* ... más cards ... */}
          </div>

          <button className="btn next" onClick={() => handleScroll(categorySliderRef, 'right')}>❯</button>
        </div>
      </section>

      <div className="imagenweb img-fluid padin">
        {/* --- ENLACE CORREGIDO --- */}
        <Link to="/productos"> <img src={bannerFinal} alt="Banner final" /></Link>
      </div>

      {/* ===== Sección Videos (Slider 3) ===== */}
      <section className="shop-feed animate-fadeIn">
        <h2 className="titulo text-gradient">----------- PRODUCTOS DE TIENDA -----------</h2>
        <div className="slider-container-video">
          <button className="btn prev-video" onClick={() => handleScroll(videoSliderRef, 'left')}>❮</button>
          
          <div className="slider-wrapper">
            <div className="slider" id="video-slider" ref={videoSliderRef}>
              <div className="video-slide"><video src={videoGorra} autoPlay muted loop></video></div>
              <div className="video-slide"><video src={video2} autoPlay muted loop></video></div>
              <div className="video-slide"><video src={video3} autoPlay muted loop></video></div>
              <div className="video-slide"><video src={video4} autoPlay muted loop></video></div>
              <div className="video-slide"><video src={video5} autoPlay muted loop></video></div>
            </div>
          </div>
          
          <button className="btn next-video" onClick={() => handleScroll(videoSliderRef, 'right')}>❯</button>
        </div>
      </section>
      
      {/* El Footer se renderiza desde App.jsx */}
    </>
  );
}

export default HomePage;