// Importamos el paquete 'pg' que nos permite conectarnos a PostgreSQL
import pgk from 'pg';

// Importamos dotenv para leer las variables de entorno desde el archivo .env
import dotenv from 'dotenv';

// Cargamos las variables de entorno
dotenv.config();

// Extraemos la clase Pool de 'pg', que maneja un grupo de conexiones
const { Pool } = pgk;

// Esquema por defecto donde viven nuestras tablas
const DB_SCHEMA = process.env.DB_SCHEMA || 'biblioteca';

// Creamos y exportamos un pool de conexión reutilizable
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Cada vez que se crea una nueva conexión, fijamos el search_path al esquema
// "biblioteca" para que todas las consultas apunten allí por defecto.
pool.on('connect', (client) => {
  client.query(`SET search_path TO ${DB_SCHEMA}, public`);
});
