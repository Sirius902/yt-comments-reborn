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

    const postComment = async (comment: NewCommentJson) => {
        const request = new Request(`${backendUrl}/v0/comment`, {
            method: 'POST',
            headers: {[`Content-Type`]: 'application/json'},
            body: JSON.stringify(comment),
        });
        const res = await fetch(request);
        if (res.ok) {
            forceRefetchComments();
            return res.json();
        } else {
            res.json().then((json) => console.log(json));
        }
    };

    useEffect(() => {
        fetchComments();
    }, [refetchComments]);

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

    const clearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (commentBox.current !== null) {
            commentBox.current.value = '';
        }

        e.preventDefault();
    };

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
                {comments === null ? (
                    <div>{errorMessage}</div>
                ) : (
                    comments.map((comment) => <Comment {...comment} />)
                )}
            </div>
        </div>
    );
};

export default App;
