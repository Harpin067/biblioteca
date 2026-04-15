import express from 'express';

import librosRouter from './routes/libros.js';
import autoresRouter from './routes/autores.js';
import categoriasRouter from './routes/categorias.js';

import { errorHandler } from './middlewares/errorHandler.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Biblioteca — servidor funcionando correctamente.');
});

app.use('/libros', librosRouter);
app.use('/autores', autoresRouter);
app.use('/categorias', categoriasRouter);

// Middleware de errores — SIEMPRE al final
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
});
