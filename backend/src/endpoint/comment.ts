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
    req: AuthRequest<ParamsDictionary, Comment | string, CommentInfo>,
    res: Response<Comment | string>
) {
    if (req.userId == null) {
        res.status(500).send('user_id is null');
        return;
    }
    const comment = await db.createComment(req.userId, req.body);
    res.status(200).json(comment);
}
