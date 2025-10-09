# Nueva Estructura de Base de Datos - UserPoints

## Cambio Realizado

Se modificó la relación de la tabla `UserPoints` para que esté conectada a `UserSport` en lugar de `User` directamente.

### Antes (Estructura Anterior)
```
User (1) ←→ (1) UserPoints
User (1) ←→ (N) UserSport (N) ←→ (1) Sport
```

**Problema:** Un usuario solo podía tener un puntaje global, sin importar cuántos deportes practicara.

### Después (Nueva Estructura)
```
User (1) ←→ (N) UserSport (N) ←→ (1) Sport
                ↓
            UserPoints (1:1)
```

**Beneficio:** Un usuario puede tener un puntaje diferente para cada deporte que practique.

## Ejemplo Práctico

### Usuario: Juan Pérez
- **Deporte:** Fútbol → Puntos: 1000/1000
- **Deporte:** Basketball → Puntos: 750/800
- **Deporte:** Tenis → Puntos: 500/500

Cada deporte tiene su propio puntaje independiente.

## Cambios en el Esquema Prisma

### Modelo UserSport (Modificado)
```prisma
model UserSport {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  sportId   String   @db.Uuid
  createdAt DateTime @default(now())
  
  // Relaciones
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  sport     Sport    @relation(fields: [sportId], references: [id], onDelete: Cascade)
  userPoints UserPoints?  // ← NUEVA RELACIÓN
  
  @@unique([userId, sportId])
}
```

### Modelo UserPoints (Modificado)
```prisma
model UserPoints {
  id           String   @id @default(uuid()) @db.Uuid
  userSportId  String   @unique @db.Uuid  // ← CAMBIÓ DE userId A userSportId
  initPoints   Int
  actualPoints Int
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Relaciones
  userSport    UserSport @relation(fields: [userSportId], references: [id], onDelete: Cascade)  // ← NUEVA RELACIÓN
}
```

### Modelo User (Modificado)
```prisma
model User {
  id           String   @id @default(uuid()) @db.Uuid
  name         String
  lastName     String
  username     String   @unique
  legalId      String   @unique
  email        String   @unique
  birthDate    DateTime
  age          Int
  password     String
  createdAt    DateTime @default(now())
  
  // Relaciones
  userSports   UserSport[]  // ← SE ELIMINÓ userPoints
}
```

## Migración Aplicada

Se creó la migración `20251009141747_change_userpoints_to_usersport_relation` que:
1. Eliminó la tabla UserPoints anterior
2. Creó la nueva tabla UserPoints con la relación a UserSport
3. Estableció las foreign keys correctas

## Impacto en el Código

### Consultas que necesitarán actualización:

**Antes:**
```javascript
// Obtener puntos de un usuario
const userPoints = await prisma.userPoints.findUnique({
  where: { userId: userId }
});
```

**Después:**
```javascript
// Obtener puntos de un usuario para un deporte específico
const userPoints = await prisma.userPoints.findUnique({
  where: { userSportId: userSportId }
});

// Obtener todos los puntos de un usuario
const userWithPoints = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    userSports: {
      include: {
        sport: true,
        userPoints: true
      }
    }
  }
});
```

## Próximos Pasos

1. ✅ **Base de datos actualizada** - La estructura está lista
2. 🔄 **Actualizar lógica del código** - Modificar las consultas y operaciones
3. 🧪 **Probar funcionalidad** - Verificar que todo funciona correctamente
4. 📝 **Actualizar documentación** - Reflejar los cambios en la API
