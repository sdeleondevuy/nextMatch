import 'dotenv/config';
import express from 'express';
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Rutas
import authRoutes from './routes/authRoutes.js';
app.use('/auth', authRoutes);

// Servidor
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));
