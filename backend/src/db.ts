import pg from 'pg';
const {Pool} = pg;

import type {CommentInfo, Comment, User, UserInfo} from './types';

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});

function serializeDate(date: Date): string {
    return date.toISOString();
}

export async function createUser({name, email, picture}: UserInfo) {
    const insert = `INSERT INTO Users(name, email, picture)
        VALUES ($1, $2, $3) RETURNING *`;

    const {rows} = await pool.query({
        text: insert,
        values: [name, email, picture],
    });
    return rows[0] as User;
}

export async function getUser(email: string) {
    const select = 'SELECT * FROM Users WHERE email = $1';

    const {rows} = await pool.query({
        text: select,
        values: [email],
    });
    return rows[0] as User;
}

export async function getUsers() {
    const select = 'SELECT * FROM Users';

    const {rows} = await pool.query({
        text: select,
        values: [],
    });
    return rows as User[];
}

export async function createComment(userId: string, info: CommentInfo) {
    const insert = `INSERT INTO
        Comments(user_id, reply_id, comment, postdate, vid_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const {rows} = await pool.query({
        text: insert,
        values: [
            userId,
            info.reply_id,
            info.comment,
            serializeDate(new Date()),
            info.vid_id,
        ],
    });
    return rows[0] as Comment;
}

// TODO: Deserialize comment dates.
export async function getComments(vidId: string) {
    const select = `SELECT c.comment_id, c.reply_id, u.user_id, c.comment,
            c.postdate, c.vid_id, u.name
         FROM Comments c, Users u 
            WHERE c.vid_id = $1 AND
            c.user_id = u.user_id`;

    const {rows} = await pool.query({
        text: select,
        values: [vidId],
    });
    return rows as Comment[];
}

export async function getReplies(commentId: string) {
    const select = `SELECT c.comment_id, c.reply_id, u.user_id, c.comment,
            c.postdate, c.vid_id, u.name
         FROM Comments c, Users u 
            WHERE c.reply_id = $1 AND
            c.user_id = u.user_id `;
    const {rows} = await pool.query({
        text: select,
        values: [commentId],
    });
    return rows as Comment[];
}
