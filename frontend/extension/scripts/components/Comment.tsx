import React, {useState} from 'react';
import {TfiAngleDown, TfiAngleUp} from 'react-icons/tfi';
import {BiLike, BiDislike} from 'react-icons/bi';
import {Collapse} from 'react-collapse';
import moment from 'moment';
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
    /** Generates a CommentJson[] of all replies to a comment */
    const replies = comments.filter(
        (reply) => comment.comment_id === reply.reply_id
    );
    const relativePostDate = moment.utc(postdate).fromNow();
    return (
        <div className="Comment">
            <div className="Card">
                <div className="header">
                    <div className="userName">{name}</div>
                    <div className="date">{relativePostDate}</div>
                </div>
                <div className="msg">{message}</div>
            </div>
            <div className="footer">
                <button className="like">
                    <BiLike></BiLike>
                </button>
                <button className="dislike">
                    <BiDislike></BiDislike>
                </button>
                <button className="replyBtn">Reply</button>
            </div>
            {replies.length > 0 ? (
                <div className="replyFeatures">
                    <button className="replyChain" onClick={onClick}>
                        {expanded ? <TfiAngleUp /> : <TfiAngleDown />}
                    </button>
                    {replies.length > 1 ? (
                        <p className="replyCounter">{replies.length} replies</p>
                    ) : (
                        <p className="replyCounter">{replies.length} reply</p>
                    )}
                </div>
            ) : null}
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
