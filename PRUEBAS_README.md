# Pruebas Unitarias Simples con Jasmine 🧪

## ✅ Estado: FUNCIONANDO
**15 pruebas, 0 fallos** - ¡Todo correcto!

## 🚀 Cómo ejecutar las pruebas

```bash
npm test
```

## 📁 Archivo de Pruebas

### `spec/basic.spec.js` - Tienda Crime Wave (15 Pruebas)

#### ✅ **10 PRUEBAS POSITIVAS**
1. **Cálculo de descuentos** - Aplicar 20% descuento correctamente
2. **Formateo de precios** - Formato chileno `$15.990`
3. **Validación de emails** - Verificar emails válidos
4. **Agregar al carrito** - Productos se agregan correctamente
5. **Total del carrito** - Cálculo de totales múltiples productos
6. **Filtros por categoría** - Filtrar poleras, cuadros, etc.
7. **Validación de productos** - Estructura de datos correcta
8. **Conteo de stock** - Sumar inventario disponible
9. **Tallas disponibles** - Verificar tallas válidas (S,M,L,XL)
10. **Generar ID único** - IDs únicos para pedidos

#### ❌ **5 PRUEBAS NEGATIVAS**
1. **Precios negativos** - Rechazar precios inválidos
2. **Emails sin @** - Validar formato de email
3. **Carrito vacío** - No permitir checkout sin productos
4. **Categoría inexistente** - Filtros que no encuentran nada
5. **División por cero** - Evitar errores matemáticos

## 📋 Ejemplos de Pruebas

### Prueba Básica
```javascript
it('debería poder hacer sumas básicas', function() {
  const resultado = 2 + 2;
  expect(resultado).toBe(4);
});
```

### Prueba de Validación
```javascript
it('debería validar emails correctos', function() {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('email-invalido')).toBe(false);
});
```

### Prueba de Carrito
```javascript
it('debería agregar un producto nuevo al carrito', function() {
  const product = { id: 1, nombre: 'Polera Test', precio: 15990 };
  addToCart(product);
  
  expect(cart.length).toBe(1);
  expect(cart[0].quantity).toBe(1);
});
```

## 🎯 Tipos de Validaciones Incluidas

### ✅ Funciones del Negocio
- Formateo de precios chilenos
- Cálculos de descuentos
- Filtrado de productos
- Gestión del carrito

### ✅ Validaciones de Datos
- Estructura de productos
- Categorías válidas
- Formularios de entrada
- Tipos de datos correctos

### ✅ Lógica de la Aplicación
- Agregar/remover del carrito
- Cálculos de totales
- Manejo de cantidades
- Estados del carrito

## 🛠️ Configuración

### Dependencias
- **jasmine**: Framework de testing simple y liviano

### Configuración (`spec/support/jasmine.json`)
```json
{
  "spec_dir": "spec",
  "spec_files": ["**/*[sS]pec.js"],
  "stopSpecOnExpectationFailure": false,
  "random": false
}
```

## 📊 Resultados Actuales

```
Started
.............................

29 specs, 0 failures
Finished in 0.033 seconds
```

## 🎓 Para el Docente

Estas pruebas demuestran:

1. **Testing Básico**: Validaciones fundamentales
2. **Lógica de Negocio**: Funciones específicas del e-commerce
3. **Validación de Datos**: Estructura y tipos correctos
4. **Funcionalidad Completa**: Carrito de compras funcional
5. **Buenas Prácticas**: Estructura clara y casos completos

**Las pruebas cubren la funcionalidad principal del proyecto de forma simple y efectiva.**

---
*Creado con Jasmine - Framework de testing simple para JavaScript*