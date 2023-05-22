export type UserInfo = {
    name: string;
    email: string;
    picture: string;
};

export type User = {
    user_id: string;
    name: string;
    email: string;
    picture: string;
};

export type CommentInfo = {
    reply_id: string;
    comment: string;
    vid_id: string;
};

export type Comment = {
    comment_id: string;
    reply_id: string;
    user_id: string;
    comment: string;
    postdate: string;
    vid_id: string;
    name: string;
};

export type AuthUser = {
    access_token: string;
};

export type Credentials = {
    token: string;
};
