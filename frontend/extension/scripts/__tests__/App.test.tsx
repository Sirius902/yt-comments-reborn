import * as fetchMock from 'jest-fetch-mock';
import React from 'react';
import {
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved,
    getAllByLabelText,
    getByLabelText,
    getByText,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import App, {CommentJson, NewCommentJson} from '../App';

let comments: CommentJson[] = [];
let likedComments = new Set<string>();
let dislikedComments = new Set<string>();

const server = setupServer(
    rest.post('http://localhost:3010/v0/login', (_req, res, ctx) => {
        return res(ctx.json({access_token: 'auth'}));
    }),
    rest.get('http://localhost:3010/v0/comment', (_req, res, ctx) => {
        const fixedComments = comments.map((comment) => {
            let likes = comment.likes;
            let dislikes = comment.dislikes;
            const liked = likedComments.has(comment.comment_id);
            const disliked = dislikedComments.has(comment.comment_id);
            if (liked) {
                likes++;
            }
            if (disliked) {
                dislikes++;
            }
            return {
                ...comment,
                likes,
                dislikes,
                is_liked: liked,
                is_disliked: disliked,
            };
        });
        return res(ctx.json(fixedComments));
    }),
    rest.post('http://localhost:3010/v0/comment', async (req, res, ctx) => {
        const newComment = (await req.json()) as NewCommentJson;
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
    rest.put('http://localhost:3010/v0/like/:id', (req, res, ctx) => {
        const id = req.params.id as string;
        const value = req.url.searchParams.get('value') === 'true';
        if (value) {
            dislikedComments.delete(id);
            if (likedComments.has(id)) {
                likedComments.delete(id);
            } else {
                likedComments.add(id);
            }
        } else {
            likedComments.delete(id);
            if (dislikedComments.has(id)) {
                dislikedComments.delete(id);
            } else {
                dislikedComments.add(id);
            }
        }
        return res(ctx.status(200));
    })
);

beforeAll(() => {
    fetchMock.enableFetchMocks();
    server.listen();
});

beforeEach(() => {
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
            is_liked: false,
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
            is_disliked: false,
            profile_picture: '',
        },
    ];
    likedComments = new Set();
    dislikedComments = new Set();
});

afterEach(() => server.resetHandlers());

afterAll(() => {
    server.close();
    fetchMock.disableFetchMocks();
});

test('Comments are on screen', async () => {
    render(<App videoId="123456" token="auth" />);

    await waitForElementToBeRemoved(screen.getByText('Loading...'));

    // check if username is on screen
    (
        await waitFor(() => expect(screen.getByText('test user')))
    ).toBeInTheDocument();
    // check if comment is on screen
    (
        await waitFor(() => expect(screen.getByText('I like this video')))
    ).toBeInTheDocument();
    // check if like number is on screen
    (await waitFor(() => expect(screen.getByText('2')))).toBeInTheDocument();
    // check if like number is on screen
    (await waitFor(() => expect(screen.getByText('3')))).toBeInTheDocument();
});

test('Commenting works', async () => {
    render(<App videoId="123456" token="auth" />);

    const commentBox = await waitFor(() =>
        screen.getByLabelText<HTMLTextAreaElement>('comment-box')
    );
    expect(commentBox).toBeInTheDocument();
    await userEvent.type(commentBox, 'Hello, world!');
    expect(commentBox).toHaveValue('Hello, world!');

    const postButton = await waitFor(() =>
        screen.getByLabelText<HTMLButtonElement>('post-comment')
    );
    expect(postButton).toBeInTheDocument();
    await userEvent.click(postButton);

    (
        await waitFor(() => expect(screen.getByText('Larry')))
    ).toBeInTheDocument();
    (
        await waitFor(() => expect(screen.getByText('Hello, world!')))
    ).toBeInTheDocument();
});

test('Replies work', async () => {
    render(<App videoId="123456" token="auth" />);

    await waitForElementToBeRemoved(screen.getByText('Loading...'));

    const commentList = await waitFor(() =>
        screen.getByLabelText<HTMLDivElement>('comment-list')
    );

    const replyButton = getAllByLabelText(commentList, 'reply')[0];
    await userEvent.click(replyButton);

    const replyBox = getAllByLabelText(commentList, 'reply-box')[0];
    expect(replyBox).toBeInTheDocument();
    await userEvent.type(replyBox, 'Hello, world!');
    expect(replyBox).toHaveValue('Hello, world!');

    const submitButton = getAllByLabelText(commentList, 'submit-reply')[0];
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);

    (
        await waitFor(() => expect(screen.getByText('Larry')))
    ).toBeInTheDocument();
    (
        await waitFor(() => expect(screen.getByText('Hello, world!')))
    ).toBeInTheDocument();
});

test('Likes work', async () => {
    render(<App videoId="123456" token="auth" />);

    await waitForElementToBeRemoved(screen.getByText('Loading...'));

    const commentList = await waitFor(() =>
        screen.getByLabelText<HTMLDivElement>('comment-list')
    );

    const comment = getAllByLabelText(commentList, 'comment')[0];
    expect(comment).toBeInTheDocument();

    const likeButton = getByLabelText(comment, 'like');

    await waitFor(() => getByText(comment, '2'));
    await userEvent.click(likeButton);
    await waitFor(() => getByText(comment, '3'));
    await userEvent.click(likeButton);
    await waitFor(() => getByText(comment, '2'));
});

test('Dislikes work', async () => {
    render(<App videoId="123456" token="auth" />);

    await waitForElementToBeRemoved(screen.getByText('Loading...'));

    const commentList = await waitFor(() =>
        screen.getByLabelText<HTMLDivElement>('comment-list')
    );

    const comment = getAllByLabelText(commentList, 'comment')[0];
    expect(comment).toBeInTheDocument();

    const dislikeButton = getByLabelText(comment, 'dislike');

    await waitFor(() => getByText(comment, '3'));
    await userEvent.click(dislikeButton);
    await waitFor(() => getByText(comment, '4'));
    await userEvent.click(dislikeButton);
    await waitFor(() => getByText(comment, '3'));
});
