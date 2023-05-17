import type {Request, Response} from 'express';
import * as db from '../db';
import type {Comment, CommentInfo} from '../types';
import type {ParamsDictionary} from 'express-serve-static-core';
import type {AuthRequest} from './auth';

export async function get(
    req: Request<ParamsDictionary, unknown, unknown, {vid_id: string}>,
    res: Response<Comment[]>
) {
    const comments = await db.getComments(req.query.vid_id);
    res.status(200).json(comments);
}

export async function post(
    req: AuthRequest<ParamsDictionary, Comment, CommentInfo>,
    res: Response<Comment>
) {
    if (req.user_id == null) {
        throw new Error('oh no help user id is null');
    }
    const comment = await db.createComment(req.user_id, req.body);
    res.status(200).json(comment);
}
