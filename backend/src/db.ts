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

export async function createUser({name}: UserInfo): Promise<User> {
    const insert = 'INSERT INTO Users(name) VALUES ($1) RETURNING *';

    const {rows} = await pool.query({
        text: insert,
        values: [name],
    });
    return rows[0];
}

export async function getUsers(): Promise<User[]> {
    const select = 'SELECT * FROM Users';

    const {rows} = await pool.query({
        text: select,
        values: [],
    });
    return rows;
}

export async function createComment(info: CommentInfo): Promise<Comment> {
    const insert = (
        `INSERT INTO Comments(user_id, comment, postdate)
        VALUES ($1, $2, $3) RETURNING *`
    );

    const {rows} = await pool.query({
        text: insert,
        values: [
            info.user_id,
            info.comment,
            serializeDate(new Date()),
        ],
    });
    return rows[0];
}

// TODO: Deserialize comment dates.
export async function getComments(): Promise<Comment[]> {
    const select = 'SELECT * FROM Comments;';

    const {rows} = await pool.query({
        text: select,
        values: [],
    });
    return rows;
}

export async function addCommentToVideo(
    vid_id: string,
    comment_id: string,
): Promise<void> {
    const insert = (
        'INSERT INTO Videos(vid_id, comment_id) VALUES ($1, $2) RETURNING *'
    );

    await pool.query({
        text: insert,
        values: [vid_id, comment_id],
    });
}
