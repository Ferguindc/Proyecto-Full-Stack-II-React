import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function DebugCarritoPage() {
  const { cartItems, addToCart, clearCart, crearPedido } = useCart();
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  const agregarProductoPrueba = () => {
    const productoPrueba = {
      id: 1,
      nombre: "Producto de Prueba",
      precio: 15990,
      imagenUrl: "makima.png",
      categoria: "poleras"
    };
    
    addToCart(productoPrueba, 'M', 2);
  };

  const hacerLoginAdmin = async () => {
    try {
      await login('admin', 'admin');
    } catch (error) {
      console.error('Error login:', error);
    }
  };

  const probarPedido = async () => {
    try {
      console.log('🛒 Probando crear pedido...');
      console.log('Items en carrito:', cartItems);
      console.log('Usuario actual:', currentUser);
      
      const resultado = await crearPedido();
      console.log('✅ Pedido creado:', resultado);
      alert('¡Pedido creado exitosamente!');
    } catch (error) {
      console.error('❌ Error creando pedido:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h3 className="mb-0">🔧 Debug - Carrito de Compras</h3>
            </div>
            
            <div className="card-body">
              {/* Estado actual */}
              <div className="alert alert-info">
                <h5>📊 Estado Actual:</h5>
                <p><strong>Usuario:</strong> {currentUser ? `${currentUser.nombre || currentUser.email} (${currentUser.rol})` : 'No logueado'}</p>
                <p><strong>Items en carrito:</strong> {cartItems.length}</p>
                <p><strong>Total:</strong> ${cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0).toLocaleString()}</p>
              </div>

              {/* Items del carrito */}
              {cartItems.length > 0 && (
                <div className="alert alert-success">
                  <h6>🛒 Items en el carrito:</h6>
                  {cartItems.map((item, index) => (
                    <div key={index} className="mb-2">
                      - {item.nombre} (x{item.quantity}) - ${(item.precio * item.quantity).toLocaleString()}
                    </div>
                  ))}
                </div>
              )}

              {/* Controles de debug */}
              <div className="d-grid gap-2">
                {!currentUser && (
                  <button 
                    className="btn btn-primary"
                    onClick={hacerLoginAdmin}
                  >
                    🔐 Login como Admin
                  </button>
                )}

                <button 
                  className="btn btn-success"
                  onClick={agregarProductoPrueba}
                >
                  ➕ Agregar Producto de Prueba
                </button>

                {cartItems.length > 0 && (
                  <button 
                    className="btn btn-warning"
                    onClick={probarPedido}
                    disabled={!currentUser}
                  >
                    🛍️ Probar Crear Pedido
                  </button>
                )}

                <button 
                  className="btn btn-danger"
                  onClick={clearCart}
                >
                  🗑️ Limpiar Carrito
                </button>

                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/carrito')}
                >
                  📋 Ir al Carrito Normal
                </button>
              </div>

              {/* Información de debug */}
              <hr />
              <div className="text-muted small">
                <strong>🔍 Debug Info:</strong><br/>
                - Abrir consola (F12) para ver logs detallados<br/>
                - El error HTTP 400 aparecerá en la consola con más detalles<br/>
                - Estructura del pedido se muestra antes del envío
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebugCarritoPage;