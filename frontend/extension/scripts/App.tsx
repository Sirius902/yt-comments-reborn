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
};

export type NewCommentJson = {
    user_id: string;
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
    const [errorMessage, setErrorMessage] = useState('Loading...');
    const [comments, setComments] = useState<CommentJson[] | null>(null);
    const [refetchComments, forceRefetchComments] = useReducer((x) => x + 1, 0);

    // TODO: Use this function to send Auth Token to backend
    /**
     * POSTs the user's AuthToken to the backend
     */
    const postAuthToken = async () => {
        const request = new Request(`${backendUrl}/v0/login`, {
            method: 'POST',
            body: JSON.stringify({token}),
        });
        const res = await fetch(request);
        if (res.ok) {
            console.log('PLACEHOLDER: Token sent to backend');
        } else {
            res.json().then((json) => console.log(json));
        }
    };
    console.log(postAuthToken);

    /**
     * GETs all of the comments on a video denoted by videoId from the backend
     * Once the GET request is completed,
     * setComments() is called with the comments as a CommentJson[]
     */
    const fetchComments = async () => {
        const res = await fetch(`${backendUrl}/v0/comment?vid_id=${videoId}`, {
            method: 'GET',
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
        const request = new Request(`${backendUrl}/v0/comment`, {
            method: 'POST',
            headers: {[`Content-Type`]: 'application/json'},
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
        fetchComments();
    }, [refetchComments]);

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
            const userId = '37c1ac27-1230-4fa6-9e0d-70fe5306c3c5';
            postComment({
                user_id: userId,
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
    topLevelComments?.sort(
        (a, b) =>
            new Date(b.postdate).getTime() - new Date(a.postdate).getTime()
    );
    return (
        <div className="App">
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
                {topLevelComments == null || comments == null ? (
                    <div>{errorMessage}</div>
                ) : (
                    topLevelComments.map((comment) => (
                        <Comment comments={comments} comment={comment} />
                    ))
                )}
            </div>
        </div>
    );
};

export default App;
