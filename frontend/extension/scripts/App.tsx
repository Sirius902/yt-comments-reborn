import React, {useEffect, useReducer, useState} from 'react';
import Comment from './components/Comment';
import './App.css';

interface Props {
    videoId: string;
    token: string;
}

export type CommentJson = {
    comment_id: string;
    reply_id: string;
    user_id: string;
    name: string;
    comment: string;
    postdate: string;
    vid_id: string;
    likes: number;
    dislikes: number;
    is_liked: boolean;
    is_disliked: boolean;
    profile_picture: string;
};

export type NewCommentJson = {
    comment: string;
    reply_id: string | null;
    vid_id: string;
};

export type ErrorResponse = {
    code: number;
    message: string;
};

const backendUrl = 'http://localhost:3010';

const App: React.FC<Props> = ({videoId, token}) => {
    const commentBox = React.useRef<HTMLTextAreaElement>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('Loading...');
    const [comments, setComments] = useState<CommentJson[] | null>(null);
    const [refetchComments, forceRefetchComments] = useReducer((x) => x + 1, 0);
    const [sortBy, setSortBy] = useState<'Date' | 'Likes'>('Date');

    /**
     * POSTs the user's AuthToken to the backend
     */
    const postAuthToken = async () => {
        const request = new Request(`${backendUrl}/v0/login`, {
            method: 'POST',
            headers: new Headers({
                [`Content-Type`]: 'application/json',
            }),
            body: JSON.stringify({token}),
        });
        const res = await fetch(request);
        if (res.ok) {
            return ((await res.json()) as {access_token: string}).access_token;
        } else {
            res.json().then((json) => console.log(json));
        }
    };

    /**
     * GETs all of the comments on a video denoted by videoId from the backend
     * Once the GET request is completed,
     * setComments() is called with the comments as a CommentJson[]
     */
    const fetchComments = async () => {
        if (accessToken == null) {
            return;
        }
        const res = await fetch(`${backendUrl}/v0/comment?vid_id=${videoId}`, {
            method: 'GET',
            headers: {
                [`Authorization`]: `Bearer ${accessToken}`,
            },
        });
        if (res.ok) {
            res.json().then((json) => setComments(json as CommentJson[]));
        } else {
            setErrorMessage('Failed to load comments!');
            res.json().then((json) => console.log(json));
        }
    };

    /**
     * POSTs a comment to the backend.
     * Once the POST request is completed,
     * forceRefetchComments() is called to reload the comments.
     * @param {CommentJson} comment a CommentJson to send to the backend
     * @return {Promise<CommentJson | undefined>} response from backend
     */
    const postComment = async (comment: NewCommentJson) => {
        if (accessToken == null) {
            return;
        }
        const request = new Request(`${backendUrl}/v0/comment`, {
            method: 'POST',
            headers: {
                [`Authorization`]: `Bearer ${accessToken}`,
                [`Content-Type`]: 'application/json',
            },
            body: JSON.stringify(comment),
        });
        const res = await fetch(request);
        if (res.ok) {
            forceRefetchComments();
            return (await res.json()) as CommentJson;
        } else {
            res.json().then((json) => console.log(json));
        }
    };

    useEffect(() => {
        postAuthToken().then((token) => {
            if (token != null) {
                setAccessToken(token);
            }
        });
    }, []);

    useEffect(() => {
        fetchComments();
    }, [refetchComments, accessToken]);

    /**
     * Called upon clicking submitBtn
     * Calls postComment() with the current
     * user_id, commentBox value, reply_id,
     * and vid_id.
     * Sets commentBox value to '' once postComment()
     * is completed.
     * @param {React.MouseEvent<HTMLButtonElement>} e
     */
    const addComment = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (commentBox.current !== null && commentBox.current.value !== '') {
            postComment({
                comment: commentBox.current.value,
                reply_id: null,
                vid_id: videoId,
            });
            commentBox.current.value = '';
        }
        e.preventDefault();
    };

    /**
     * Called upon clicking clearBtn.
     * Sets commentBox value to '' once clearBtn
     * is pressed.
     * @param {React.MouseEvent<HTMLButtonElement>} e
     */
    const clearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (commentBox.current !== null) {
            commentBox.current.value = '';
        }

        e.preventDefault();
    };

    /** Generates a commentJson[] of all comments that don't have replies. */
    const topLevelComments = comments?.filter(
        (comment) => comment.reply_id === null
    );
    topLevelComments?.sort((a, b) => {
        if (sortBy === 'Date') {
            return (
                new Date(b.postdate).getTime() - new Date(a.postdate).getTime()
            );
        } else {
            return b.likes - a.likes;
        }
    });
    const refetch = () => {
        forceRefetchComments();
    };
    const shouldRender =
        topLevelComments == null || comments == null || accessToken == null;

    const sorts = ['Date', 'Likes'] as const;

    return (
        <div className="App">
            <div className="sort">
                <span>Sort By: </span>
                <span>
                    {sorts.map((sort, i) => (
                        <label key={i}>
                            <input
                                type="checkbox"
                                checked={sortBy === sort}
                                onChange={() => setSortBy(sort)}
                            />
                            {sort}
                        </label>
                    ))}
                </span>
            </div>
            <div className="container">
                <form>
                    <textarea
                        id="RBcomment"
                        placeholder="Add a comment..."
                        ref={commentBox}
                    ></textarea>
                    <div className="btn">
                        <button id="clearBtn" onClick={clearInput}>
                            Cancel
                        </button>
                        <button id="submitBtn" onClick={addComment}>
                            Comment
                        </button>
                    </div>
                </form>
            </div>
            <div>
                {shouldRender ? (
                    <div>{errorMessage}</div>
                ) : (
                    topLevelComments.map((comment) => (
                        <Comment
                            comments={comments}
                            comment={comment}
                            accessToken={accessToken}
                            videoId={videoId}
                            refetch={refetch}
                            topComment={comment.comment_id}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default App;
