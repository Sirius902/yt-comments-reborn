import express from 'express';
import cors from 'cors';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import {middleware} from 'express-openapi-validator';
import {fileURLToPath} from 'node:url';
import * as db from './db';

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

app.get('/v0/user', async (_req, res) => {
    const users = await db.getUsers();
    res.status(200).json(users);
});

type UserInfo = {
    name: string;
};

app.post('/v0/user', async (req, res) => {
    const {name} = req.body as UserInfo;
    const user = await db.createUser(name);
    res.status(200).json(user);
});

app.use([(err, _req, res, _next) => {
    res.status(err.status).json({
        message: err.message,
        errors: err.errors,
        status: err.status,
    });
}]);

export default app;
