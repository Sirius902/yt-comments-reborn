import type {Request, Response} from 'express';
import * as db from '../db';
import type {Comment} from '../types';
import type {ParamsDictionary} from 'express-serve-static-core';

export async function get(
    req: Request<ParamsDictionary, unknown, unknown, {comment_id: string}>,
    res: Response<Comment[]>
) {
    const reply = await db.getReplies(req.query.comment_id);
    res.status(200).json(reply);
}
