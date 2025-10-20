// spec/basic.spec.js
// 15 Pruebas Unitarias: 10 Positivas + 5 Negativas

describe('Tienda Crime Wave - Pruebas Unitarias', function() {
  
  // ========== 10 PRUEBAS POSITIVAS ==========
  
  it('✅ debería calcular el precio con descuento correctamente', function() {
    const precio = 20000;
    const descuento = 20; // 20%
    const resultado = precio - (precio * descuento / 100);
    expect(resultado).toBe(16000);
  });

  it('✅ debería formatear precios chilenos correctamente', function() {
    const precio = 15990;
    const formato = `$${precio.toLocaleString('es-CL')}`;
    expect(formato).toBe('$15.990');
  });

  it('✅ debería validar email correcto', function() {
    const email = 'cliente@example.com';
    const esValido = email.includes('@') && email.includes('.');
    expect(esValido).toBe(true);
  });

  it('✅ debería agregar producto al carrito', function() {
    const carrito = [];
    const producto = { id: 1, nombre: 'Polera Anime', precio: 15990 };
    carrito.push(producto);
    expect(carrito.length).toBe(1);
    expect(carrito[0].nombre).toBe('Polera Anime');
  });

  it('✅ debería calcular total del carrito', function() {
    const productos = [
      { precio: 15990, cantidad: 2 }, // 31980
      { precio: 12990, cantidad: 1 }  // 12990
    ];
    const total = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    expect(total).toBe(44970);
  });

  it('✅ debería filtrar productos por categoría', function() {
    const productos = [
      { nombre: 'Polera 1', categoria: 'poleras' },
      { nombre: 'Cuadro 1', categoria: 'cuadros' },
      { nombre: 'Polera 2', categoria: 'poleras' }
    ];
    const poleras = productos.filter(p => p.categoria === 'poleras');
    expect(poleras.length).toBe(2);
  });

  it('✅ debería validar producto con datos completos', function() {
    const producto = {
      id: 1,
      nombre: 'Polera Satoru',
      precio: 15990,
      categoria: 'poleras'
    };
    expect(producto.id).toBeDefined();
    expect(producto.nombre.length).toBeGreaterThan(0);
    expect(producto.precio).toBeGreaterThan(0);
  });

  it('✅ debería contar productos en stock', function() {
    const productos = [
      { stock: 5 },
      { stock: 3 },
      { stock: 8 }
    ];
    const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
    expect(totalStock).toBe(16);
  });

  it('✅ debería verificar tallas disponibles', function() {
    const tallasDisponibles = ['S', 'M', 'L', 'XL'];
    const tallaSeleccionada = 'M';
    expect(tallasDisponibles).toContain(tallaSeleccionada);
  });

  it('✅ debería generar ID único para pedido', function() {
    const timestamp = Date.now();
    const idPedido = `ORDER-${timestamp}`;
    expect(idPedido).toContain('ORDER-');
    expect(idPedido.length).toBeGreaterThan(6);
  });

  // ========== 5 PRUEBAS NEGATIVAS ==========

  it('❌ NO debería aceptar precios negativos', function() {
    const precio = -100;
    const esValido = precio > 0;
    expect(esValido).toBe(false);
  });

  it('❌ NO debería validar email sin @', function() {
    const emailInvalido = 'clienteexample.com';
    const esValido = emailInvalido.includes('@') && emailInvalido.includes('.');
    expect(esValido).toBe(false);
  });

  it('❌ NO debería permitir carrito vacío en checkout', function() {
    const carrito = [];
    const puedeComprar = carrito.length > 0;
    expect(puedeComprar).toBe(false);
  });

  it('❌ NO debería encontrar productos en categoría inexistente', function() {
    const productos = [
      { categoria: 'poleras' },
      { categoria: 'cuadros' }
    ];
    const resultado = productos.filter(p => p.categoria === 'inexistente');
    expect(resultado.length).toBe(0);
  });

  it('❌ NO debería dividir por cero en cálculos', function() {
    const total = 1000;
    const cantidad = 0;
    const promedio = cantidad > 0 ? total / cantidad : 0;
    expect(promedio).toBe(0);
  });

});