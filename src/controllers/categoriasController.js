// Controlador de categorías
import * as categoriaService from '../services/categoriasServices.js';

export const getObtenerTodasLasCategorias = async (req, res, next) => {
    try {
        const result = await categoriaService.getAllCategorias();
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

export const getObtenerCategoriaPorId = async (req, res, next) => {
    try {
        const { id_categoria } = req.params;
        const result = await categoriaService.getCategoriaById(id_categoria);
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

export const postCrearCategoria = async (req, res, next) => {
    try {
        const { nombre_categoria, clasificacion } = req.body;
        const nueva = await categoriaService.createCategoria(nombre_categoria, clasificacion);
        res.status(201).json(nueva);
    } catch (err) {
        return next(err);
    }
};

export const putActualizarCategoria = async (req, res, next) => {
    try {
        const { nombre_categoria, clasificacion } = req.body;
        const { id_categoria } = req.params;
        const categoria = [nombre_categoria, clasificacion, id_categoria];
        const actualizada = await categoriaService.updateCategoria(categoria);
        res.status(200).json(actualizada);
    } catch (err) {
        return next(err);
    }
};

export const deleteEliminarCategoria = async (req, res, next) => {
    try {
        const { id_categoria } = req.params;
        const result = await categoriaService.deleteCategoria(id_categoria);
        res.status(200).json(result);
    } catch (err) {
        return next(err);
    }
};
