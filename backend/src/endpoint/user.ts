import type {Request, Response} from 'express';
import * as db from '../db';
import type {User, UserInfo} from '../types';
import type {ParamsDictionary} from 'express-serve-static-core';

export async function get(_req: Request, res: Response<User[]>) {
    const users = await db.getUsers();
    res.status(200).json(users);
}

export async function post(
    req: Request<ParamsDictionary, User, UserInfo>,
    res: Response<User>,
) {
    const user = await db.createUser(req.body);
    res.status(200).json(user);
}
