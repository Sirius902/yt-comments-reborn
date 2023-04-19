/* Create a schema in Docker, drops all tables contained inside schema with "CASCADE"*/
CREATE SCHEMA backend_reborn;
DROP SCHEMA backend_reborn CASCADE;
/*Recreate the schema*/
CREATE SCHEMA backend_reborn;


CREATE TABLE Users (
    INT user_id,
    VARCHAR(30) name,
    PRIMARY KEY (user_id)
);

CREATE TABLE Comments (
    INT user_id,
    VARCHAR(1024) comment,
    date postdate,
    FOREIGN KEY (user_id) REFERENCES Users (user_id),
    FOREIGN KEY (comment) REFERENCES Comments(comment)
);
CREATE TABLE Video (
    VARCHAR(100) vid_url,
    VARCHAR(1024) comment,
    PRIMARY KEY (vid_url),
    FOREIGN KEY (comment) REFERENCES Comments(comment)
);
