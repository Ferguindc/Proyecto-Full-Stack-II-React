// src/pages/DebugProductosPage.jsx
import React, { useState, useEffect } from 'react';
import { productoService } from '../services/productoService';

function DebugProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔍 DEBUG: Cargando productos...');
      
      const productos = await productoService.obtenerTodos();
      console.log('🔍 DEBUG: Productos obtenidos:', productos);
      
      setProductos(productos);
    } catch (error) {
      console.error('🔍 DEBUG: Error cargando productos:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 DEBUG - Estado de Productos</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={cargarProductos} style={{ padding: '10px 20px' }}>
          🔄 Recargar Productos
        </button>
      </div>

      {loading && (
        <div style={{ background: '#fff3cd', padding: '10px', margin: '10px 0' }}>
          ⏳ Cargando productos...
        </div>
      )}

      {error && (
        <div style={{ background: '#f8d7da', padding: '10px', margin: '10px 0' }}>
          ❌ Error: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ background: '#d4edda', padding: '10px', margin: '10px 0' }}>
            ✅ Total de productos: {productos.length}
          </div>

          {productos.length === 0 ? (
            <div style={{ background: '#f0f0f0', padding: '20px' }}>
              <h3>❌ No hay productos en la base de datos</h3>
              <p>Necesitas agregar productos desde el panel de administración.</p>
            </div>
          ) : (
            <div>
              <h2>📋 Lista de productos:</h2>
              {productos.map((producto, index) => (
                <div 
                  key={producto.id} 
                  style={{ 
                    background: '#f8f9fa', 
                    padding: '15px', 
                    margin: '10px 0',
                    border: '1px solid #ddd'
                  }}
                >
                  <h4>#{index + 1} - ID: {producto.id}</h4>
                  <p><strong>Nombre:</strong> {producto.nombre}</p>
                  <p><strong>Precio:</strong> ${producto.precio}</p>
                  <p><strong>Stock:</strong> {producto.stock}</p>
                  <p><strong>Categorías:</strong> {
                    producto.categorias ? 
                    producto.categorias.map(cat => cat.nombre).join(', ') :
                    'Sin categorías'
                  }</p>
                  {producto.tallas && producto.tallas.length > 0 && (
                    <p><strong>Tallas:</strong> {producto.tallas.map(t => t.nombre).join(', ')}</p>
                  )}
                  {producto.imagen && (
                    <p><strong>Imagen:</strong> {producto.imagen}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DebugProductosPage;