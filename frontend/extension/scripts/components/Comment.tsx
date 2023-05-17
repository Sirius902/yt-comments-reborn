import React, {useState, useCallback} from 'react';
import {TfiAngleDown} from 'react-icons/tfi';
import {Collapse, UnmountClosed} from 'react-collapse';
import './Comment.css';
import type {CommentJson} from '../App';

export type Props = CommentJson;

const Comment: React.FC<Props> = ({comment, name, postdate}) => {
    const [expanded, setExpanded] = useState(false);
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setExpanded(!expanded);
        e.preventDefault();
    };
    return (
        <div className="Comment">
            <div className="Card">
                <div className="userName">{name}</div>
                <div className="msg">{comment}</div>
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
                    <div>some bullshit</div>
                </Collapse>
            </div>
        </div>
    );
};

export default Comment;
