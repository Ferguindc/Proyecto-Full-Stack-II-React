// Mapeo de imágenes disponibles en el proyecto
export const imagenesDisponibles = [
  // Anime
  'anime.jpg',
  'makima.png',
  'power.png',
  'satoru.png',
  
  // Productos anime
  'poleraanime.png',
  'cuadroanime.png',
  'bolsaanime.png',
  
  // Productos diversos
  'gorro.avif',
  'poleron.avif',
  'rub1.avif',
  'neg1.avif',
  
  // Fotos variadas
  'photo-1556011299-650a931cbfae.avif',
  'photo-1562157873-818bc0726f68.avif',
  'photo-1706977470443-e71503f38c1d.avif',
  
  // Sin título y otros
  'Sin título-1.png',
  'Sin título-2.png',
  'Sin título-3.png',
  'Sin título-4.png',
  'Sin título-5.png',
  'Sin título-6.png',
  'Sin título-7.png',
  'Sin título-8.png',
  'Sin título-9.png',
  'Sin título-10.png',
  'Sin título-11.png',
  'Sin título-12.png',
  'Sin título-13.png',
  'Sin título-14.png',
  'Sin título-15.png',
  
  // Otros formatos
  'Perfil_ValleJara_2023.jpg',
  'PHOTO-2024-09-08-23-20-22.jpg',
  'PHOTO-2024-09-08-23-20-22 - copia.jpg',
  'PHOTO-2024-09-08-23-20-23.jpg',
  'PHOTO-2024-09-08-23-20-24.jpg',
  'PHOTO-2024-09-08-23-20-25.jpg',
  'Logo-new.webp',
  'PNG-las-plantillas-6.png',
  'Rick and Morty 11-09-24.png'
];

// Función para obtener la URL de una imagen local
export const obtenerUrlImagen = (nombreImagen) => {
  if (!nombreImagen) {
    return '/src/assets/img/Sin título-1.png';
  }
  
  // Si ya es una URL completa (http/https)
  if (nombreImagen.startsWith('http')) {
    return nombreImagen;
  }
  
  // Si ya es una ruta de assets completa
  if (nombreImagen.startsWith('/src/assets/')) {
    return nombreImagen;
  }
  
  // Si está en la lista de imágenes disponibles, crear ruta completa
  if (imagenesDisponibles.includes(nombreImagen)) {
    return `/src/assets/img/${nombreImagen}`;
  }
  
  // Si no incluye '/', asumir que es un archivo en assets/img
  if (!nombreImagen.includes('/')) {
    return `/src/assets/img/${nombreImagen}`;
  }
  
  // Imagen por defecto si no se encuentra
  return '/src/assets/img/Sin título-1.png';
};

// Categorización de imágenes por tipo
export const categoriaImagenes = {
  anime: ['anime.jpg', 'makima.png', 'power.png', 'satoru.png'],
  productos: [
    'poleraanime.png',
    'cuadroanime.png', 
    'bolsaanime.png',
    'gorro.avif',
    'poleron.avif'
  ],
  genericas: [
    'Sin título-1.png',
    'Sin título-2.png',
    'Sin título-3.png',
    'Sin título-4.png',
    'Sin título-5.png'
  ]
};