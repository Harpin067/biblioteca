import { Router } from 'express';

import * as categoriaController from '../controllers/categoriasController.js';
import {
    runValidations,
    createCategoriaValidators,
    updateCategoriaValidators,
    idCategoriaParamValidator
} from '../middlewares/validators.js';

const router = Router();

router.get('/', categoriaController.getObtenerTodasLasCategorias);

router.get(
    '/:id_categoria',
    runValidations(idCategoriaParamValidator),
    categoriaController.getObtenerCategoriaPorId
);

router.post(
    '/',
    runValidations(createCategoriaValidators),
    categoriaController.postCrearCategoria
);

router.put(
    '/:id_categoria',
    runValidations([...idCategoriaParamValidator, ...updateCategoriaValidators]),
    categoriaController.putActualizarCategoria
);

router.delete(
    '/:id_categoria',
    runValidations(idCategoriaParamValidator),
    categoriaController.deleteEliminarCategoria
);

export default router;
