// src/data/adminProductos.js
import { useState, useEffect } from "react";

// Importar imágenes directamente desde assets
import satoruImg from "../assets/img/satoru 2.jpg";
import togahoodieImg from "../assets/img/togahoodie.jpg";
import bolsaanimeImg from "../assets/img/bolsaanime.png";
import cuadroanimeImg from "../assets/img/cuadroanime.png";
import gatitoImg from "../assets/img/gatito.jpg";

export function adminProductos() {
  const [productos, setProductos] = useState([]);

  // Cargar productos del localStorage al inicializar
  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      try {
        setProductos(JSON.parse(productosGuardados));
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    }
  }, []);

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    if (productos.length > 0) {
      localStorage.setItem('productos', JSON.stringify(productos));
    }
  }, [productos]);

  // Obtener imagen según categoría
  const obtenerImagenPorCategoria = (categoria) => {
    if (categoria === "Poleras") return satoruImg;
    if (categoria === "Hoodies") return togahoodieImg;
    if (categoria === "AnimeBags") return bolsaanimeImg;
    if (categoria === "Cuadros") return cuadroanimeImg;
    return gatitoImg;
  };

  const agregarProducto = (producto, archivoImagen, currentUser = null) => {
    return new Promise((resolve) => {
      const agregar = (imagen) => {
        const nuevoProducto = {
          ...producto,
          id: Date.now(), // ID único basado en timestamp
          imagen,
          fechaCreacion: new Date().toISOString(),
          creadoPor: currentUser?.email || 'admin',
          creadorNombre: currentUser?.nombre || 'Administrador'
        };
        
        setProductos((prev) => {
          const nuevosProductos = [...prev, nuevoProducto];
          localStorage.setItem('productos', JSON.stringify(nuevosProductos));
          return nuevosProductos;
        });
        resolve(nuevoProducto);
      };

      if (archivoImagen) {
        const lector = new FileReader();
        lector.onload = (e) => agregar(e.target.result);
        lector.readAsDataURL(archivoImagen);
      } else {
        agregar(obtenerImagenPorCategoria(producto.categoria));
      }
    });
  };

  const eliminarProducto = (index) => {
    setProductos((prev) => {
      const nuevosProductos = prev.filter((_, i) => i !== index);
      localStorage.setItem('productos', JSON.stringify(nuevosProductos));
      return nuevosProductos;
    });
  };

  const editarProducto = (id, productosActualizados, currentUser = null) => {
    return new Promise((resolve) => {
      setProductos((prev) => {
        const nuevosProductos = prev.map(producto => {
          if (producto.id === id) {
            return {
              ...producto,
              ...productosActualizados,
              fechaModificacion: new Date().toISOString(),
              modificadoPor: currentUser?.email || 'admin',
              modificadorNombre: currentUser?.nombre || 'Administrador'
            };
          }
          return producto;
        });
        localStorage.setItem('productos', JSON.stringify(nuevosProductos));
        return nuevosProductos;
      });
      resolve();
    });
  };

  return { productos, agregarProducto, eliminarProducto, editarProducto };
}
