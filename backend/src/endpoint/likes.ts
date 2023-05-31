import type {Response} from 'express';
import * as db from '../db';
import type {AuthRequest} from './auth';

export async function put(req: AuthRequest, res: Response<unknown>) {
    if (req.userId == null) {
        res.status(500).send('User ID is null');
        return;
    }
    const id = (req.params as {id: string}).id;
    const value = (req.query as {value: boolean}).value;
    await db.changeLikes(id, req.userId, value);
    res.status(200).send();
}
