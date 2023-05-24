import type {NextFunction, Request, Response} from 'express';
import * as db from '../db';
import type {AuthUser, Credentials} from '../types';
import type {ParamsDictionary} from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import fss from 'node:fs';
import {getProvider} from '../authProvider';

const secrets = (() => {
    const buffer = fss.readFileSync('./secrets.json', 'utf-8');
    return JSON.parse(buffer) as {accessToken: string};
})();

export interface AuthRequest<P = ParamsDictionary, Res = unknown, Req = unknown>
    extends Request<P, Res, Req> {
    userId?: string;
}

export async function login(
    req: Request<ParamsDictionary, AuthUser | string, Credentials>,
    res: Response<AuthUser | string>
) {
    const authInfo = await getProvider().authenticate(req.body.token);
    if (authInfo === null) {
        res.status(401).send('Invalid token');
        return;
    }

    const userId = await (async () => {
        try {
            const user = await db.getUser(authInfo.email);
            return user.user_id;
        } catch (_) {
            const user = await db.createUser(authInfo);
            return user.user_id;
        }
    })();

    const accessToken = jwt.sign({user_id: userId}, secrets.accessToken, {
        algorithm: 'HS256',
    });
    res.status(200).json({access_token: accessToken});
}

export async function check(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (authHeader != null) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secrets.accessToken, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.userId = (user as {user_id: string}).user_id;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}
