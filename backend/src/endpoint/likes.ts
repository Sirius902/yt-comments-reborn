import type {Response} from 'express';
import * as db from '../db';
import type {AuthRequest} from './auth';

// PUT /like/{id} endpoint on web server
export async function put(req: AuthRequest, res: Response<unknown>) {
    // Internal Server Error if user doesn't exist
    if (req.userId == null) {
        res.status(500).send('User ID is null');
        return;
    }
    // comment_id
    const id = (req.params as {id: string}).id;
    // like_bool boolean value
    const value = (req.query as {value: boolean}).value;
    await db.changeLikes(id, req.userId, value);
    // Send 200 OK Status Code
    res.status(200).send();
}
