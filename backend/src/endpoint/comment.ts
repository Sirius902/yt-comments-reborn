import type {Response} from 'express';
import * as db from '../db';
import type {Comment, CommentInfo} from '../types';
import type {ParamsDictionary} from 'express-serve-static-core';
import type {AuthRequest} from './auth';

// GET /comment endpoint on web server
// Params: Only the vid_id parameter matters
export async function get(
    req: AuthRequest<ParamsDictionary, unknown, unknown, {vid_id: string}>,
    res: Response<Comment[] | string>
) {
    // Internal Server Error if user doesn't exist
    if (req.userId == null) {
        res.status(500).send('User ID is null');
        return;
    }
    // Store the comments using getComments() function
    const comments = await db.getComments(req.query.vid_id, req.userId);
    // Return the list of comments
    res.status(200).json(comments);
}

// POST /comment endpoint on web server
// Params: Comment as a string and CommentInfo passed in
export async function post(
    req: AuthRequest<ParamsDictionary, Comment | string, CommentInfo>,
    res: Response<Comment | string>
) {
    // Internal Server Error if user doesn't exist
    if (req.userId == null) {
        res.status(500).send('user_id is null');
        return;
    }
    // Store the created comment by calling createComment()
    const comment = await db.createComment(req.userId, req.body);
    // Return the comment
    res.status(200).json(comment);
}
