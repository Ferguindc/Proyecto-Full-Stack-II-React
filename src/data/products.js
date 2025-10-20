// src/data/products.js

// Importamos las imágenes (asegúrate de que estén en src/assets/img/)
import poleronSatoru from '../assets/img/293581278_145413034816483_8475974826237850925_n.jpg';
import camisetaOlas from '../assets/img/photo-1556011299-650a931cbfae.avif';
import givenCuadro from '../assets/img/givencuadro.jpg';
import satoruSingle from '../assets/img/satoru 2.jpg'; // Imagen de single.html

// src/data/products.js

export const allProducts = [
  // POLERAS
  {
    id: 1,
    nombre: 'Polera Anime Básica',
    precio: 12990,
    categoria: 'poleras',
    descripcion: 'Polera cómoda de algodón con diseños anime exclusivos.',
    images: [
      camisetaOlas,
      satoruSingle,
      poleronSatoru
    ]
  },
  {
    id: 2,
    nombre: 'Polera "Olas" Premium',
    precio: 15990,
    categoria: 'poleras',
    descripcion: 'Polera premium con diseño de olas, perfecta para el verano.',
    images: [
      camisetaOlas,
      poleronSatoru,
      satoruSingle
    ]
  },
  {
    id: 3,
    nombre: 'Polera Satoru Gojo',
    precio: 18990,
    categoria: 'poleras',
    descripcion: 'Polera con el diseño exclusivo de Satoru Gojo de Jujutsu Kaisen.',
    images: [
      satoruSingle,
      camisetaOlas,
      poleronSatoru
    ]
  },
  {
    id: 4,
    nombre: 'Polera Vintage Anime',
    precio: 16990,
    categoria: 'poleras',
    descripcion: 'Polera con estilo vintage y diseños clásicos de anime.',
    images: [
      camisetaOlas,
      satoruSingle,
      poleronSatoru
    ]
  },
   {
    id: 5,
    nombre: 'Polera Anime Básaica',
    precio: 190,
    categoria: 'poleras',
    descripcion: 'Polera cómoda de algodón con diseños anime exclusivos.',
    images: [
      camisetaOlas,
      satoruSingle,
      poleronSatoru
    ]
  },
    {
    id: 6,
    nombre: 'Polera Anime Bás22ica',
    precio: 2990,
    categoria: 'poleras',
    descripcion: 'Polera cómoda de algodón con diseños anime exclusivos.',
    images: [
      camisetaOlas,
      satoruSingle,
      poleronSatoru,
      camisetaOlas
    ]
  },
  

  // POLERONES
  {
    id: 5,
    nombre: 'Poleron Satoru Gojo',
    precio: 90,
    categoria: 'polerones',
    descripcion: 'Poleron de alta calidad con diseño exclusivo de Satoru Gojo.',
    images: [
      poleronSatoru,
      satoruSingle,
      camisetaOlas
    ]
  },
  {
    id: 6,
    nombre: 'Poleron Anime Premium',
    precio: 29990,
    categoria: 'polerones',
    descripcion: 'Poleron premium con capucha y diseños anime únicos.',
    images: [
      poleronSatoru,
      camisetaOlas,
      satoruSingle
    ]
  },
  {
    id: 7,
    nombre: 'Poleron Básico Anime',
    precio: 22990,
    categoria: 'polerones',
    descripcion: 'Poleron cómodo y abrigado con estampados anime.',
    images: [
      poleronSatoru,
      satoruSingle,
      camisetaOlas
    ]
  },
  {
    id: 8,
    nombre: 'Poleron Edición Limitada',
    precio: 34990,
    categoria: 'polerones',
    descripcion: 'Poleron de edición limitada con diseños exclusivos.',
    images: [
      poleronSatoru,
      camisetaOlas,
      satoruSingle
    ]
  },

  // CUADROS
  {
    id: 9,
    nombre: 'Cuadro Given',
    precio: 19990,
    categoria: 'cuadros',
    descripcion: 'Cuadro decorativo de alta resolución del anime Given.',
    medidas: ['30x39', '40x50', '50x70', '70x81'],
    images: [
      givenCuadro,
      givenCuadro,
      givenCuadro
    ]
  },
  {
    id: 10,
    nombre: 'Cuadro Jujutsu Kaisen',
    precio: 22990,
    categoria: 'cuadros',
    descripcion: 'Cuadro con personajes de Jujutsu Kaisen en alta calidad.',
    medidas: ['30x39', '40x50', '50x70', '70x81'],
    images: [
      givenCuadro,
      satoruSingle,
      givenCuadro
    ]
  },
  {
    id: 11,
    nombre: 'Cuadro Anime Clásico',
    precio: 18990,
    categoria: 'cuadros',
    descripcion: 'Cuadro con diseños de anime clásico para decorar tu habitación.',
    medidas: ['30x39', '40x50', '50x70', '70x81'],
    images: [
      givenCuadro,
      givenCuadro,
      satoruSingle
    ]
  },
  {
    id: 12,
    nombre: 'Cuadro Personalizado',
    precio: 25990,
    categoria: 'cuadros',
    descripcion: 'Cuadro personalizable con tu anime favorito.',
    medidas: ['30x39', '40x50', '50x70', '70x81'],
    images: [
      givenCuadro,
      givenCuadro,
      givenCuadro
    ]
  }
];