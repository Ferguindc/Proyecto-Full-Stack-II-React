// src/data/products.js

// Importamos las imágenes (asegúrate de que estén en src/assets/img/)
import poleronSatoru from '../assets/img/293581278_145413034816483_8475974826237850925_n.jpg';
import camisetaOlas from '../assets/img/photo-1556011299-650a931cbfae.avif';
import givenCuadro from '../assets/img/givencuadro.jpg';
import satoruSingle from '../assets/img/satoru 2.jpg'; // Imagen de single.html

// src/data/products.js

export const allProducts = [
  {
    id: 1,
    nombre: 'Poleron Satoru Gojo',
    precio: 24990,
    categoria: 'ropa',
    descripcion: 'Un poleron de alta calidad con un diseño exclusivo de Satoru Gojo. Perfecto para fans de Jujutsu Kaisen.',
    // Array de imágenes para la galería
    images: [
      poleronSatoru,
      satoruSingle, // Usamos la de single.html como ejemplo
      camisetaOlas // Ejemplo
    ]
  },
  {
    id: 2,
    nombre: 'Camiseta "Olas"',
    precio: 1990,
    categoria: 'ropa',
    descripcion: 'Camiseta fresca y ligera con diseño de olas, ideal para el verano.',
    images: [
      camisetaOlas,
      poleronSatoru // Ejemplo
    ]
  },
  {
    id: 3,
    nombre: 'Cuadro Given',
    precio: 24990,
    categoria: 'cuadros',
    descripcion: 'Cuadro decorativo de alta resolución del anime Given. Dale un toque musical a tu habitación.',
    images: [
      givenCuadro,
      givenCuadro // Ejemplo
    ]
  },
  {
    id: 4,
    nombre: 'CUADRO PRUEBA',
    precio: 1990,
    categoria: 'cuadros',
    descripcion: 'Un cuadro de prueba para demostrar la funcionalidad de la galería.',
    images: [
      givenCuadro,
      poleronSatoru // Ejemplo
    ]
  }
  // ... AQUÍ AÑADIRÍAS EL RESTO DE TUS PRODUCTOS Y CUADROS
];