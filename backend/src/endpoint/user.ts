import type {Request, Response} from 'express';
import * as db from '../db';
import type {User} from '../types';

export async function get(_req: Request, res: Response<User[]>) {
    const users = await db.getUsers();
    res.status(200).json(users);
}
