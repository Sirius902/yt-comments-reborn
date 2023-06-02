import React, {useState} from 'react';
import {TfiAngleDown, TfiAngleUp} from 'react-icons/tfi';
import {
    AiFillDislike,
    AiFillLike,
    AiOutlineDislike,
    AiOutlineLike,
} from 'react-icons/ai';
import {Collapse} from 'react-collapse';
import moment from 'moment-timezone';
import './Comment.css';
import type {NewCommentJson} from '../App';
import type {CommentJson} from '../App';

export interface Props {
    comments: CommentJson[];
    comment: CommentJson;
    accessToken: string;
    videoId: string;
    refetch: () => void;
    topComment: string;
}

const backendUrl = 'http://localhost:3010';

const Comment: React.FC<Props> = ({
    comments,
    comment,
    accessToken,
    videoId,
    refetch,
    topComment,
}) => {
    const replyBox = React.useRef<HTMLTextAreaElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [input, setInput] = useState(false);

    /**
     * Expands/contracts reply chains/threads on click
     * @param {React.MouseEvent<HTMLButtonElement>} e
     */
    const toggleReplyChain = (e: React.MouseEvent<HTMLButtonElement>) => {
        setExpanded(!expanded);
        e.preventDefault();
    };

    /**
     * Creates input field for replies
     * @param {React.MouseEvent<HTMLButtonElement>} e
     */
    const createReplyInput = (e: React.MouseEvent<HTMLButtonElement>) => {
        setInput(!input);
        e.preventDefault();
    };

    /**
     * Clears reply input field
     * @param {React.MouseEvent<HTMLButtonElement>} e
     */
    const clearReplyInput = (e: React.MouseEvent<HTMLButtonElement>) => {
        setInput(false);
        e.preventDefault();
    };

    /**
     * POSTs a reply to the backend.
     * Once the POST request is completed,
     * refetch() is called to reload the comments.
     * @param {NewCommentJson} reply a NewCommentJson to send to the backend
     * @return {Promise<CommentJson | undefined>} response from backend
     */
    const postReply = async (reply: NewCommentJson) => {
        if (accessToken == null) {
            return;
        }
        const request = new Request(`${backendUrl}/v0/comment`, {
            method: 'POST',
            headers: {
                [`Authorization`]: `Bearer ${accessToken}`,
                [`Content-Type`]: 'application/json',
            },
            body: JSON.stringify(reply),
        });
        const res = await fetch(request);
        if (res.ok) {
            refetch();
            return (await res.json()) as CommentJson;
        } else {
            res.json().then((json) => console.log(json));
        }
    };

    /**
     * Called upon clicking replySubmitBtn
     * Calls postReply() with the current
     * replyBox value, reply_id, and vid_id.
     * Sets replyBox value to '' once postReply()
     * is completed.
     * Clears input field after posting a reply.
     * @param {React.MouseEvent<HTMLButtonElement>} e
     */
    const addReply = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (replyBox.current !== null && replyBox.current.value !== '') {
            postReply({
                comment: replyBox.current.value,
                reply_id: topComment,
                vid_id: videoId,
            });
            replyBox.current.value = '';
        }
        setInput(false);
        e.preventDefault();
    };

    /**
     * Upon clicking either like or dislike button
     * changes like status for current user with a boolean
     * Upon click either like or dislike, sends a PUT request
     * the backend and refetches comments/replies
     * if request is successful
     * @param {boolean} value
     * @return {void}
     */
    const changeLike =
        (value: boolean) => async (_e: React.MouseEvent<HTMLButtonElement>) => {
            if (accessToken == null) {
                return;
            }
            const request = new Request(
                `${backendUrl}/v0/like/${comment.comment_id}?value=${value}`,
                {
                    method: 'PUT',
                    headers: {
                        [`Authorization`]: `Bearer ${accessToken}`,
                    },
                }
            );
            const res = await fetch(request);
            if (res.ok) {
                refetch();
            } else {
                res.json().then((json) => console.log(json));
            }
        };

    const {
        name,
        comment: message,
        postdate,
        profile_picture: profilePicture,
    } = comment;

    /** Generates a CommentJson[] of all replies to a comment */
    const replies = comments.filter(
        (reply) => comment.comment_id === reply.reply_id
    );
    const relativePostDate = moment.utc(postdate).fromNow();
    const replyText = comment.reply_id != null ? `@${name} ` : ``;
    return (
        <div className="Comment" aria-label="comment">
            <div className="format">
                {comment.reply_id == null ? (
                    <div className="pfp">
                        <img src={profilePicture} />
                    </div>
                ) : (
                    <div className="replyPfp">
                        <img src={profilePicture} />
                    </div>
                )}
                <div className="body">
                    <div className="Card">
                        <div className="header">
                            <div className="userName">{name}</div>
                            <div className="date">{relativePostDate}</div>
                        </div>
                        <div className="msg">{message}</div>
                    </div>
                    <div className="footer">
                        <button
                            className="like"
                            aria-label="like"
                            onClick={changeLike(true)}
                        >
                            {comment.is_liked ? (
                                <AiFillLike />
                            ) : (
                                <AiOutlineLike />
                            )}
                        </button>
                        <span aria-label="likes">{comment.likes}</span>
                        <button
                            className="dislike"
                            aria-label="dislike"
                            onClick={changeLike(false)}
                        >
                            {comment.is_disliked ? (
                                <AiFillDislike />
                            ) : (
                                <AiOutlineDislike />
                            )}
                        </button>
                        <span aria-label="dislikes">{comment.dislikes}</span>
                        <button
                            className="replyBtn"
                            aria-label="reply"
                            onClick={createReplyInput}
                        >
                            Reply
                        </button>
                    </div>
                    <div>
                        {input ? (
                            <form>
                                <textarea
                                    aria-label="reply-box"
                                    className="replyInput"
                                    placeholder="Add a reply..."
                                    ref={replyBox}
                                >
                                    {replyText}
                                </textarea>
                                <div className="replyInputButtons">
                                    <button
                                        aria-label="cancel-reply"
                                        className="replyClearBtn"
                                        onClick={clearReplyInput}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        aria-label="submit-reply"
                                        className="replySubmitBtn"
                                        onClick={addReply}
                                    >
                                        Reply
                                    </button>
                                </div>
                            </form>
                        ) : null}
                    </div>
                    {replies.length > 0 ? (
                        <div className="replyFeatures">
                            <button
                                className="replyChain"
                                onClick={toggleReplyChain}
                            >
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
                </div>
            </div>
            <div>
                <Collapse isOpened={expanded}>
                    <div className="replies">
                        {replies.map((reply, i) => (
                            <Comment
                                key={i}
                                comments={comments}
                                comment={reply}
                                accessToken={accessToken}
                                videoId={videoId}
                                refetch={refetch}
                                topComment={comment.comment_id}
                            />
                        ))}
                    </div>
                </Collapse>
            </div>
        </div>
    );
};

export default Comment;
