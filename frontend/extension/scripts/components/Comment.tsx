import React from 'react';
import './Comment.css'

export interface Props {
    message: string;
}

const Comment: React.FC<Props> = ({message}) => {
    return (
        <div className='Comment'>
            <div className='Card'>
                <div className='userName'>dummy</div>
                <div className='msg'>{message}</div>
            </div>
            <div>
                <button id='replyBtn'>Reply</button>
            </div>
        </div>
    );
};

export default Comment;
