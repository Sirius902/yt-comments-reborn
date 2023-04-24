import type {Request, Response} from 'express';
import * as db from '../db';
import type {Comment, CommentInfo} from '../types';

export async function get(_req: Request, res: Response<Comment[]>) {
    const comments = await db.getComments();
    res.status(200).json(comments);
}

export async function post(req: Request, res: Response<Comment>) {
    const body = req.body as CommentInfo;
    const comment = await db.createComment(body);
    res.status(200).json(comment);
    // TODO: Insert into video table as well.
}
