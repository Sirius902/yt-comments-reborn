import fs from 'node:fs/promises';
import pg from 'pg';
const {Pool} = pg;

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});

export async function run(file: string) {
    const content = await fs.readFile(file, 'utf-8');
    await pool.query(content);
}

export async function reset() {
    await run('sql/schema.sql');
    await run('sql/data.sql');
    await run('sql/indexes.sql');
}

export async function shutdown() {
    await pool.end();
}
