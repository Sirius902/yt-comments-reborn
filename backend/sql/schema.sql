DROP SCHEMA IF EXISTS backend_reborn CASCADE;
CREATE SCHEMA backend_reborn;

CREATE TABLE Users (
    user_id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64)
);

CREATE TABLE Comments (
    comment_id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    comment VARCHAR(8192),
    postdate timestamp,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Videos (
    -- Video IDs are not guaranteed to be 11 characters but in YouTube's current
    -- implementation that is the case. So this is probably fine?
    vid_id CHAR(11),
    comment_id UUID,
    PRIMARY KEY (vid_id),
    FOREIGN KEY (comment_id) REFERENCES Comments(comment_id)
);
