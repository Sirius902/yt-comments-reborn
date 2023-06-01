import type {NextFunction, Request, Response} from 'express';
import * as db from '../db';
import type {AuthUser, Credentials} from '../types';
import type {ParamsDictionary} from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import fss from 'node:fs';
import {getProvider} from '../authProvider';

// Store the accessToken in the secrets const
const secrets = (() => {
    const buffer = fss.readFileSync('./secrets.json', 'utf-8');
    return JSON.parse(buffer) as {accessToken: string};
})();

// Entend the AuthRequest interface to have a userId value
export interface AuthRequest<
    P = ParamsDictionary,
    Res = unknown,
    Req = unknown,
    Query = unknown
> extends Request<P, Res, Req, Query> {
    userId?: string;
}

// POST /login endpoint on web server
// Params: authenticated AuthUser with their Credentials
export async function login(
    req: Request<ParamsDictionary, AuthUser | string, Credentials>,
    res: Response<AuthUser | string>
) {
    // Store the authInfo of the authenticated token
    const authInfo = await getProvider().authenticate(req.body.token);
    // Send 401 Forbidden if the token is invalid
    if (authInfo === null) {
        res.status(401).send('Invalid token');
        return;
    }

    // Return user_id of authenticated user
    const userId = await (async () => {
        // Check if user exists
        try {
            const user = await db.getUser(authInfo.email);
            return user.user_id;
        } catch (_) {
            // Create User if they don't exist
            const user = await db.createUser(authInfo);
            return user.user_id;
        }
    })();

    // Generate access token
    const accessToken = jwt.sign({user_id: userId}, secrets.accessToken, {
        algorithm: 'HS256',
    });
    // Return response with access token
    res.status(200).json({access_token: accessToken});
}

// Check if the token is valid
export async function check(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    // Store authorization header
    const authHeader = req.headers.authorization;
    // Token exists
    if (authHeader != null) {
        // Store the token from authHeader
        const token = authHeader.split(' ')[1];
        // Verify token
        jwt.verify(token, secrets.accessToken, (err, user) => {
            if (err) {
                // Send 403 Forbidden if token isn't verified
                return res.sendStatus(403);
            }
            req.userId = (user as {user_id: string}).user_id;
            next();
        });
    } else {
        // Send 401 Forbidden if token does not exist
        res.sendStatus(401);
    }
}
