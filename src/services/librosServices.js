// Servicio de libros — capa de acceso a datos para biblioteca.libros
import { pool } from '../db.js';

/*
  Modelo (biblioteca.libros):
    id_libro           SERIAL PK
    titulo             VARCHAR(255) NOT NULL  (len(trim) >= 10)
    anio_publicacion   INT NOT NULL           (> 1900)
    autor_id           INT NOT NULL FK -> biblioteca.autores(id_autor)      ON DELETE CASCADE
    categoria_id       INT NOT NULL FK -> biblioteca.categorias(id_categoria) ON DELETE RESTRICT
    resumen            TEXT
*/

const SELECT_LIBRO_CON_RELACIONES = `
    SELECT  l.id_libro,
            l.titulo,
            l.anio_publicacion,
            l.resumen,
            l.autor_id,
            a.nombre        AS autor_nombre,
            a.nacionalidad  AS autor_nacionalidad,
            l.categoria_id,
            c.nombre_categoria,
            c.clasificacion
    FROM biblioteca.libros l
    INNER JOIN biblioteca.autores     a ON a.id_autor     = l.autor_id
    INNER JOIN biblioteca.categorias  c ON c.id_categoria = l.categoria_id
`;

export const getAllLibros = async () => {
    const result = await pool.query(`${SELECT_LIBRO_CON_RELACIONES} ORDER BY l.id_libro`);
    return result.rows;
};

export const getLibroById = async (id_libro) => {
    const result = await pool.query(
        `${SELECT_LIBRO_CON_RELACIONES} WHERE l.id_libro = $1`,
        [id_libro]
    );

    if (result.rowCount === 0) {
        const error = new Error('Libro no encontrado');
        error.status = 404;
        throw error;
    }
    return result.rows[0];
};

export const getLibrosByTitulo = async (titulo) => {
    const buscar = `%${titulo}%`;
    const result = await pool.query(
        `${SELECT_LIBRO_CON_RELACIONES} WHERE l.titulo ILIKE $1 ORDER BY l.id_libro`,
        [buscar]
    );
    return result.rows;
};

// Búsqueda por año de publicación (exacto)
export const getLibrosByAnio = async (anio) => {
    const result = await pool.query(
        `${SELECT_LIBRO_CON_RELACIONES} WHERE l.anio_publicacion = $1 ORDER BY l.id_libro`,
        [anio]
    );
    return result.rows;
};

// Búsqueda de libros por autor (LIKE parcial sobre nombre del autor)
export const getLibrosByAutor = async (nombreAutor) => {
    const buscar = `%${nombreAutor}%`;
    const result = await pool.query(
        `${SELECT_LIBRO_CON_RELACIONES} WHERE a.nombre ILIKE $1 ORDER BY l.id_libro`,
        [buscar]
    );
    return result.rows;
};

// Búsqueda de libros por categoría (LIKE parcial sobre nombre_categoria)
export const getLibrosByCategoria = async (nombreCategoria) => {
    const buscar = `%${nombreCategoria}%`;
    const result = await pool.query(
        `${SELECT_LIBRO_CON_RELACIONES} WHERE c.nombre_categoria ILIKE $1 ORDER BY l.id_libro`,
        [buscar]
    );
    return result.rows;
};

// Búsqueda de libros por clasificación (LIKE parcial sobre clasificacion)
export const getLibrosByClasificacion = async (clasificacion) => {
    const buscar = `%${clasificacion}%`;
    const result = await pool.query(
        `${SELECT_LIBRO_CON_RELACIONES} WHERE c.clasificacion ILIKE $1 ORDER BY l.id_libro`,
        [buscar]
    );
    return result.rows;
};

const validarRelaciones = async (autor_id, categoria_id) => {
    const autor = await pool.query(
        'SELECT 1 FROM biblioteca.autores WHERE id_autor = $1',
        [autor_id]
    );
    if (autor.rowCount === 0) {
        const error = new Error(`El autor con id ${autor_id} no existe`);
        error.status = 400;
        throw error;
    }

    const categoria = await pool.query(
        'SELECT 1 FROM biblioteca.categorias WHERE id_categoria = $1',
        [categoria_id]
    );
    if (categoria.rowCount === 0) {
        const error = new Error(`La categoría con id ${categoria_id} no existe`);
        error.status = 400;
        throw error;
    }
};

export const createLibro = async (titulo, anio_publicacion, autor_id, categoria_id, resumen) => {
    await validarRelaciones(autor_id, categoria_id);

    const query = `
        INSERT INTO biblioteca.libros (titulo, anio_publicacion, autor_id, categoria_id, resumen)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;

    const result = await pool.query(query, [
        titulo,
        anio_publicacion,
        autor_id,
        categoria_id,
        resumen ?? null
    ]);
    return result.rows[0];
};

export const updateLibro = async (libro) => {
    const [titulo, anio_publicacion, autor_id, categoria_id, resumen, id_libro] = libro;
    await validarRelaciones(autor_id, categoria_id);

    const query = `
        UPDATE biblioteca.libros
        SET titulo = $1,
            anio_publicacion = $2,
            autor_id = $3,
            categoria_id = $4,
            resumen = $5
        WHERE id_libro = $6
        RETURNING *`;

    const result = await pool.query(query, libro);

    if (result.rowCount === 0) {
        const error = new Error('Libro no encontrado');
        error.status = 404;
        throw error;
    }
    return result.rows[0];
};

export const deleteLibro = async (id_libro) => {
    const existente = await pool.query(
        'SELECT * FROM biblioteca.libros WHERE id_libro = $1',
        [id_libro]
    );

    if (existente.rowCount === 0) {
        const error = new Error('Libro no encontrado');
        error.status = 404;
        throw error;
    }

    await pool.query('DELETE FROM biblioteca.libros WHERE id_libro = $1', [id_libro]);
    return { message: 'Libro eliminado correctamente', libro: existente.rows[0] };
};
