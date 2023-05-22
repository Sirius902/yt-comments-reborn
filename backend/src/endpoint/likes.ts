import type {Request, Response} from 'express';
import * as db from '../db';
import type {Comment} from '../types';
import type {ParamsDictionary} from 'express-serve-static-core';
import type { AuthRequest } from './auth';

export async function put(
    req: AuthRequest<{comment_id: string}, unknown,unknown>,
    res: Response<unknown>
) {
    if(req.userId === null){
        res.status(500).send("User ID is null")
        return
    }
    await db.changeLikes(req.params.comment_id,req.userId as string);
    res.status(200);
}

export async function get(
    req: Request<{comment_id: string},number,unknown>,
    res: Response<number>
){
    const reply = await db.getLikes(req.params.comment_id);
    res.status(200).json(reply)
}