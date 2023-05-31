DROP SCHEMA IF EXISTS backend_reborn CASCADE;
CREATE SCHEMA backend_reborn;

DROP TABLE IF EXISTS Likes;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    user_id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) UNIQUE NOT NULL,
    picture VARCHAR(2048) NOT NULL,
    name VARCHAR(64) NOT NULL
);

CREATE TABLE Comments (
    comment_id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    -- reply_id: ID of the comment that this comment is a reply to
    -- NULL implies original comment
    reply_id UUID, 
    user_id UUID,
    comment VARCHAR(8192) NOT NULL,
    postdate timestamp NOT NULL,
    -- Video IDs are not guaranteed to be 11 characters but in YouTube's current
    -- implementation that is the case. So this is probably fine?
    vid_id CHAR(11) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Likes (
    comment_id UUID,
    user_id UUID,
    like_bool BOOLEAN NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES Comments(comment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (comment_id, user_id)
);
