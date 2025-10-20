# 🎯 Presentación: Pruebas Unitarias con Jasmine
## Guía para Explicar el Framework de Testing

---

## 📋 **ESTRUCTURA DE LA PRESENTACIÓN**

### 1. **INTRODUCCIÓN** (2-3 minutos)
### 2. **QUÉ SON LAS PRUEBAS UNITARIAS** (3-4 minutos)
### 3. **DEMOSTRACIÓN PRÁCTICA** (5-6 minutos)
### 4. **CASOS DE USO ESPECÍFICOS** (4-5 minutos)
### 5. **CONCLUSIONES** (2 minutos)

---

## 🎤 **1. INTRODUCCIÓN**

### **Slide 1: Título**
```
"Implementación de Pruebas Unitarias en React
Framework Jasmine para E-commerce"

Presentado por: [Tu Nombre]
Proyecto: Crime Wave Store
```

### **Slide 2: Objetivos**
```
🎯 Objetivos de la Presentación:

✅ Demostrar la implementación de pruebas unitarias
✅ Mostrar casos de uso reales del proyecto
✅ Explicar la metodología de testing aplicada
✅ Validar la funcionalidad del código
```

### **Lo que dices:**
> "Hoy voy a presentar la implementación de pruebas unitarias en nuestro proyecto de e-commerce. He desarrollado un framework completo de testing que valida la funcionalidad principal de la aplicación."

---

## 🧪 **2. QUÉ SON LAS PRUEBAS UNITARIAS**

### **Slide 3: Definición**
```
🔬 ¿Qué son las Pruebas Unitarias?

• Son pruebas automatizadas que validan pequeñas partes del código
• Verifican que cada función opere correctamente
• Se ejecutan de forma aislada e independiente
• Detectan errores temprano en el desarrollo
```

### **Slide 4: Beneficios**
```
💡 Beneficios de las Pruebas Unitarias:

🐛 Detección temprana de bugs
🔄 Refactoring seguro
📚 Documentación del código
⚡ Mayor confianza en el código
🚀 Desarrollo más eficiente
```

### **Slide 5: Framework Jasmine**
```
🛠️ ¿Por qué Jasmine?

• Framework simple y liviano
• Sintaxis clara y legible
• No requiere configuración compleja
• Ideal para JavaScript/Node.js
• Ampliamente usado en la industria
```

### **Lo que dices:**
> "Las pruebas unitarias son fundamentales en el desarrollo moderno. Permiten validar que cada función de nuestro código funcione correctamente de forma aislada. Elegí Jasmine por su simplicidad y claridad."

---

## 💻 **3. DEMOSTRACIÓN PRÁCTICA**

### **Slide 6: Configuración del Proyecto**
```
📁 Estructura del Proyecto:

proyecto/
├── src/                    # Código fuente
├── spec/                   # Pruebas unitarias
│   ├── basic.spec.js      # Pruebas básicas
│   ├── utils.spec.js      # Funciones utilitarias
│   ├── data.spec.js       # Validación de datos
│   └── cart.spec.js       # Carrito de compras
└── package.json           # Configuración
```

### **Slide 7: Comando de Ejecución**
```
🚀 Ejecutar las Pruebas:

$ npm test

Resultado:
Started
.............................

29 specs, 0 failures ✅
Finished in 0.033 seconds
```

### **Slide 8: Ejemplo de Prueba Básica**
```javascript
// Ejemplo: Prueba de suma básica
describe('Operaciones Matemáticas', function() {
  
  it('debería sumar dos números correctamente', function() {
    const resultado = 2 + 2;
    expect(resultado).toBe(4);
  });
  
});
```

### **Slide 9: Anatomía de una Prueba**
```javascript
describe('Grupo de Pruebas', function() {     // Suite
  
  it('descripción de la prueba', function() { // Spec
    // Arrange (Preparar)
    const producto = { precio: 1000 };
    
    // Act (Ejecutar)
    const resultado = calcularDescuento(producto, 10);
    
    // Assert (Verificar)
    expect(resultado).toBe(900);
  });
  
});
```

### **Lo que dices:**
> "Aquí vemos la estructura básica. Tengo 29 pruebas organizadas en 4 archivos. Cada prueba sigue el patrón Arrange-Act-Assert: preparamos los datos, ejecutamos la función, y verificamos el resultado."

**DEMOSTRACIÓN EN VIVO:**
1. Abre la terminal
2. Ejecuta `npm test`
3. Muestra el resultado exitoso
4. Abre uno de los archivos spec y explica la estructura

---

## 🎯 **4. CASOS DE USO ESPECÍFICOS**

### **Slide 10: Validación de Precios**
```javascript
// Caso 1: Formateo de precios chilenos
describe('formatPrice', function() {
  it('debería formatear precios correctamente', function() {
    expect(formatPrice(15990)).toBe('$15.990');
    expect(formatPrice(1000)).toBe('$1.000');
  });
});
```

### **Slide 11: Validación de Emails**
```javascript
// Caso 2: Validación de emails
describe('validateEmail', function() {
  it('debería validar emails correctos', function() {
    expect(validateEmail('test@example.com')).toBe(true);
  });
  
  it('debería rechazar emails incorrectos', function() {
    expect(validateEmail('email-invalido')).toBe(false);
  });
});
```

### **Slide 12: Carrito de Compras**
```javascript
// Caso 3: Funcionalidad del carrito
describe('Carrito de Compras', function() {
  it('debería agregar productos correctamente', function() {
    const producto = {id: 1, nombre: 'Polera', precio: 15990};
    addToCart(producto);
    
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(1);
  });
});
```

### **Slide 13: Cálculos Complejos**
```javascript
// Caso 4: Cálculos del carrito
describe('Cálculos', function() {
  it('debería calcular el total correctamente', function() {
    // Producto 1: 2 unidades × $10.000 = $20.000
    // Producto 2: 1 unidad × $15.000 = $15.000
    // Total esperado: $35.000
    
    expect(getCartTotal()).toBe(35000);
  });
});
```

### **Slide 14: Cobertura de Pruebas**
```
📊 Cobertura del Proyecto:

✅ Operaciones básicas (5 pruebas)
✅ Funciones utilitarias (8 pruebas)  
✅ Validación de datos (9 pruebas)
✅ Carrito de compras (7 pruebas)

Total: 29 pruebas, 100% exitosas
```

### **Lo que dices:**
> "He implementado pruebas para los casos más críticos del e-commerce: formateo de precios, validación de datos, y especialmente la lógica del carrito de compras, que es el corazón del negocio."

---

## 🏆 **5. CONCLUSIONES**

### **Slide 15: Logros Alcanzados**
```
🎯 Logros del Proyecto:

✅ 29 pruebas unitarias implementadas
✅ 100% de éxito en todas las pruebas
✅ Cobertura de funcionalidad crítica
✅ Framework simple y mantenible
✅ Integración con el flujo de desarrollo
```

### **Slide 16: Impacto en el Desarrollo**
```
📈 Beneficios Obtenidos:

🔒 Mayor confianza en el código
⚡ Detección temprana de errores  
📚 Documentación automática
🔄 Facilita el mantenimiento
🚀 Mejora la calidad del software
```

### **Slide 17: Próximos Pasos**
```
🔮 Futuras Mejoras:

• Integración con CI/CD
• Pruebas de integración
• Cobertura de código
• Pruebas de rendimiento
• Testing automatizado
```

### **Lo que dices:**
> "Las pruebas unitarias han demostrado ser una herramienta fundamental para garantizar la calidad del código. Con 29 pruebas exitosas, tenemos una base sólida para el desarrollo futuro."

---

## 🎤 **TIPS PARA LA PRESENTACIÓN**

### **Antes de Empezar:**
1. ✅ Verifica que las pruebas pasen: `npm test`
2. ✅ Ten el código abierto y listo para mostrar
3. ✅ Prepara ejemplos específicos para demostrar
4. ✅ Practica la transición entre slides y código

### **Durante la Presentación:**
1. **Demuestra en vivo**: Ejecuta `npm test` 
2. **Explica el código**: Muestra ejemplos reales
3. **Conecta con el negocio**: Relaciona con funcionalidad real
4. **Responde preguntas**: Mantén los archivos abiertos

### **Frases Clave para Usar:**
- *"Como pueden ver, todas las pruebas pasan exitosamente..."*
- *"Este test valida una funcionalidad crítica del e-commerce..."*
- *"La sintaxis de Jasmine es muy clara y legible..."*
- *"Esto nos da confianza para hacer cambios en el código..."*

### **Posibles Preguntas del Profesor:**
**P: ¿Por qué elegiste Jasmine?**
**R:** "Jasmine es simple, no requiere configuración compleja, tiene sintaxis clara y es ampliamente usado en la industria."

**P: ¿Cómo validas la calidad de las pruebas?**
**R:** "Las pruebas cubren casos positivos y negativos, validan funcionalidad crítica del negocio, y todas pasan exitosamente."

**P: ¿Qué pasa si una prueba falla?**
**R:** "El framework detiene la ejecución y muestra exactamente qué falló, permitiendo corregir el error rápidamente."

---

## 📱 **DEMO SCRIPT RECOMENDADO**

```bash
# 1. Mostrar estructura
ls spec/

# 2. Ejecutar todas las pruebas
npm test

# 3. Mostrar una prueba específica
cat spec/cart.spec.js

# 4. Ejecutar una prueba individual (si es posible)
npx jasmine spec/basic.spec.js
```

---

**🎯 Duración recomendada: 15-20 minutos**
**💡 Enfoque: Demostración práctica con ejemplos reales**
**🏆 Objetivo: Mostrar competencia técnica y buenas prácticas**