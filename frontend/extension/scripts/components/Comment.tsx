import React from 'react';

export interface Props {
    message: string;
}

const Comment: React.FC<Props> = ({message}) => {
    return (
        <div className='Comment'>
            <p>{message}</p>
        </div>
    );
};

export default Comment;
