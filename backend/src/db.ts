import pg from 'pg';
const {Pool} = pg;

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});

export async function createUser(name: string) {
    const insert = 'INSERT INTO Users(name) VALUES ($1) RETURNING *';

    const {rows} = await pool.query({
        text: insert,
        values: [name],
    });
    return rows[0];
}

export async function getUsers() {
    const select = 'SELECT * FROM Users';

    const {rows} = await pool.query({
        text: select,
        values: [],
    });
    return rows;
}
