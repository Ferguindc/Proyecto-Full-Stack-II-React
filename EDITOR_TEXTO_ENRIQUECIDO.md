# 📝 Editor de Texto Enriquecido - Crime Wave

## ✨ Características Implementadas

Ahora puedes crear descripciones de productos con formato enriquecido usando HTML.

### 🎯 Ubicación

El editor está disponible en:
- **Agregar Producto**: `/formulario-add-producto`
- **Editar Producto**: `/formulario-editar-producto/:id`

### 🛠️ Funcionalidades del Editor

#### Botón de Alternancia
- **"Editor Rico"**: Activa el editor con formato
- **"Modo Simple"**: Vuelve al textarea normal

#### Herramientas de Formato

1. **Texto**:
   - **Negrita** (Bold)
   - *Cursiva* (Italic)
   - <u>Subrayado</u> (Underline)

2. **Estructura**:
   - **H1**: Títulos principales
   - **H2**: Subtítulos
   - **Párrafo**: Texto normal

3. **Listas**:
   - Lista con viñetas (•)
   - Lista numerada (1, 2, 3...)

4. **Enlaces**:
   - Insertar enlaces web
   - Se abre un prompt para ingresar la URL

5. **Utilidades**:
   - **Limpiar Formato**: Elimina todo el formato del texto seleccionado

### 📋 Cómo Usar

1. Ve a agregar o editar un producto
2. En el campo "Descripción", haz clic en **"Editor Rico"**
3. Escribe tu texto y usa los botones de la barra para dar formato
4. El HTML se guarda automáticamente
5. En la página del producto (SingleProductPage), se renderiza con el formato aplicado

### 💡 Ejemplo de Uso

```html
<h2>Características del Producto</h2>
<p>Esta polera está confeccionada con materiales de <strong>alta calidad</strong>.</p>
<h3>Beneficios:</h3>
<ul>
  <li>100% algodón orgánico</li>
  <li>Tela transpirable</li>
  <li>Colores duraderos</li>
</ul>
```

### 🎨 Estilos Aplicados

- Los títulos H2 son de **1.5rem** en negrita
- Los subtítulos H3 son de **1.25rem** en semi-negrita
- Los párrafos tienen interlineado de **1.7**
- Las listas tienen margen izquierdo de **2rem**
- Los enlaces son de color azul con hover effect

### ⚙️ Modo de Compatibilidad

Si prefieres escribir HTML directamente:
1. Mantén el **"Modo Simple"**
2. Escribe tu HTML en el textarea
3. Se renderizará correctamente en la página del producto

### 🔄 Renderizado en SingleProductPage

La descripción se renderiza de dos formas:

1. **Con HTML** (si contiene etiquetas `<`):
   - Se renderiza con `dangerouslySetInnerHTML`
   - Aplica estilos de `.product-description-html`

2. **Sin HTML** (texto plano):
   - Se muestra como texto normal
   - Agrega descripción por defecto según tipo de producto

### 🚀 Características Técnicas

- **Sin dependencias externas**: Usa `contentEditable` nativo
- **Compatible con React 19**: No requiere librerías adicionales
- **Ligero y rápido**: Usa `document.execCommand()`
- **Actualización en tiempo real**: Los cambios se guardan automáticamente

### 📝 Notas Importantes

- El contenido se guarda como HTML en la base de datos
- Es compatible con texto plano también
- Los estilos son responsive y se adaptan a todos los dispositivos
- El editor tiene altura máxima de 400px con scroll automático

¡Disfruta creando descripciones de productos más atractivas! 🎉
