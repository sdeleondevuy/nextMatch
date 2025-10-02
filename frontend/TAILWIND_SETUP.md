# 🎨 Setup de Tailwind CSS - JSM (JuegoSetMatch)

## ✅ Archivos Creados

He creado los siguientes archivos para implementar tu paleta de colores:

### 1. **tailwind.config.js** - Configuración personalizada
- Paleta de colores: Azul (header), Verde (botones), Amarillo (hover)
- Fuentes: Poppins y Montserrat
- Componentes personalizados

### 2. **postcss.config.js** - Configuración de PostCSS
- Integración con Tailwind y Autoprefixer

### 3. **src/index.css** - Estilos base con Tailwind
- Importación de fuentes Google Fonts
- Componentes personalizados (btn-primary, btn-secondary, etc.)
- Variables de color personalizadas

### 4. **src/pages/Home.jsx** - Componente rediseñado
- Header azul con logo blanco
- Botones verdes con hover amarillo
- Background gris claro
- Typography Sans Serif (Poppins/Montserrat)
- Diseño responsive y moderno

## 🚀 Para Aplicar los Cambios

### 1. Instalar dependencias (si no están instaladas):
```bash
cd frontend
npm install
```

### 2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

### 3. Ver el resultado:
- Abre `http://localhost:3000`
- Deberías ver el nuevo diseño con:
  - Header azul con logo blanco
  - Botones verdes que cambian a amarillo en hover
  - Background gris claro
  - Typography Poppins/Montserrat

## 🎨 Paleta de Colores Implementada

- **Header**: Azul (`from-blue-600 to-blue-700`)
- **Botones Primarios**: Verde (`bg-green-500`) → Amarillo en hover (`hover:bg-yellow-400`)
- **Background**: Gris claro (`bg-gray-50`)
- **Typography**: Poppins/Montserrat (Sans Serif, Bold en títulos)

## 📱 Características del Diseño

- ✅ **Responsive**: Se adapta a móviles, tablets y desktop
- ✅ **Animaciones**: Hover effects, transiciones suaves
- ✅ **Componentes**: Cards, botones, gradientes
- ✅ **Estados**: Loading, autenticado/no autenticado
- ✅ **Footer**: Información de contacto y enlaces

## 🔧 Personalización

Si quieres ajustar colores o estilos, edita:
- `tailwind.config.js` para colores y fuentes
- `src/index.css` para componentes personalizados
- `src/pages/Home.jsx` para el layout específico

¡El diseño está listo para usar como plantilla base! 🎉
