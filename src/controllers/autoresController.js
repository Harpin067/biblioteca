// Controlador de autores
import * as autorService from '../services/autoresServices.js';

export const getObtenerTodosLosAutores = async (req, res, next) => {
    try {
        const result = await autorService.getAllAutores();
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

export const getObtenerAutorPorId = async (req, res, next) => {
    try {
        const { id_autor } = req.params;
        const result = await autorService.getAutorById(id_autor);
        res.json(result);
    } catch (err) {
        return next(err);
    }
};

export const postCrearAutor = async (req, res, next) => {
    try {
        const { nombre, nacionalidad, biografia, correo } = req.body;
        const nuevo = await autorService.createAutor(nombre, nacionalidad, biografia, correo);
        res.status(201).json(nuevo);
    } catch (err) {
        return next(err);
    }
};

export const putActualizarAutor = async (req, res, next) => {
    try {
        const { nombre, nacionalidad, biografia, correo } = req.body;
        const { id_autor } = req.params;
        const autor = [nombre, nacionalidad ?? null, biografia ?? null, correo, id_autor];
        const actualizado = await autorService.updateAutor(autor);
        res.status(200).json(actualizado);
    } catch (err) {
        return next(err);
    }
};

export const deleteEliminarAutor = async (req, res, next) => {
    try {
        const { id_autor } = req.params;
        const result = await autorService.deleteAutor(id_autor);
        res.status(200).json(result);
    } catch (err) {
        return next(err);
    }
};
