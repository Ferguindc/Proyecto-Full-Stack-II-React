// Productos de ejemplo para usar con imágenes locales
export const productosEjemplo = [
  {
    nombre: 'Polera Anime Makima',
    precio: 15990,
    descripcion: 'Polera exclusiva con diseño de Makima de Chainsaw Man. Material de alta calidad 100% algodón.',
    stock: 25,
    imagenUrl: 'makima.png',
    categorias: ['poleras', 'anime']
  },
  {
    nombre: 'Polera Power Chainsaw Man',
    precio: 15990,
    descripcion: 'Diseño único de Power, el demonio de sangre más querido. Estampado de alta durabilidad.',
    stock: 30,
    imagenUrl: 'power.png', 
    categorias: ['poleras', 'anime']
  },
  {
    nombre: 'Polera Satoru Gojo',
    precio: 18990,
    descripcion: 'El maestro más fuerte de Jujutsu Kaisen. Diseño premium con acabados especiales.',
    stock: 20,
    imagenUrl: 'satoru.png',
    categorias: ['poleras', 'anime']
  },
  {
    nombre: 'Cuadro Anime Decorativo',
    precio: 25990,
    descripcion: 'Cuadro decorativo con arte anime de alta calidad. Perfecto para tu habitación otaku.',
    stock: 15,
    imagenUrl: 'cuadroanime.png',
    categorias: ['cuadros', 'anime']
  },
  {
    nombre: 'Bolsa Anime Kawaii',
    precio: 8990,
    descripcion: 'Bolsa resistente con diseños kawaii. Perfecta para llevar tus cosas con estilo.',
    stock: 40,
    imagenUrl: 'bolsaanime.png',
    categorias: ['accesorios', 'anime']
  },
  {
    nombre: 'Gorro Invierno Estilo',
    precio: 12990,
    descripcion: 'Gorro abrigado perfecto para el invierno. Diseño moderno y cómodo.',
    stock: 35,
    imagenUrl: 'gorro.avif',
    categorias: ['accesorios', 'invierno']
  },
  {
    nombre: 'Polerón Oversize Cómodo',
    precio: 24990,
    descripcion: 'Polerón oversize súper cómodo. Perfecto para looks casuales y relajados.',
    stock: 18,
    imagenUrl: 'poleron.avif',
    categorias: ['polerones', 'casual']
  },
  {
    nombre: 'Polera Anime Genérica',
    precio: 13990,
    descripcion: 'Diseño anime clásico para verdaderos otakus. Calidad garantizada.',
    stock: 50,
    imagenUrl: 'poleraanime.png',
    categorias: ['poleras', 'anime']
  },
  {
    nombre: 'Producto Especial Edición',
    precio: 19990,
    descripción: 'Producto especial con diseño único y exclusivo. Edición limitada.',
    stock: 10,
    imagenUrl: 'Sin título-1.png',
    categorias: ['especiales']
  }
];

// Función para crear productos automáticamente (opcional para testing)
export const crearProductosEjemplo = async (productoService, categoriaService) => {
  try {
    console.log('Creando productos de ejemplo...');
    
    for (const producto of productosEjemplo) {
      try {
        // Crear el producto
        const productoCreado = await productoService.crear({
          nombre: producto.nombre,
          precio: producto.precio,
          descripcion: producto.descripcion,
          stock: producto.stock,
          imagenUrl: producto.imagenUrl
        });

        console.log(`Producto creado: ${productoCreado.nombre}`);
        
        // Si tiene categorías, buscarlas y asignarlas
        if (producto.categorias && producto.categorias.length > 0) {
          try {
            const todasCategorias = await categoriaService.obtenerTodas();
            const categoriasIds = [];
            
            for (const nombreCategoria of producto.categorias) {
              const categoria = todasCategorias.find(cat => 
                cat.nombre.toLowerCase() === nombreCategoria.toLowerCase()
              );
              
              if (categoria) {
                categoriasIds.push(categoria.id);
              } else {
                // Si la categoría no existe, crearla
                try {
                  const nuevaCategoria = await categoriaService.crear({
                    nombre: nombreCategoria,
                    descripcion: `Categoría ${nombreCategoria}`
                  });
                  categoriasIds.push(nuevaCategoria.id);
                  console.log(`Categoría creada: ${nuevaCategoria.nombre}`);
                } catch (error) {
                  console.warn(`Error creando categoría ${nombreCategoria}:`, error);
                }
              }
            }
            
            // Asignar categorías al producto
            if (categoriasIds.length > 0) {
              await productoService.agregarCategorias(productoCreado.id, categoriasIds);
              console.log(`Categorías asignadas a ${productoCreado.nombre}`);
            }
          } catch (error) {
            console.warn(`Error asignando categorías a ${producto.nombre}:`, error);
          }
        }

      } catch (error) {
        console.warn(`Error creando producto ${producto.nombre}:`, error);
      }
    }
    
    console.log('¡Productos de ejemplo creados exitosamente!');
    return true;
    
  } catch (error) {
    console.error('Error en la creación masiva de productos:', error);
    return false;
  }
};