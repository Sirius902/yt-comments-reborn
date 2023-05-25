import React, {useState} from 'react';
import {TfiAngleDown, TfiAngleUp} from 'react-icons/tfi';
import {BiLike, BiDislike} from 'react-icons/bi';
import {Collapse} from 'react-collapse';
import moment from 'moment-timezone';
import './Comment.css';
import type {CommentJson} from '../App';

export interface Props {
    comments: CommentJson[];
    comment: CommentJson;
}

const Comment: React.FC<Props> = ({comments, comment}) => {
    const replyBox = React.useRef<HTMLTextAreaElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [input, setInput] = useState(false);

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setExpanded(!expanded);
        e.preventDefault();
    };

    const createReplyInput = (e: React.MouseEvent<HTMLButtonElement>) => {
        setInput(!input);
        e.preventDefault();
    };

    const clearReplyInput = (e: React.MouseEvent<HTMLButtonElement>) => {
        setInput(false);
        e.preventDefault();
    };

    const {name, comment: message, postdate} = comment;
    /** Generates a CommentJson[] of all replies to a comment */
    const replies = comments.filter(
        (reply) => comment.comment_id === reply.reply_id
    );
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const relativePostDate = moment
        .utc(new Date(postdate))
        .tz(timezone)
        .fromNow();
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
                <button className="replyBtn" onClick={createReplyInput}>
                    Reply
                </button>
            </div>
            <div>
                {input ? (
                    <form>
                        <textarea
                            className="replyInput"
                            placeholder="Add a reply..."
                            ref={replyBox}
                        ></textarea>
                        <div className="replyInputButtons">
                            <button
                                className="replyClearBtn"
                                onClick={clearReplyInput}
                            >
                                Cancel
                            </button>
                            {/* Create reply submission function */}
                            <button className="replySubmitBtn">Comment</button>
                        </div>
                    </form>
                ) : null}
            </div>
            {replies.length > 0 ? (
                <div className="replyFeatures">
                    <button className="replyChain" onClick={onClick}>
                        {expanded ? (
                            <TfiAngleUp className="replyArrow" />
                        ) : (
                            <TfiAngleDown className="replyArrow" />
                        )}
                        {replies.length > 1 ? (
                            <p className="replyCounter">
                                {replies.length} replies
                            </p>
                        ) : (
                            <p className="replyCounter">
                                {replies.length} reply
                            </p>
                        )}
                    </button>
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
