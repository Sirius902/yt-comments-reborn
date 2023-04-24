import type {Request, Response} from 'express';
import * as db from '../db';
import type {Comment, CommentInfo} from '../types';
import type {ParamsDictionary} from 'express-serve-static-core';

export async function get(_req: Request, res: Response<Comment[]>) {
    const comments = await db.getComments();
    res.status(200).json(comments);
}

export async function post(
    req: Request<ParamsDictionary, Comment, CommentInfo>,
    res: Response<Comment>,
) {
    const comment = await db.createComment(req.body);
    res.status(200).json(comment);
    // TODO: Insert into video table as well.
}
