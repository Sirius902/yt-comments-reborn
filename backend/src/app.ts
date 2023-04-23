import express, {type Response} from 'express';
import cors from 'cors';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import {middleware} from 'express-openapi-validator';
import {fileURLToPath} from 'node:url';
import * as db from './db';
import type {UserInfo, CommentInfo} from './types';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const apiSpec = path.join(dirname, '../api/openapi.yaml');

const apiDoc = yaml.load(fs.readFileSync(apiSpec, 'utf-8')) as object;
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apiDoc));

app.use(
    middleware({
        apiSpec,
        validateRequests: true,
        validateResponses: true,
    }),
);

// TODO: This is kind of cringe.
function errorResponse<R extends Response, E>(res: R, e: E) {
    if (e instanceof Error) {
        res.status(500).json(e.message);
    } else {
        res.status(500).json('Unknown error type');
    }
}

app.get('/v0/user', async (_req, res) => {
    const users = await db.getUsers();
    res.status(200).json(users);
});

app.post('/v0/user', async (req, res) => {
    try {
        // TODO: Fix the types to get rid of the cast.
        const user = await db.createUser(req.body as UserInfo);
        res.status(200).json(user);
    } catch (e) {
        errorResponse(res, e);
    }
});

app.get('/v0/comment', async (req, res) => {
    try {
        const comments = await db.getComments();
        res.status(200).json(comments);
    } catch (e) {
        errorResponse(res, e);
    }
});

app.post('/v0/comment', async (req, res) => {
    try {
        const comment = await db.createComment(req.body as CommentInfo);
        res.status(200).json(comment);
        // TODO: Insert into video table as well.
    } catch (e) {
        errorResponse(res, e);
    }
});

app.use([(err, _req, res, _next) => {
    res.status(err.status).json({
        message: err.message,
        errors: err.errors,
        status: err.status,
    });
}]);

export default app;
