import React, { useEffect, useState } from 'react';
import Comment from './components/Comment';
import './App.css';

interface Props {
    videoId: string;
}

export type CommentJson = {
    comment_id: string;
    reply_id: string;
    user_id: string;
    comment: string;
    postdate: string;
    vid_id: string;
};

const backendUrl = 'http://localhost:3010';

const App: React.FC<Props> = ({ videoId }) => {
    const commentBox = React.useRef<HTMLTextAreaElement>(null);
    const [errorMessage, setErrorMessage] = useState('Loading...');
    const [comments, setComments] = useState<CommentJson[] | null>(null);

    useEffect(() => {
            fetch(`${backendUrl}/v0/comment?vid_id=${videoId}`, {
                method: 'GET',
            }).then((res) => {
                if (res.ok) {
                    res.json().then((json) => setComments(json as CommentJson[]));
                } else {
                    setErrorMessage('Failed to load comments!');
                }
            }).catch((e) => {
                if (e instanceof Error) {
                    console.log(e.message);
                } else {
                    console.log(`oh no what is this error thing: ${e}`);
                }
            });
    }, [comments]);

    const addComment = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (commentBox.current !== null && commentBox.current.value !== '') {
            console.log(`added a comment ${commentBox.current.value}`);
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
                    <textarea id="RBcomment" placeholder='Add a comment...' ref={commentBox}></textarea>
                    <div className="btn">
                        <button id='clearBtn' onClick={clearInput}>Cancel</button>
                        <button id='submitBtn' onClick={addComment}>Comment</button>
                    </div>
                </form>
            </div>
            <div>
                {comments === null ? <div>{errorMessage}</div>
                    : comments.map((comment) => <Comment {...comment} />)}
            </div>
        </div>
    );
};

export default App;
