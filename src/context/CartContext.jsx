import React, { createContext, useContext, useState, useEffect } from 'react';
import { pedidoService } from '../services/pedidoService.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { currentUser } = useAuth(); // Usar currentUser en lugar de user

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1, selectedSize = 'M') => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItem) {
        // Si ya existe, aumentar cantidad
        return prevItems.map(item =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item
        return [...prevItems, {
          ...product,
          quantity,
          selectedSize,
          cartId: `${product.id}-${selectedSize}-${Date.now()}` // ID único para el carrito
        }];
      }
    });
  };

  // Remover producto del carrito
  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Obtener cantidad total de productos
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Obtener precio total
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  // Obtener descuento (ejemplo: 10% si compra más de $50000)
  const getDiscount = () => {
    const total = getTotalPrice();
    if (total >= 50000) {
      return Math.floor(total * 0.1); // 10% descuento
    }
    return 0;
  };

  // Obtener costo de envío
  const getShippingCost = () => {
    const total = getTotalPrice();
    if (total >= 50000) {
      return 0; // Envío gratis
    }
    return 5000; // Costo de envío estándar
  };

  // Obtener total final con descuentos y envío
  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const discount = getDiscount();
    const shipping = getShippingCost();
    return subtotal - discount + shipping;
  };

  // Abrir/cerrar carrito lateral
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Crear pedido en el backend
  const crearPedido = async (datosEnvio = {}, metodoPago = 'transferencia') => {
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para realizar un pedido');
    }

    if (cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    try {
      // Preparar datos del pedido
      console.log('👤 Usuario actual para pedido:', currentUser);
      console.log('📦 Datos de envío recibidos:', datosEnvio);
      console.log('💳 Método de pago:', metodoPago);
      
      // Determinar ID de usuario de forma más robusta
      let usuarioId;
      if (currentUser.email === "admin" || currentUser.email === "admin@admin.com") {
        usuarioId = 1;
      } else if (currentUser.id) {
        usuarioId = parseInt(currentUser.id);
      } else {
        // Si no hay ID, crear uno basado en timestamp del email
        usuarioId = Date.now() % 1000000; // ID único basado en timestamp
      }
      
      console.log('🆔 ID de usuario determinado:', usuarioId);
      
      const pedidoData = {
        usuarioId: usuarioId,
        usuario: {
          id: usuarioId
        },
        estado: "PENDIENTE",
        total: getFinalTotal(),
        // Información de envío
        direccion: datosEnvio.direccion || 'No especificada',
        ciudad: datosEnvio.ciudad || 'No especificada',
        comuna: datosEnvio.comuna || 'No especificada',
        notas: datosEnvio.notas || '',
        // Método de pago
        metodoPago: metodoPago,
        // Detalles con talla incluida
        detalles: cartItems.map(item => ({
          producto: {
            id: parseInt(item.id)
          },
          cantidad: item.quantity,
          precioUnitario: parseFloat(item.precio),
          talla: item.selectedSize || 'N/A'
        }))
      };

      console.log('📦 Creando pedido completo:', pedidoData);
      
      const pedidoCreado = await pedidoService.crear(pedidoData);
      
      // Limpiar carrito después de crear el pedido
      clearCart();
      setIsCartOpen(false);
      
      return pedidoCreado;
      
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  };

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getDiscount,
    getShippingCost,
    getFinalTotal,
    toggleCart,
    setIsCartOpen,
    crearPedido
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
}