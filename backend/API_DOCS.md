# API Documentation - NextMatch Backend

## Base URL
```
http://localhost:5000
```

## Endpoints

### Health Check
- **GET** `/health`
- **Descripción**: Verificar estado del servidor
- **Respuesta**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Autenticación

#### Registro de Usuario
- **POST** `/auth/register`
- **Descripción**: Registrar nuevo usuario
- **Body**:
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```
- **Respuesta Exitosa** (201):
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Login de Usuario
- **POST** `/auth/login`
- **Descripción**: Iniciar sesión
- **Body**:
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```
- **Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Obtener Perfil
- **GET** `/auth/me`
- **Descripción**: Obtener perfil del usuario autenticado
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Actualizar Perfil
- **PUT** `/auth/profile`
- **Descripción**: Actualizar perfil del usuario
- **Headers**: `Authorization: Bearer <token>`
- **Body** (campos opcionales):
```json
{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com"
}
```
- **Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Códigos de Error

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "message": "Formato de email inválido"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Credenciales inválidas",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Token inválido o expirado",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Validaciones

### Registro
- **name**: 2-50 caracteres, obligatorio
- **email**: formato válido, obligatorio, único
- **password**: 6-100 caracteres, obligatorio

### Login
- **email**: formato válido, obligatorio
- **password**: obligatorio

### Actualizar Perfil
- **name**: 2-50 caracteres, opcional
- **email**: formato válido, opcional, único
