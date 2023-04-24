import type {Request, Response} from 'express';
import * as db from '../db';
import type {User, UserInfo} from '../types';

export async function get(_req: Request, res: Response<User[]>) {
    const users = await db.getUsers();
    res.status(200).json(users);
}

export async function post(req: Request, res: Response<User>) {
    const body = req.body as UserInfo;
    const user = await db.createUser(body);
    res.status(200).json(user);
}
