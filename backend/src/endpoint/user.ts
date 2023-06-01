import type {Request, Response} from 'express';
import * as db from '../db';
import type {User} from '../types';

// GET /user endpoint on web server
export async function get(_req: Request, res: Response<User[]>) {
    const users = await db.getUsers();
    // Return the response with the list of users
    res.status(200).json(users);
}
