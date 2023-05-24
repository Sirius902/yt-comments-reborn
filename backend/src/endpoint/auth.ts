import type {NextFunction, Request, Response} from 'express';
import * as db from '../db';
import type {AuthUser, Credentials} from '../types';
import type {ParamsDictionary} from 'express-serve-static-core';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import fss from 'node:fs';

const authUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';

const secrets = (() => {
    const buffer = fss.readFileSync('./secrets.json', 'utf-8');
    return JSON.parse(buffer) as {accessToken: string};
})();

type UserInfo = {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
    hd: string;
};

export interface AuthRequest<P = ParamsDictionary, Res = unknown, Req = unknown>
    extends Request<P, Res, Req> {
    userId?: string;
}

export async function login(
    req: Request<ParamsDictionary, AuthUser | string, Credentials>,
    res: Response<AuthUser | string>
) {
    const userInfoRes = await fetch(
        `${authUrl}?access_token=${req.body.token}`
    );
    if (!userInfoRes.ok) {
        res.status(401).send('Invalid token');
        return;
    }

    // TODO: get rid of cast to any, this is a horrible way to check if the
    // object has required properties
    const userInfoJson = (await userInfoRes.json()) as {
        name?: string;
        email: string;
        picture?: string;
    };
    if (
        userInfoJson.name == null ||
        userInfoJson.email == null ||
        userInfoJson.picture == null
    ) {
        res.status(401).send('Invalid token');
        return;
    }

    const userInfo = userInfoJson as UserInfo;
    const userId = await (async () => {
        try {
            const user = await db.getUser(userInfo.email);
            return user.user_id;
        } catch (_) {
            const user = await db.createUser(userInfo);
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
