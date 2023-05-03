import React from 'react';
import Comment from './components/Comment';
import './App.css';

const App: React.FC = () => {
    const comment = React.useRef<HTMLTextAreaElement>(null);
    const [comments, setComments] = React.useState<string[]>([]);

    const addComment = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (comment.current !== null && comment.current.value !== '') {
            setComments(comments.concat([comment.current.value]));
            comment.current.value = '';
        }
        e.preventDefault();
    };

    const clearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (comment.current !== null) {
            comment.current.value = '';
        }

        e.preventDefault();
    }

    return (
        <div className="App">
            <div className="container">
                <form>
                    <textarea id="RBcomment" placeholder='Add a comment...' ref={comment}></textarea>
                    <div className="btn">
                        <button id='clearBtn' onClick={clearInput}>Cancel</button>
                        <button id='submitBtn' onClick={addComment}>Comment</button>
                    </div>
                </form>
            </div>
            <div>
                {comments.map((comment) => <Comment message={comment} />)}
            </div>
        </div>
    );
};

export default App;
