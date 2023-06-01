import * as fetchMock from 'jest-fetch-mock';
import React from 'react';
import {render, screen, waitFor, act, waitForElementToBeRemoved, getByText, getByLabelText, getAllByLabelText} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import App, {CommentJson, NewCommentJson} from '../App';

let comments: CommentJson[] = [];

const server = setupServer(
    rest.post('http://localhost:3010/v0/login', (_req, res, ctx) => {
        return res(ctx.json({access_token: 'auth'}));
    }),
    rest.get('http://localhost:3010/v0/comment', (_req, res, ctx) => {
        return res(ctx.json(comments));
    }),
    rest.post('http://localhost:3010/v0/comment', async (req, res, ctx) => {
        const newComment = await req.json() as NewCommentJson;
        const comment = {
            comment_id: 'zxcvb',
            reply_id: newComment.reply_id,
            user_id: 'new',
            name: 'Larry',
            comment: newComment.comment,
            postdate: '2023-06-01T22:02:26.797Z',
            vid_id: newComment.vid_id,
            likes: 0,
            dislikes: 0,
            is_liked: false,
            is_disliked: false,
            profile_picture: '',
        };
        comments.push(comment);
        return res(ctx.json(comment));
    }),
);

beforeAll(() => {
    fetchMock.enableFetchMocks();
    server.listen();

    comments = [
        {
            comment_id: 'qwery',
            reply_id: null,
            user_id: 'qwery',
            name: 'test user',
            comment: 'I like this video',
            postdate: '2023-06-01T22:02:26.797Z',
            vid_id: '123456',
            likes: 2,
            dislikes: 3,
            is_liked: true,
            is_disliked: false,
            profile_picture: '',
        },
        {
            comment_id: '123456',
            reply_id: null,
            user_id: '123456',
            name: 'test user2',
            comment: 'I hate this video',
            postdate: '2023-06-01T22:02:26.797Z',
            vid_id: '123456',
            likes: 4,
            dislikes: 5,
            is_liked: false,
            is_disliked: true,
            profile_picture: '',
        },
    ];
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

test('Comments are on screen', async () => {
    render(<App videoId="blarg" token="auth" />);

    await waitForElementToBeRemoved(screen.getByText('Loading...'));

    //check if username is on screen
    (await waitFor(() => expect(screen.getByText('test user')))).toBeInTheDocument();
    //check if comment is on screen
    (await waitFor(() => expect(screen.getByText('I like this video')))).toBeInTheDocument();
    //check if like number is on screen
    (await waitFor(() => expect(screen.getByText('2')))).toBeInTheDocument();
    //check if like number is on screen
    (await waitFor(() => expect(screen.getByText('3')))).toBeInTheDocument();

});

test('Posted Comment are on screen', async () => {
    render(<App videoId="blarg" token="auth" />);

    const commentBox = await waitFor(() => screen.getByLabelText<HTMLTextAreaElement>('comment-box'));   
    expect(commentBox).toBeInTheDocument();
    await userEvent.type(commentBox, 'Hello, world!');
    expect(commentBox).toHaveValue('Hello, world!');

    const postButton = await waitFor(() => screen.getByLabelText<HTMLButtonElement>('post-comment'));
    expect(postButton).toBeInTheDocument();
    await userEvent.click(postButton);

    (await waitFor(() => expect(screen.getByText('Larry')))).toBeInTheDocument();
    (await waitFor(() => expect(screen.getByText('Hello, world!')))).toBeInTheDocument();
});

test('Replies are on screen', async () => {
    render(<App videoId="blarg" token="auth" />);

    await waitForElementToBeRemoved(screen.getByText('Loading...'));

    const commentList = await waitFor(() => screen.getByLabelText<HTMLDivElement>('comment-list'));

    const replyButton = getAllByLabelText(commentList, 'reply')[0];
    await userEvent.click(replyButton);

    const replyBox = getAllByLabelText(commentList, 'reply-box')[0];
    expect(replyBox).toBeInTheDocument();
    await userEvent.type(replyBox, 'Hello, world!');
    expect(replyBox).toHaveValue('Hello, world!');

    const submitButton = getAllByLabelText(commentList, 'submit-reply')[0];
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);

    (await waitFor(() => expect(screen.getByText('Larry')))).toBeInTheDocument();
    (await waitFor(() => expect(screen.getByText('Hello, world!')))).toBeInTheDocument();
});
