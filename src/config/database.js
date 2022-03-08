import pg from 'pg';
import dotenv from 'dotenv-safe';

dotenv.config();

const client = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

client.connect();

export default client;