// Validadores de entrada con express-validator
import { body, param, validationResult } from 'express-validator';

/*
  Helper: runValidations
  Ejecuta todas las validaciones del array sobre la request.
  Si alguna falla, responde 400 con la lista de errores.
*/
export const runValidations = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            await validation.run(req);
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            status: 'error',
            errors: errors.array()
        });
    };
};

// ==========================================
// LIBROS
// ==========================================
export const createLibroValidators = [
    body('titulo')
        .trim()
        .isLength({ min: 10 })
        .withMessage('El título debe tener al menos 10 caracteres'),

    body('anio_publicacion')
        .isInt({ gt: 1900 })
        .withMessage('El año de publicación debe ser un entero mayor a 1900'),

    body('autor_id')
        .isInt({ gt: 0 })
        .withMessage('autor_id debe ser un entero positivo'),

    body('categoria_id')
        .isInt({ gt: 0 })
        .withMessage('categoria_id debe ser un entero positivo'),

    body('resumen')
        .optional({ nullable: true })
        .isString()
        .withMessage('resumen debe ser texto')
];

export const updateLibroValidators = createLibroValidators;

export const idLibroParamValidator = [
    param('id_libro')
        .isInt({ gt: 0 })
        .withMessage('id_libro debe ser un entero positivo')
];

// ==========================================
// AUTORES
// ==========================================
export const createAutorValidators = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 255 }).withMessage('El nombre no puede exceder 255 caracteres'),

    body('nacionalidad')
        .optional({ nullable: true })
        .isLength({ max: 100 }).withMessage('La nacionalidad no puede exceder 100 caracteres'),

    body('biografia')
        .optional({ nullable: true })
        .isString().withMessage('biografia debe ser texto'),

    body('correo')
        .trim()
        .isEmail().withMessage('El correo no es válido')
        .isLength({ max: 255 }).withMessage('El correo no puede exceder 255 caracteres')
];

export const updateAutorValidators = createAutorValidators;

export const idAutorParamValidator = [
    param('id_autor')
        .isInt({ gt: 0 })
        .withMessage('id_autor debe ser un entero positivo')
];

// ==========================================
// CATEGORIAS
// ==========================================
export const createCategoriaValidators = [
    body('nombre_categoria')
        .trim()
        .notEmpty().withMessage('El nombre de la categoría es obligatorio')
        .isLength({ max: 100 }).withMessage('No puede exceder 100 caracteres'),

    body('clasificacion')
        .trim()
        .notEmpty().withMessage('La clasificación es obligatoria')
        .isLength({ max: 100 }).withMessage('No puede exceder 100 caracteres')
];

export const updateCategoriaValidators = createCategoriaValidators;

export const idCategoriaParamValidator = [
    param('id_categoria')
        .isInt({ gt: 0 })
        .withMessage('id_categoria debe ser un entero positivo')
];
