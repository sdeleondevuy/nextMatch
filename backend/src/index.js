import dotenv from "dotenv";
dotenv.config();

console.log("DATABASE_URL from process.env:", process.env.DATABASE_URL);

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
app.use(express.json());

// Rutas
import authRoutes from './routes/authRoutes.js';
app.use('/auth', authRoutes);

// Servidor
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));