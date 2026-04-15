// Importamos todos los métodos del servicio de libros
import * as libroService from '../services/librosServices.js';

// ==========================================
// GET /libros  — Obtener todos los libros
// ==========================================
export const getObtenerTodosLosLibros = async (req, res, next) => {
    try {
        const result = await libroService.getAllLibros();
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

// ==========================================
// GET /libros/:id_libro
// ==========================================
export const getObtenerLibroPorId = async (req, res, next) => {
    try {
        const { id_libro } = req.params;
        const result = await libroService.getLibroById(id_libro);
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

// ==========================================
// GET /libros/buscarPorTitulo/:titulo
// ==========================================
export const getBuscarPorTitulo = async (req, res, next) => {
    try {
        const { titulo } = req.params;
        const result = await libroService.getLibrosByTitulo(titulo);
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

// GET /libros/buscarPorAnio/:anio
export const getBuscarPorAnio = async (req, res, next) => {
    try {
        const { anio } = req.params;
        const result = await libroService.getLibrosByAnio(anio);
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

// GET /libros/buscarPorAutor/:autor
export const getBuscarPorAutor = async (req, res, next) => {
    try {
        const { autor } = req.params;
        const result = await libroService.getLibrosByAutor(autor);
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

// GET /libros/buscarPorCategoria/:categoria
export const getBuscarPorCategoria = async (req, res, next) => {
    try {
        const { categoria } = req.params;
        const result = await libroService.getLibrosByCategoria(categoria);
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

// GET /libros/buscarPorClasificacion/:clasificacion
export const getBuscarPorClasificacion = async (req, res, next) => {
    try {
        const { clasificacion } = req.params;
        const result = await libroService.getLibrosByClasificacion(clasificacion);
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

// ==========================================
// POST /libros  — Crear un nuevo libro
// ==========================================
export const postCrearLibro = async (req, res, next) => {
    try {
        const { titulo, anio_publicacion, autor_id, categoria_id, resumen } = req.body;
        const nuevoLibro = await libroService.createLibro(
            titulo,
            anio_publicacion,
            autor_id,
            categoria_id,
            resumen
        );
        res.status(201).json(nuevoLibro);
    } catch (err) {
        return next(err);
    }
};

// ==========================================
// PUT /libros/:id_libro  — Actualizar libro
// ==========================================
export const putActualizarLibro = async (req, res, next) => {
    try {
        const { titulo, anio_publicacion, autor_id, categoria_id, resumen } = req.body;
        const { id_libro } = req.params;
        const libro = [titulo, anio_publicacion, autor_id, categoria_id, resumen ?? null, id_libro];
        const actualizado = await libroService.updateLibro(libro);
        res.status(200).json(actualizado);
    } catch (err) {
        return next(err);
    }
};

// ==========================================
// DELETE /libros/:id_libro  — Eliminar libro
// ==========================================
export const deleteEliminarLibro = async (req, res, next) => {
    try {
        const { id_libro } = req.params;
        const result = await libroService.deleteLibro(id_libro);
        res.status(200).json(result);
    } catch (err) {
        return next(err);
    }
};
