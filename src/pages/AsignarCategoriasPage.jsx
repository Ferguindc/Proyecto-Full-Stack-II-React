// src/pages/AsignarCategoriasPage.jsx
import React, { useState, useEffect } from 'react';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';

function AsignarCategoriasPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      const [productosData, categoriasData] = await Promise.all([
        productoService.obtenerTodos(),
        categoriaService.obtenerTodas()
      ]);
      
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const asignarCategoriasAutomaticamente = async () => {
    try {
      setProcesando(true);
      
      // Crear categorías si no existen
      let categoriaPoleras = categorias.find(c => c.nombre.toLowerCase().includes('polera'));
      let categoriaPolerones = categorias.find(c => c.nombre.toLowerCase().includes('poleron'));
      let categoriaCuadros = categorias.find(c => c.nombre.toLowerCase().includes('cuadro'));
      
      // Si no existen las categorías, las creamos
      if (!categoriaPoleras) {
        try {
          categoriaPoleras = await categoriaService.crear({
            nombre: 'POLERA',
            descripcion: 'Camisetas y poleras para uso casual'
          });
        } catch (e) {
          console.log('Error creando categoría POLERA:', e);
        }
      }
      
      if (!categoriaPolerones) {
        try {
          categoriaPolerones = await categoriaService.crear({
            nombre: 'POLERON',
            descripcion: 'Sudaderas y hoodies para clima frío'
          });
        } catch (e) {
          console.log('Error creando categoría POLERON:', e);
        }
      }
      
      if (!categoriaCuadros) {
        try {
          categoriaCuadros = await categoriaService.crear({
            nombre: 'CUADRO',
            descripcion: 'Arte y decoración para el hogar'
          });
        } catch (e) {
          console.log('Error creando categoría CUADRO:', e);
        }
      }
      
      // Recargar categorías
      const nuevasCategorias = await categoriaService.obtenerTodas();
      setCategorias(nuevasCategorias);
      
      // Actualizar referencias
      categoriaPoleras = nuevasCategorias.find(c => c.nombre.toLowerCase().includes('polera'));
      categoriaPolerones = nuevasCategorias.find(c => c.nombre.toLowerCase().includes('poleron'));
      categoriaCuadros = nuevasCategorias.find(c => c.nombre.toLowerCase().includes('cuadro'));
      
      // Asignar categorías a productos según su nombre
      for (const producto of productos) {
        try {
          const categoriasAsignar = [];
          const nombreLower = producto.nombre.toLowerCase();
          const descripcionLower = (producto.descripcion || '').toLowerCase();
          
          // Lógica de asignación automática
          if (nombreLower.includes('camiseta') || nombreLower.includes('polera') || 
              nombreLower.includes('shirt') || descripcionLower.includes('camiseta')) {
            if (categoriaPoleras) categoriasAsignar.push(categoriaPoleras.id);
          } else if (nombreLower.includes('poleron') || nombreLower.includes('hoodie') || 
                     nombreLower.includes('sudadera') || descripcionLower.includes('poleron')) {
            if (categoriaPolerones) categoriasAsignar.push(categoriaPolerones.id);
          } else if (nombreLower.includes('cuadro') || nombreLower.includes('arte') || 
                     nombreLower.includes('poster') || descripcionLower.includes('cuadro')) {
            if (categoriaCuadros) categoriasAsignar.push(categoriaCuadros.id);
          } else {
            // Si no se puede determinar, asignar a poleras por defecto
            if (categoriaPoleras) categoriasAsignar.push(categoriaPoleras.id);
          }
          
          if (categoriasAsignar.length > 0) {
            await productoService.agregarCategorias(producto.id, categoriasAsignar);
            console.log(`✅ Categorías asignadas al producto: ${producto.nombre}`);
          }
          
        } catch (error) {
          console.error(`❌ Error asignando categorías a ${producto.nombre}:`, error);
        }
      }
      
      alert('¡Categorías asignadas automáticamente! Recarga las páginas de productos.');
      
    } catch (error) {
      console.error('Error en proceso automático:', error);
      setError('Error al asignar categorías automáticamente');
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Cargando...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏷️ Asignar Categorías a Productos</h1>
      
      {error && (
        <div style={{ background: '#f8d7da', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
          ❌ {error}
        </div>
      )}
      
      <div style={{ marginBottom: '30px' }}>
        <h2>📊 Resumen</h2>
        <p>📦 Total productos: {productos.length}</p>
        <p>🏷️ Total categorías: {categorias.length}</p>
        <p>❌ Productos sin categorías: {productos.filter(p => !p.categorias || p.categorias.length === 0).length}</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={asignarCategoriasAutomaticamente}
          disabled={procesando}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: procesando ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: procesando ? 'not-allowed' : 'pointer'
          }}
        >
          {procesando ? '⏳ Procesando...' : '🚀 Asignar Categorías Automáticamente'}
        </button>
      </div>
      
      <div>
        <h2>📋 Categorías Disponibles</h2>
        {categorias.length === 0 ? (
          <p>No hay categorías disponibles. Se crearán automáticamente.</p>
        ) : (
          <ul>
            {categorias.map(categoria => (
              <li key={categoria.id}>
                <strong>{categoria.nombre}</strong> - {categoria.descripcion}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div>
        <h2>📦 Productos</h2>
        {productos.map(producto => (
          <div 
            key={producto.id} 
            style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              margin: '10px 0', 
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          >
            <h3>{producto.nombre}</h3>
            <p>💰 Precio: ${producto.precio}</p>
            <p>📄 Descripción: {producto.descripcion}</p>
            <p>🏷️ Categorías: {
              producto.categorias && producto.categorias.length > 0 
                ? producto.categorias.map(c => c.nombre).join(', ')
                : '❌ Sin categorías'
            }</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AsignarCategoriasPage;