import {it, beforeAll, afterAll} from 'vitest';
import http from 'node:http';
import app from '../app';
import * as db from './db';
import supertest from 'supertest';
import {DummyAuthProvider, setProvider} from '../authProvider';
import {User, Comment} from '../types';

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

it('Test invalid URL', async () => {
    await request?.get('/v0/fakeurl/').expect(404);
});

it('Test valid user is found', async ({expect}) => {
    const res = await getRequest().get('/v0/user/');
    const users = res.body as User[];
    expect(users.find((user) => user.name === 'Essa Lillford')).toBeDefined();
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

it('Get comments without authorization', async () => {
    await getRequest().get('/v0/comment?vid_id=t-Nw9oz-U6m').expect(401);
});

it('Get comments on video', async ({expect}) => {
    const authres = await getRequest().post('/v0/login/').send({token: 'auth'});
    const authed = authres.body;
    const res = await getRequest()
        .get('/v0/comment?vid_id=t-Nw9oz-U6M')
        .auth(authed.access_token, {type: 'bearer'});
    const comments = res.body as Comment[];
    expect(comments).toBeDefined();
    expect(comments.length).toBeGreaterThan(0);
});

it('Get comments on video that does not exist', async ({expect}) => {
    const authres = await getRequest().post('/v0/login/').send({token: 'auth'});
    const authed = authres.body;
    const res = await getRequest()
        .get('/v0/comment?vid_id=t-Nw9oz-U6w')
        .auth(authed.access_token, {type: 'bearer'});
    const comments = res.body as Comment[];
    expect(comments).toBeDefined();
    expect(comments.length).toBe(0);
});

it('Get comments on invalid video ID', async () => {
    const authres = await getRequest().post('/v0/login/').send({token: 'auth'});
    const authed = authres.body;
    await getRequest()
        .get('/v0/comment?vid_id=aaaaaaabbaaa')
        .auth(authed.access_token, {type: 'bearer'})
        .expect(400);
});

it('Post comment without authorization', async () => {
    const sentComment = {
        reply_id: '',
        comment: 'hello',
        vid_id: 't-Nw9oz-U6M',
    };
    await getRequest().post('/v0/comment').send(sentComment).expect(401);
});

it('Post comment with authorization to invalid video id', async () => {
    const sentComment = {
        reply_id: null,
        comment: 'hello',
        vid_id: 't-Nw9oz-U6Mw',
    };

    const res = await getRequest().post('/v0/login/').send({token: 'auth'});
    const authed = res.body;
    await getRequest()
        .post('/v0/comment')
        .send(sentComment)
        .auth(authed.access_token, {type: 'bearer'})
        .expect(400);
});

it('Post comment with authorization to known video id', async () => {
    const sentComment = {
        reply_id: null,
        comment: 'hello',
        vid_id: 't-Nw9oz-U6M',
    };

    const res = await getRequest().post('/v0/login/').send({token: 'auth'});
    const authed = res.body;
    await getRequest()
        .post('/v0/comment')
        .send(sentComment)
        .auth(authed.access_token, {type: 'bearer'})
        .expect(200);
});

it('Post comment with authorization to new video id', async () => {
    const sentComment = {
        reply_id: null,
        comment: 'hello',
        vid_id: 't-Nw9oz-U6w',
    };

    const res = await getRequest().post('/v0/login/').send({token: 'auth'});
    const authed = res.body;
    await getRequest()
        .post('/v0/comment')
        .send(sentComment)
        .auth(authed.access_token, {type: 'bearer'})
        .expect(200);
});
