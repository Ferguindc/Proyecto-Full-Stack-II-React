// src/data/adminProductos.js
import { useState } from "react";

// Importar imágenes directamente desde assets
import satoruImg from "../assets/img/satoru 2.jpg";
import togahoodieImg from "../assets/img/togahoodie.jpg";
import bolsaanimeImg from "../assets/img/bolsaanime.png";
import cuadroanimeImg from "../assets/img/cuadroanime.png";
import gatitoImg from "../assets/img/gatito.jpg";

export function adminProductos() {
  const [productos, setProductos] = useState([]);

  // Obtener imagen según categoría
  const obtenerImagenPorCategoria = (categoria) => {
    if (categoria === "Poleras") return satoruImg;
    if (categoria === "Hoodies") return togahoodieImg;
    if (categoria === "AnimeBags") return bolsaanimeImg;
    if (categoria === "Cuadros") return cuadroanimeImg;
    return gatitoImg;
  };

  const agregarProducto = (producto, archivoImagen) => {
    return new Promise((resolve) => {
      const agregar = (imagen) => {
        setProductos((prev) => [...prev, { ...producto, imagen }]);
        resolve();
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
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  return { productos, agregarProducto, eliminarProducto };
}
