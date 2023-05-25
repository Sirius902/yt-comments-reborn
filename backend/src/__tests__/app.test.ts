import 'dotenv/config';
process.env.POSTGRES_DB = 'test';

import {it, beforeAll, afterAll} from 'vitest';
import http from 'node:http';
import app from '../app';
import * as db from './db';
import supertest from 'supertest';
import {DummyAuthProvider, setProvider} from '../authProvider';
import {User} from '../types';

let server: http.Server | null = null;
let request: supertest.SuperTest<supertest.Test> | null = null;

function getServer() {
    if (server !== null) {
        return server;
    } else {
        throw new Error('Server not initialized');
    }
}

function getRequest() {
    if (request !== null) {
        return request;
    } else {
        throw new Error('Request not initialized');
    }
}

beforeAll(async () => {
    setProvider(new DummyAuthProvider());
    server = http.createServer(app);
    server.listen();
    request = supertest(server);
    await db.reset();
});

afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
        getServer().close((err) => (err == null ? resolve() : reject(err)));
    });
    await db.shutdown();
});

it('Test user does not exist before creation', async ({expect}) => {
    const res = await getRequest().get('/v0/user/');
    const users = res.body as User[];
    expect(users.find((user) => user.name === 'Bob Tester')).toBeUndefined();
});

it('Login works', async ({expect}) => {
    await getRequest().post('/v0/login/').send({token: 'auth'}).expect(200);

    const res = await getRequest().get('/v0/user/');
    const users = res.body as User[];
    expect(users.find((user) => user.name === 'Bob Tester')).toBeTruthy();
});

it('Invalid token fails to login', async () => {
    await getRequest().post('/v0/login/').send({token: 'letmein'}).expect(401);
});
