import { Router } from 'express';

import * as autorController from '../controllers/autoresController.js';
import {
    runValidations,
    createAutorValidators,
    updateAutorValidators,
    idAutorParamValidator
} from '../middlewares/validators.js';

const router = Router();

router.get('/', autorController.getObtenerTodosLosAutores);

router.get(
    '/:id_autor',
    runValidations(idAutorParamValidator),
    autorController.getObtenerAutorPorId
);

router.post(
    '/',
    runValidations(createAutorValidators),
    autorController.postCrearAutor
);

router.put(
    '/:id_autor',
    runValidations([...idAutorParamValidator, ...updateAutorValidators]),
    autorController.putActualizarAutor
);

router.delete(
    '/:id_autor',
    runValidations(idAutorParamValidator),
    autorController.deleteEliminarAutor
);

export default router;
