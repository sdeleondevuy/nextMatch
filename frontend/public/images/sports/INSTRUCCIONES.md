# 📸 Instrucciones para Agregar Imágenes de Deportes

## 📁 Ubicación
Coloca todas las imágenes de deportes en esta carpeta:
```
frontend/public/images/sports/
```

## 🎯 Naming Convention (¡IMPORTANTE!)

El nombre del archivo **DEBE** coincidir exactamente con el nombre del deporte en la base de datos, pero:
- En **minúsculas**
- Reemplazando **espacios** por **guiones** (-)

### Ejemplos:

| Nombre en DB | Nombre del archivo |
|--------------|-------------------|
| Tenis Singles | `tenis-singles.png` |
| Tenis Dobles | `tenis-dobles.png` |
| Pickleball | `pickleball.png` |
| Pádel | `padel.png` |
| Fútbol 5 | `futbol-5.png` |
| Básquetbol | `basquetbol.png` |

## 🖼️ Especificaciones Técnicas

### Formato:
- **Extensión**: `.png` (obligatorio)
- **Con transparencia**: Preferible para mejor integración

### Dimensiones:
- **Tamaño recomendado**: 800x800px (cuadrado)
- **Mínimo aceptable**: 400x400px
- **Máximo recomendado**: 1200x1200px

### Peso:
- **Óptimo**: 100-300 KB
- **Máximo**: 500 KB por imagen

### Contenido:
- **Fondo**: Transparente o blanco
- **Centrado**: El objeto/icono debe estar centrado
- **Padding**: Dejar ~10% de espacio en los bordes
- **Estilo**: Limpio, moderno, iconográfico

## 🔄 Placeholder Automático

Si una imagen NO existe, el sistema mostrará automáticamente el logo de JSM como placeholder.

## ✅ Checklist para Agregar un Deporte

1. [ ] Verificar el nombre exacto del deporte en la base de datos
2. [ ] Convertir el nombre a minúsculas
3. [ ] Reemplazar espacios por guiones
4. [ ] Agregar `.png` al final
5. [ ] Verificar que la imagen cumple con las especificaciones
6. [ ] Copiar la imagen a `frontend/public/images/sports/`
7. [ ] Refrescar el navegador para ver los cambios

## 🎨 Ejemplos Visuales

```
frontend/public/images/sports/
├── tenis-singles.png
├── tenis-dobles.png
├── pickleball.png
├── padel.png
└── (agregar más deportes aquí)
```

## 🐛 Troubleshooting

**Problema**: La imagen no se muestra
- ✓ Verificar que el nombre del archivo es exactamente correcto
- ✓ Verificar que la extensión es `.png` (no `.jpg`, `.jpeg`, etc.)
- ✓ Verificar que la imagen está en la carpeta correcta
- ✓ Refrescar el navegador (Ctrl+F5)

**Problema**: La imagen se ve cortada o mal posicionada
- ✓ Asegurarse de que la imagen es cuadrada (misma altura y anchura)
- ✓ Verificar que hay padding alrededor del objeto principal
- ✓ La imagen debe estar centrada

## 📝 Notas Adicionales

- El sistema detecta automáticamente las imágenes por nombre de deporte
- No es necesario modificar código para agregar nuevas imágenes
- Las imágenes se cargan dinámicamente según los deportes configurados del usuario
- El hover effect (zoom y overlay) se aplica automáticamente

