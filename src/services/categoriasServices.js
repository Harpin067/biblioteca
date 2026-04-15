// Servicio de categorías — capa de acceso a datos para biblioteca.categorias
import { pool } from '../db.js';

/*
  Modelo (biblioteca.categorias):
    id_categoria      SERIAL PK
    nombre_categoria  VARCHAR(100) NOT NULL
    clasificacion     VARCHAR(100) NOT NULL
*/

export const getAllCategorias = async () => {
    const result = await pool.query(
        'SELECT * FROM biblioteca.categorias ORDER BY id_categoria'
    );
    return result.rows;
};

export const getCategoriaById = async (id_categoria) => {
    const result = await pool.query(
        'SELECT * FROM biblioteca.categorias WHERE id_categoria = $1',
        [id_categoria]
    );

    if (result.rowCount === 0) {
        const error = new Error('Categoría no encontrada');
        error.status = 404;
        throw error;
    }
    return result.rows[0];
};

export const createCategoria = async (nombre_categoria, clasificacion) => {
    const query = `
        INSERT INTO biblioteca.categorias (nombre_categoria, clasificacion)
        VALUES ($1, $2)
        RETURNING *`;
    const result = await pool.query(query, [nombre_categoria, clasificacion]);
    return result.rows[0];
};

export const updateCategoria = async (categoria) => {
    const query = `
        UPDATE biblioteca.categorias
        SET nombre_categoria = $1,
            clasificacion = $2
        WHERE id_categoria = $3
        RETURNING *`;
    const result = await pool.query(query, categoria);

    if (result.rowCount === 0) {
        const error = new Error('Categoría no encontrada');
        error.status = 404;
        throw error;
    }
    return result.rows[0];
};

export const deleteCategoria = async (id_categoria) => {
    const existente = await pool.query(
        'SELECT * FROM biblioteca.categorias WHERE id_categoria = $1',
        [id_categoria]
    );

    if (existente.rowCount === 0) {
        const error = new Error('Categoría no encontrada');
        error.status = 404;
        throw error;
    }

    try {
        await pool.query('DELETE FROM biblioteca.categorias WHERE id_categoria = $1', [id_categoria]);
    } catch (err) {
        if (err.code === '23503') {
            const error = new Error('No se puede eliminar: existen libros asociados a esta categoría');
            error.status = 409;
            throw error;
        }
        throw err;
    }
    return { message: 'Categoría eliminada correctamente', categoria: existente.rows[0] };
};
