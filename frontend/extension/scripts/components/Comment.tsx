import React, {useState} from 'react';
import {TfiAngleDown} from 'react-icons/tfi';
import {Collapse} from 'react-collapse';
// TODO: Parse UTC strings into readable format
// import moment from 'moment';
import './Comment.css';
import type {CommentJson} from '../App';

export interface Props {
    comments: CommentJson[];
    comment: CommentJson;
}

const Comment: React.FC<Props> = ({comments, comment}) => {
    const [expanded, setExpanded] = useState(false);
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setExpanded(!expanded);
        e.preventDefault();
    };
    const {name, comment: message, postdate} = comment;
    const replies = comments.filter(
        (reply) => reply.comment_id === reply.reply_id
    );
    return (
        <div className="Comment">
            <div className="Card">
                <div className="userName">{name}</div>
                <div className="msg">{message}</div>
                <div>{postdate}</div>
            </div>
            <div>
                <button className="replyBtn">Reply</button>
            </div>
            <button className="replyChain" onClick={onClick}>
                <TfiAngleDown />
            </button>
            <div>
                <Collapse isOpened={expanded}>
                    <div className="replies">
                        {replies.map((reply) => (
                            <Comment comments={comments} comment={reply} />
                        ))}
                    </div>
                </Collapse>
            </div>
        </div>
    );
};

export default Comment;
