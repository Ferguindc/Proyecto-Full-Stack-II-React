// src/pages/HomePage.jsx
import logo from '../assets/img/LOGODEF (2).png';
import React from 'react';

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

import ruletaImg from '../assets/img/pngtree-roulette-lottery-wheel-of-fortune-illustration-with-vector-png-image_2992805.jpg';


function HomePage() {
  
  return (
    <>

      {/* ----- Carrusel ----- */}
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="2000">
        {/* ... el resto del código del carrusel y la página sigue aquí ... */}
      </div>

    

      {/* ----- Carrusel ----- */}
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="2000">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={carouselImg1} className="d-block w-100" alt="Banner 1" />
          </div>
          <div className="carousel-item">
            <img src={carouselImg2} className="d-block w-100" alt="Banner 2" />
          </div>
          <div className="carousel-item">
            <img src={carouselImg1} className="d-block w-100" alt="Banner 3" />
          </div>
          <div className="carousel-item">
            <img src={carouselImg2} className="d-block w-100" alt="Banner 4" />
          </div>
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

      {/* ----- Sección de Productos ----- */}
      <section className="productos-destacados">
        <h2 className="titulo">----------- Seccion de Productos -----------</h2>
        <div className="slider-container">
          <button className="btn prev">❮</button>
          <div className="slider">
            <div className="card">
              <a href="productos.html"> <img src={productoArana} alt="Producto 1" /></a>
              <div className="card-info">
                <h3>Diseños</h3>
                <a href="productos.html"> <button>COMPRA AHORA</button></a>
              </div>
            </div>
            <div className="card">
              <img src={productoOriginal} alt="Producto 2" />
              <div className="card-info">
                <h3>2 FOR $40 MOCK NECK TEES</h3>
                <a href="productos.html">  <button>COMPRA AHORA</button></a>
              </div>
            </div>
            <div className="card">
              <img src={productoCuadros} alt="Producto 3" />
              <div className="card-info">
                <h3>CUADROS ANIME</h3>
                <a href="cuadros.html"><button>COMPRA AHORA</button></a>
              </div>
            </div>
            <div className="card">
              <img src={productoGorro} alt="Producto 4" />
              <div className="card-info">
                <h3>PRODUCTOS</h3>
                <a href="productos.html">  <button>COMPRA AHORA</button></a>
              </div>
            </div>
            <div className="card">
              <img src={productoSatoru} alt="Producto 5" />
              <div className="card-info">
                <h3>PRODUCTOS</h3>
                <a href="productos.html">  <button>COMPRA AHORA</button></a>
              </div>
            </div>
            <div className="card">
              <img src={producto6} alt="Producto 6" />
              <div className="card-info">
                <h3>PRODUCTOS</h3>
                <a href="productos.html">  <button>COMPRA AHORA</button></a>
              </div>
            </div>
            <div className="card">
              <img src={productoPoleron} alt="Producto 7" />
              <div className="card-info">
                <h3>PRODUCTOS</h3>
                <a href="productos.html">  <button>COMPRA AHORA</button></a>
              </div>
            </div>
          </div>
          <button className="btn next">❯</button>
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
            <a href="productos.html"><button>COMPRA AHORA</button></a>
          </div>
        </div>
        <div className="col">
          <img src={colImg2} alt="Imagen 2" />
          <div className="texto">
            <h3>LOITER 'VERANO'</h3>
            <a href="productos.html"> <button>COMPRA AHORA</button></a>
          </div>
        </div>
      </div>

      {/* ----- Sección Categorías ----- */}
      <section className="productos-destacados">
        <h2 className="titulo">----------- CATEGORIAS -----------</h2>
        <div className="slider-container">
          <button className="btn prev">❮</button>
          <div className="slider">
            <div className="card">
              <img src={cat1} alt="Categoría 1" />
              <div className="card-info">
                <h3>2 por $40.000</h3>
                <a href="productos.html"><button>COMPRA AHORA</button></a>
              </div>
            </div>
            <div className="card">
              <img src={cat2} alt="Categoría 2" />
              <div className="card-info">
                <h3>POLERAS PARA VERANO</h3>
                <a href="productos.html"><button>COMPRA AHORA</button></a>
              </div>
            </div>
            <div className="card">
              <img src={cat3} alt="Categoría 3" />
              <div className="card-info">
                <h3>PRODUCTOS</h3>
                <a href="productos.html">  <button>COMPRA AHORA</button></a>
              </div>
            </div>
            <div className="card">
              <img src={cat4} alt="Categoría 4" />
              <div className="card-info">
                <h3>PRODUCTOS</h3>
                <a href="productos.html">  <button>COMPRA AHORA</button></a>
              </div>
            </div>
          </div>
          <button className="btn next">❯</button>
        </div>
      </section>

      <div className="imagenweb img-fluid padin">
        <a href="productos.html"> <img src={bannerFinal} alt="Banner final" /></a>
      </div>

      {/* ----- Sección Videos ----- */}
      <section className="shop-feed">
        <h2 className="titulo">----------- PRODUCTOS DE TIENDA -----------</h2>
        <div className="slider-container-video">
          <button className="btn prev-video">❮</button>
          <div className="slider-wrapper">
            <div className="slider" id="video-slider">
              <div className="video-slide"><video src={videoGorra} autoPlay muted loop></video></div>
              <div className="video-slide"><video src={video2} autoPlay muted loop></video></div>
              <div className="video-slide"><video src={video3} autoPlay muted loop></video></div>
              <div className="video-slide"><video src={video4} autoPlay muted loop></video></div>
              <div className="video-slide"><video src={video5} autoPlay muted loop></video></div>
            </div>
          </div>
          <button className="btn next-video">❯</button>
        </div>
      </section>

      {/* ----- Modales (por ahora los dejamos comentados, luego les daremos funcionalidad) ----- */}
      {/* <div id="modal-ruleta-overlay" className="modal-overlay hidden">
         ... contenido del modal ...
      </div>
      */}

      
    </>
  );
}

export default HomePage;