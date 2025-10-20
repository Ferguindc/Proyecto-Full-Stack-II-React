import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CarritoPage.css';

function CarritoPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getDiscount,
    getShippingCost,
    getFinalTotal 
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Carrito, 2: Datos, 3: Confirmación, 4: Orden completada
  const [customerData, setCustomerData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    ciudad: 'Santiago',
    comuna: '',
    codigoPostal: '',
    notas: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [orderNumber, setOrderNumber] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['nombre', 'email', 'telefono', 'direccion', 'comuna'];
    return required.every(field => customerData[field].trim() !== '');
  };

  const handleNextStep = () => {
    if (step === 1 && cartItems.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    if (step === 2 && !validateForm()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    setStep(step + 1);
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000);
    return `CW${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
  };

  const processOrder = () => {
    // Simular procesamiento de orden
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
    
    // Guardar orden en localStorage (simulación)
    const orderData = {
      orderNumber: newOrderNumber,
      date: new Date().toISOString(),
      customer: customerData,
      items: cartItems,
      payment: {
        method: paymentMethod,
        subtotal: getTotalPrice(),
        discount: getDiscount(),
        shipping: getShippingCost(),
        total: getFinalTotal()
      },
      status: 'confirmada'
    };
    
    // Guardar en historial de órdenes
    const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('userOrders', JSON.stringify(existingOrders));
    
    // Limpiar carrito
    clearCart();
    setStep(4);
  };

  if (cartItems.length === 0 && step === 1) {
    return (
      <div className="container py-5 text-center">
        <div className="cart-empty-page">
          <h2>Tu carrito está vacío</h2>
          <p>¡Descubre nuestros increíbles productos!</p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/productos')}
          >
            Ir a Comprar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="cart-page">
        {/* Progress Indicator */}
        <div className="progress-indicator mb-5">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Carrito</div>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Datos</div>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirmación</div>
          </div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Completado</div>
          </div>
        </div>

        {/* Step 1: Carrito */}
        {step === 1 && (
          <div className="row">
            <div className="col-lg-8">
              <div className="cart-items-section">
                <h3>Tu Carrito ({getTotalItems()} productos)</h3>
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="cart-item-card">
                      <div className="item-image">
                        <img src={item.imagen} alt={item.nombre} />
                      </div>
                      <div className="item-details">
                        <h5>{item.nombre}</h5>
                        <p className="item-size">Talla: {item.selectedSize}</p>
                        <p className="item-price">{formatPrice(item.precio)}</p>
                      </div>
                      <div className="item-quantity">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="item-total">
                        <strong>{formatPrice(item.precio * item.quantity)}</strong>
                      </div>
                      <div className="item-remove">
                        <button 
                          onClick={() => removeFromCart(item.cartId)}
                          className="remove-item-btn"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="cart-summary">
                <h4>Resumen del Pedido</h4>
                <div className="summary-line">
                  <span>Subtotal ({getTotalItems()} productos)</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="summary-line discount">
                    <span>Descuento (10%)</span>
                    <span>-{formatPrice(getDiscount())}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>Envío</span>
                  <span>{getShippingCost() === 0 ? 'GRATIS' : formatPrice(getShippingCost())}</span>
                </div>
                <hr />
                <div className="summary-total">
                  <strong>
                    <span>Total</span>
                    <span>{formatPrice(getFinalTotal())}</span>
                  </strong>
                </div>
                <button 
                  className="btn btn-primary btn-lg w-100 mt-3"
                  onClick={handleNextStep}
                >
                  Continuar
                </button>
                <button 
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => navigate('/productos')}
                >
                  Seguir Comprando
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Datos del Cliente */}
        {step === 2 && (
          <div className="row">
            <div className="col-lg-8">
              <div className="customer-data-section">
                <h3>Datos de Envío</h3>
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre Completo *</label>
                      <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={customerData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={customerData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        name="telefono"
                        className="form-control"
                        value={customerData.telefono}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Comuna *</label>
                      <select
                        name="comuna"
                        className="form-control"
                        value={customerData.comuna}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar comuna</option>
                        <option value="Santiago">Santiago</option>
                        <option value="Las Condes">Las Condes</option>
                        <option value="Providencia">Providencia</option>
                        <option value="Ñuñoa">Ñuñoa</option>
                        <option value="Maipú">Maipú</option>
                        <option value="La Florida">La Florida</option>
                        <option value="Puente Alto">Puente Alto</option>
                        <option value="Quilicura">Quilicura</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dirección *</label>
                    <input
                      type="text"
                      name="direccion"
                      className="form-control"
                      placeholder="Calle, número, dpto/casa"
                      value={customerData.direccion}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notas del Pedido (opcional)</label>
                    <textarea
                      name="notas"
                      className="form-control"
                      rows="3"
                      placeholder="Instrucciones especiales para el envío..."
                      value={customerData.notas}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </form>

                <h4 className="mt-4">Método de Pago</h4>
                <div className="payment-methods">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="transferencia"
                      value="transferencia"
                      checked={paymentMethod === 'transferencia'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="transferencia">
                      <strong>Transferencia Bancaria</strong>
                      <small className="d-block text-muted">Recibirás los datos bancarios por email</small>
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="webpay"
                      value="webpay"
                      checked={paymentMethod === 'webpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="webpay">
                      <strong>WebPay Plus</strong>
                      <small className="d-block text-muted">Pago con tarjetas de crédito/débito</small>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="cart-summary">
                <h4>Resumen del Pedido</h4>
                <div className="summary-line">
                  <span>Subtotal ({getTotalItems()} productos)</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="summary-line discount">
                    <span>Descuento</span>
                    <span>-{formatPrice(getDiscount())}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>Envío</span>
                  <span>{getShippingCost() === 0 ? 'GRATIS' : formatPrice(getShippingCost())}</span>
                </div>
                <hr />
                <div className="summary-total">
                  <strong>
                    <span>Total</span>
                    <span>{formatPrice(getFinalTotal())}</span>
                  </strong>
                </div>
                <div className="checkout-buttons">
                  <button 
                    className="btn btn-outline-secondary w-100 mb-2"
                    onClick={() => setStep(1)}
                  >
                    Volver al Carrito
                  </button>
                  <button 
                    className="btn btn-primary btn-lg w-100"
                    onClick={handleNextStep}
                  >
                    Revisar Pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmación */}
        {step === 3 && (
          <div className="row">
            <div className="col-lg-8">
              <div className="order-confirmation">
                <h3>Confirmar Pedido</h3>
                
                <div className="confirmation-section">
                  <h5>Datos de Envío</h5>
                  <p><strong>{customerData.nombre}</strong></p>
                  <p>{customerData.email} | {customerData.telefono}</p>
                  <p>{customerData.direccion}, {customerData.comuna}</p>
                  {customerData.notas && <p><em>Notas: {customerData.notas}</em></p>}
                </div>

                <div className="confirmation-section">
                  <h5>Método de Pago</h5>
                  <p>
                    {paymentMethod === 'transferencia' ? 'Transferencia Bancaria' : 'WebPay Plus'}
                  </p>
                </div>

                <div className="confirmation-section">
                  <h5>Productos</h5>
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="confirmation-item">
                      <img src={item.imagen} alt={item.nombre} width="50" />
                      <div className="item-info">
                        <strong>{item.nombre}</strong>
                        <span>Talla: {item.selectedSize} | Cantidad: {item.quantity}</span>
                      </div>
                      <div className="item-price">
                        {formatPrice(item.precio * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="cart-summary">
                <h4>Total del Pedido</h4>
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="summary-line discount">
                    <span>Descuento</span>
                    <span>-{formatPrice(getDiscount())}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>Envío</span>
                  <span>{getShippingCost() === 0 ? 'GRATIS' : formatPrice(getShippingCost())}</span>
                </div>
                <hr />
                <div className="summary-total">
                  <strong>
                    <span>Total a Pagar</span>
                    <span>{formatPrice(getFinalTotal())}</span>
                  </strong>
                </div>
                <div className="checkout-buttons">
                  <button 
                    className="btn btn-outline-secondary w-100 mb-2"
                    onClick={() => setStep(2)}
                  >
                    Modificar Datos
                  </button>
                  <button 
                    className="btn btn-success btn-lg w-100"
                    onClick={processOrder}
                  >
                    Confirmar Pedido
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Orden Completada */}
        {step === 4 && (
          <div className="order-success text-center">
            <div className="success-icon">✅</div>
            <h2>¡Pedido Confirmado!</h2>
            <p className="lead">Tu orden #{orderNumber} ha sido procesada exitosamente</p>
            
            <div className="success-details">
              <p>Recibirás un email de confirmación con los detalles del pedido y las instrucciones de pago.</p>
              {paymentMethod === 'transferencia' && (
                <div className="payment-info">
                  <h5>Datos para Transferencia:</h5>
                  <p><strong>Banco:</strong> Banco Estado</p>
                  <p><strong>Cuenta Corriente:</strong> 12345678-9</p>
                  <p><strong>RUT:</strong> 12.345.678-9</p>
                  <p><strong>Nombre:</strong> Crime Wave Store</p>
                  <p><strong>Monto:</strong> {formatPrice(getFinalTotal())}</p>
                </div>
              )}
              <p><strong>Tiempo estimado de entrega:</strong> 3-5 días hábiles</p>
            </div>

            <div className="success-actions">
              <button 
                className="btn btn-primary btn-lg me-3"
                onClick={() => navigate('/cliente')}
              >
                Ver Mis Pedidos
              </button>
              <button 
                className="btn btn-outline-primary btn-lg"
                onClick={() => navigate('/productos')}
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarritoPage;