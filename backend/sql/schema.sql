DROP SCHEMA IF EXISTS backend_reborn CASCADE;
CREATE SCHEMA backend_reborn;

CREATE TABLE Users (
    user_id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(30),
    UNIQUE (name)
);

CREATE TABLE Comments (
    user_id UUID,
    comment VARCHAR(1024),
    postdate date,
    PRIMARY KEY (comment),
    FOREIGN KEY (user_id) REFERENCES Users (user_id),
    FOREIGN KEY (comment) REFERENCES Comments(comment)
);
CREATE TABLE Video (
    vid_url VARCHAR(100),
    comment VARCHAR(1024),
    PRIMARY KEY (vid_url),
    FOREIGN KEY (comment) REFERENCES Comments(comment)
);
