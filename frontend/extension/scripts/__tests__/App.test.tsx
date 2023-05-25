import * as fetchMock from 'jest-fetch-mock';
import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import App from '../App';

const server = setupServer(
    rest.post('http://localhost:3010/v0/login', (_req, res, ctx) => {
        return res(ctx.json({accessToken: ''}));
    }),
    rest.get('http://localhost:3010/v0/comment', (_req, res, ctx) => {
        return res(ctx.json([]));
    })
);

beforeAll(() => {
    fetchMock.enableFetchMocks();
    server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => {
    server.close();
    fetchMock.disableFetchMocks();
});

test('Dummy', async () => {
    render(<App videoId="blarg" token="auth" />);
    (
        await waitFor(() => expect(screen.getByText('Comment')))
    ).toBeInTheDocument();
});
