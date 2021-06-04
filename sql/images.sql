DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id              SERIAL PRIMARY KEY,
    url             VARCHAR NOT NULL,
    username        VARCHAR NOT NULL,
    title           VARCHAR NOT NULL,
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments( 
    id              SERIAL PRIMARY KEY,
    image_id        INTEGER NOT NULL REFERENCES images (id),
    comment_text    TEXT,
    username        VARCHAR NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

