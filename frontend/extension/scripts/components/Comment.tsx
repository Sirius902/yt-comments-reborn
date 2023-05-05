import React from 'react';
import './Comment.css';
import type {CommentJson} from '../App';

export type Props = CommentJson;

const Comment: React.FC<Props> = ({comment, name, postdate}) => {
    return (
        <div className="Comment">
            <div className="Card">
                <div className="userName">{name}</div>
                <div className="msg">{comment}</div>
                <div>{postdate}</div>
            </div>
            <div>
                <button id="replyBtn">Reply</button>
            </div>
        </div>
    );
};

export default Comment;
