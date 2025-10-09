# Scripts de Limpieza de Base de Datos

Este directorio contiene scripts para limpiar los datos de la base de datos de manera segura, respetando las foreign keys y manteniendo la estructura de las tablas intacta.

## Scripts Disponibles

### 1. `cleanDatabase.js` - Limpieza Completa Simple
Limpia todas las tablas de la base de datos de una vez.

**Uso:**
```bash
# Desde la carpeta backend
npm run clean-db

# O directamente
node scripts/cleanDatabase.js
```

**Qué hace:**
- Limpia todas las tablas en el orden correcto para respetar foreign keys
- Mantiene la estructura de las tablas intacta
- Muestra mensajes informativos del progreso

### 2. `cleanDatabaseAdvanced.js` - Limpieza Avanzada
Script más flexible que permite limpiar tablas específicas o ver estadísticas.

**Uso:**
```bash
# Limpiar todas las tablas
npm run clean-db-advanced all

# Limpiar una tabla específica
npm run clean-db-advanced table User
npm run clean-db-advanced table Sport
npm run clean-db-advanced table UserSport
npm run clean-db-advanced table UserPoints

# Ver estadísticas de la base de datos
npm run db-stats

# Ver ayuda
npm run clean-db-advanced
```

## Orden de Limpieza

Los scripts limpian las tablas en el siguiente orden para respetar las foreign keys:

1. **UserPoints** - Primero (depende de User)
2. **UserSport** - Segundo (depende de User y Sport)
3. **User** - Tercero (tabla principal)
4. **Sport** - Cuarto (tabla independiente)

## Tablas Disponibles

- **User**: Usuarios del sistema
- **Sport**: Deportes disponibles
- **UserSport**: Relación muchos-a-muchos entre usuarios y deportes
- **UserPoints**: Puntos de los usuarios

## ⚠️ Advertencias

- **ESTOS SCRIPTS ELIMINAN TODOS LOS DATOS** de las tablas especificadas
- La estructura de las tablas se mantiene intacta
- No se puede deshacer la operación una vez ejecutada
- Asegúrate de tener un backup si necesitas recuperar los datos

## Casos de Uso

### Desarrollo
```bash
# Limpiar todo para empezar de cero
npm run clean-db

# Crear deportes básicos
npm run seed-sports
```

### Testing
```bash
# Limpiar solo usuarios para pruebas
npm run clean-db-advanced table User
```

### Debugging
```bash
# Ver cuántos registros hay antes de limpiar
npm run db-stats
```

## Estructura de la Base de Datos

```
User (1) ←→ (N) UserSport (N) ←→ (1) Sport
  ↓
UserPoints (1:1) ← UserSport
```

**Nueva estructura (actualizada):**
- **UserPoints** ahora está relacionado con **UserSport** en lugar de **User** directamente
- Esto permite que un usuario tenga múltiples puntajes (uno por cada deporte que haya seleccionado)
- Cada relación usuario-deporte puede tener su propio puntaje independiente

Las foreign keys están configuradas con `onDelete: Cascade`, por lo que eliminar un usuario también elimina sus puntos y relaciones con deportes.
