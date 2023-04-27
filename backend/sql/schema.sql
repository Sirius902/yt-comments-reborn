DROP SCHEMA IF EXISTS backend_reborn CASCADE;
CREATE SCHEMA backend_reborn;

CREATE TABLE Users (
    user_id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
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


