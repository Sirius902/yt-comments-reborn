import express from 'express';
import cors from 'cors';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import {middleware} from 'express-openapi-validator';
import * as auth from './endpoint/auth';
import * as user from './endpoint/user';
import * as comment from './endpoint/comment';
import * as reply from './endpoint/reply';
import {respondWithError} from './util';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = './api/openapi.yaml';

const apiDoc = yaml.load(fs.readFileSync(apiSpec, 'utf-8')) as object;
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apiDoc));

app.use(
    middleware({
        apiSpec,
        validateRequests: true,
        validateResponses: true,
    })
);

app.post('/v0/login', respondWithError(auth.login));

app.get('/v0/user', respondWithError(user.get));

app.get('/v0/comment', respondWithError(comment.get));
app.post('/v0/comment', auth.check, respondWithError(comment.post));

app.get('/v0/reply', respondWithError(reply.get));

app.use([
    (err, _req, res, _next) => {
        res.status(err.status).json({
            message: err.message,
            errors: err.errors,
            status: err.status,
        });
    },
]);

export default app;
