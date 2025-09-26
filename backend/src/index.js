require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Rutas
const userRoutes = require('./modules/users/UserController');
app.use('/auth', userRoutes);

// Servidor
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));
