// Servicio de autores — capa de acceso a datos para biblioteca.autores
import { pool } from '../db.js';

/*
  Modelo (biblioteca.autores):
    id_autor       SERIAL PK
    nombre         VARCHAR(255) NOT NULL
    nacionalidad   VARCHAR(100)
    biografia      TEXT
    correo         VARCHAR(255) NOT NULL UNIQUE
*/

export const getAllAutores = async () => {
    const result = await pool.query(
        'SELECT * FROM biblioteca.autores ORDER BY id_autor'
    );
    return result.rows;
};

export const getAutorById = async (id_autor) => {
    const result = await pool.query(
        'SELECT * FROM biblioteca.autores WHERE id_autor = $1',
        [id_autor]
    );

    if (result.rowCount === 0) {
        const error = new Error('Autor no encontrado');
        error.status = 404;
        throw error;
    }
    return result.rows[0];
};

export const createAutor = async (nombre, nacionalidad, biografia, correo) => {
    const query = `
        INSERT INTO biblioteca.autores (nombre, nacionalidad, biografia, correo)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
    try {
        const result = await pool.query(query, [nombre, nacionalidad ?? null, biografia ?? null, correo]);
        return result.rows[0];
    } catch (err) {
        if (err.code === '23505') {
            const error = new Error('El correo ya está registrado');
            error.status = 409;
            throw error;
        }
        throw err;
    }
};

export const updateAutor = async (autor) => {
    const query = `
        UPDATE biblioteca.autores
        SET nombre = $1,
            nacionalidad = $2,
            biografia = $3,
            correo = $4
        WHERE id_autor = $5
        RETURNING *`;
    try {
        const result = await pool.query(query, autor);
        if (result.rowCount === 0) {
            const error = new Error('Autor no encontrado');
            error.status = 404;
            throw error;
        }
        return result.rows[0];
    } catch (err) {
        if (err.code === '23505') {
            const error = new Error('El correo ya está registrado');
            error.status = 409;
            throw error;
        }
        throw err;
    }
};

export const deleteAutor = async (id_autor) => {
    const existente = await pool.query(
        'SELECT * FROM biblioteca.autores WHERE id_autor = $1',
        [id_autor]
    );

    if (existente.rowCount === 0) {
        const error = new Error('Autor no encontrado');
        error.status = 404;
        throw error;
    }

    await pool.query('DELETE FROM biblioteca.autores WHERE id_autor = $1', [id_autor]);
    return { message: 'Autor eliminado correctamente', autor: existente.rows[0] };
};
