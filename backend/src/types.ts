/**
 * The information necessary to create a user.
 */
export type UserInfo = {
    name: string;
    email: string;
    picture: string;
};

/**
 * A created and fully populated user.
 */
export type User = {
    user_id: string;
    name: string;
    email: string;
    picture: string;
};

/**
 * The information necessary to create a comment.
 */
export type CommentInfo = {
    reply_id: string;
    comment: string;
    vid_id: string;
};

/**
 * A created and fully populated comment.
 */
export type Comment = {
    comment_id: string;
    reply_id: string;
    user_id: string;
    comment: string;
    postdate: string;
    vid_id: string;
    name: string;
};

/**
 * An authenticated user. This includes the access token the user needs to
 * provide on authenticated endpoints.
 */
export type AuthUser = {
    access_token: string;
};

/**
 * Credentials received from the user, includes a token which is passed to
 * the auth provider for authentication.
 */
export type Credentials = {
    token: string;
};
