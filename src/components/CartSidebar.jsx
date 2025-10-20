import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

function CartSidebar() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity,
    getTotalItems,
    getTotalPrice 
  } = useCart();
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/carrito');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="cart-overlay" 
        onClick={() => setIsCartOpen(false)}
      ></div>
      
      {/* Sidebar */}
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Carrito de Compras</h3>
          <button 
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/poleras');
                }}
              >
                Ir a Comprar
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.imagen} alt={item.nombre} />
                    </div>
                    <div className="cart-item-details">
                      <h6>{item.nombre}</h6>
                      <p className="cart-item-size">Talla: {item.selectedSize}</p>
                      <p className="cart-item-price">{formatPrice(item.precio)}</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartId)}
                        className="remove-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-total">
                    <strong>
                      Total ({getTotalItems()} productos): {formatPrice(getTotalPrice())}
                    </strong>
                  </div>
                  <button 
                    className="btn btn-primary btn-checkout"
                    onClick={handleCheckout}
                  >
                    Ver Carrito Completo
                  </button>
                  <button 
                    className="btn btn-outline-primary btn-continue"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Seguir Comprando
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CartSidebar;