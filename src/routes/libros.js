// Router de libros
import { Router } from 'express';

import * as libroController from '../controllers/librosController.js';
import {
    runValidations,
    createLibroValidators,
    updateLibroValidators,
    idLibroParamValidator
} from '../middlewares/validators.js';

const router = Router();

// GET /libros
router.get('/', libroController.getObtenerTodosLosLibros);

// GET /libros/buscarPorTitulo/:titulo
router.get('/buscarPorTitulo/:titulo', libroController.getBuscarPorTitulo);

// Búsquedas adicionales
router.get('/buscarPorAnio/:anio', libroController.getBuscarPorAnio);
router.get('/buscarPorAutor/:autor', libroController.getBuscarPorAutor);
router.get('/buscarPorCategoria/:categoria', libroController.getBuscarPorCategoria);
router.get('/buscarPorClasificacion/:clasificacion', libroController.getBuscarPorClasificacion);

// GET /libros/:id_libro
router.get(
    '/:id_libro',
    runValidations(idLibroParamValidator),
    libroController.getObtenerLibroPorId
);

// POST /libros
router.post(
    '/',
    runValidations(createLibroValidators),
    libroController.postCrearLibro
);

// PUT /libros/:id_libro
router.put(
    '/:id_libro',
    runValidations([...idLibroParamValidator, ...updateLibroValidators]),
    libroController.putActualizarLibro
);

// DELETE /libros/:id_libro
router.delete(
    '/:id_libro',
    runValidations(idLibroParamValidator),
    libroController.deleteEliminarLibro
);

export default router;
