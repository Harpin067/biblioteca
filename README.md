# Biblioteca API

API RESTful para la administración de una biblioteca digital. Permite gestionar libros, autores y categorías con operaciones CRUD completas, búsquedas avanzadas y validación de datos de entrada.

## Tecnologías

- **Runtime:** Node.js (ESModules)
- **Framework:** Express 5
- **Base de datos:** PostgreSQL (esquema `biblioteca`)
- **Validaciones:** express-validator
- **Variables de entorno:** dotenv

## Estructura del proyecto

```
src/
├── index.js              # Punto de entrada, configuración de Express
├── db.js                 # Pool de conexiones a PostgreSQL
├── routes/
│   ├── libros.js
│   ├── autores.js
│   └── categorias.js
├── controllers/
│   ├── librosController.js
│   ├── autoresController.js
│   └── categoriasController.js
├── services/
│   ├── librosServices.js
│   ├── autoresServices.js
│   └── categoriasServices.js
└── middlewares/
    ├── validators.js
    └── errorHandler.js
```

## Modelo de datos

### `biblioteca.autores`
| Campo         | Tipo          | Restricciones              |
|---------------|---------------|----------------------------|
| id_autor      | SERIAL        | PK                         |
| nombre        | VARCHAR(255)  | NOT NULL                   |
| nacionalidad  | VARCHAR(100)  |                            |
| biografia     | TEXT          |                            |
| correo        | VARCHAR(255)  | NOT NULL, UNIQUE           |

### `biblioteca.categorias`
| Campo            | Tipo         | Restricciones |
|------------------|--------------|---------------|
| id_categoria     | SERIAL       | PK            |
| nombre_categoria | VARCHAR(100) | NOT NULL      |
| clasificacion    | VARCHAR(100) | NOT NULL      |

### `biblioteca.libros`
| Campo             | Tipo         | Restricciones                                  |
|-------------------|--------------|------------------------------------------------|
| id_libro          | SERIAL       | PK                                             |
| titulo            | VARCHAR(255) | NOT NULL, mín. 10 caracteres                   |
| anio_publicacion  | INT          | NOT NULL, > 1900                               |
| autor_id          | INT          | FK → autores(id_autor) ON DELETE CASCADE       |
| categoria_id      | INT          | FK → categorias(id_categoria) ON DELETE RESTRICT |
| resumen           | TEXT         |                                                |

## Instalación y configuración

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd biblioteca
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_base_de_datos
DB_USER=usuario
DB_PASSWORD=contraseña
DB_SCHEMA=biblioteca
```

### 3. Iniciar el servidor

```bash
# Desarrollo (con recarga automática)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`.

## Endpoints

### Libros `/libros`

| Método | Ruta                                  | Descripción                          |
|--------|---------------------------------------|--------------------------------------|
| GET    | `/libros`                             | Obtener todos los libros             |
| GET    | `/libros/:id_libro`                   | Obtener libro por ID                 |
| GET    | `/libros/buscarPorTitulo/:titulo`     | Buscar libros por título (parcial)   |
| GET    | `/libros/buscarPorAnio/:anio`         | Buscar libros por año de publicación |
| GET    | `/libros/buscarPorAutor/:autor`       | Buscar libros por nombre de autor    |
| GET    | `/libros/buscarPorCategoria/:categoria` | Buscar libros por categoría        |
| GET    | `/libros/buscarPorClasificacion/:clasificacion` | Buscar por clasificación  |
| POST   | `/libros`                             | Crear un libro                       |
| PUT    | `/libros/:id_libro`                   | Actualizar un libro                  |
| DELETE | `/libros/:id_libro`                   | Eliminar un libro                    |

**Body para POST / PUT:**
```json
{
  "titulo": "El nombre del viento",
  "anio_publicacion": 2007,
  "autor_id": 1,
  "categoria_id": 2,
  "resumen": "Primera parte de la Crónica del Asesino de Reyes."
}
```

---

### Autores `/autores`

| Método | Ruta                | Descripción              |
|--------|---------------------|--------------------------|
| GET    | `/autores`          | Obtener todos los autores |
| GET    | `/autores/:id_autor`| Obtener autor por ID     |
| POST   | `/autores`          | Crear un autor           |
| PUT    | `/autores/:id_autor`| Actualizar un autor      |
| DELETE | `/autores/:id_autor`| Eliminar un autor        |

**Body para POST / PUT:**
```json
{
  "nombre": "Patrick Rothfuss",
  "nacionalidad": "Estadounidense",
  "biografia": "Escritor de fantasía épica.",
  "correo": "patrick@ejemplo.com"
}
```

---

### Categorías `/categorias`

| Método | Ruta                          | Descripción                  |
|--------|-------------------------------|------------------------------|
| GET    | `/categorias`                 | Obtener todas las categorías |
| GET    | `/categorias/:id_categoria`   | Obtener categoría por ID     |
| POST   | `/categorias`                 | Crear una categoría          |
| PUT    | `/categorias/:id_categoria`   | Actualizar una categoría     |
| DELETE | `/categorias/:id_categoria`   | Eliminar una categoría       |

**Body para POST / PUT:**
```json
{
  "nombre_categoria": "Fantasía",
  "clasificacion": "Ficción"
}
```

> **Nota:** No se puede eliminar una categoría si tiene libros asociados (retorna `409 Conflict`).

## Respuestas de error

Todos los errores siguen el mismo formato:

```json
{
  "status": "error",
  "errors": [
    {
      "type": "field",
      "msg": "El título debe tener al menos 10 caracteres",
      "path": "titulo",
      "location": "body"
    }
  ]
}
```

| Código | Causa                                              |
|--------|----------------------------------------------------|
| 400    | Datos de entrada inválidos                         |
| 404    | Recurso no encontrado                              |
| 409    | Conflicto (correo duplicado, categoría con libros) |
| 500    | Error interno del servidor                         |
