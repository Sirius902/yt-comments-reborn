import {it, beforeAll, afterAll} from 'vitest';
import http from 'node:http';
import app from '../app';
import * as db from './db';
import supertest from 'supertest';

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

it('No token fails to login', async () => {
    await getRequest().get('/v0/login/').expect(405);
});
