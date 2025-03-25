CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  content VARCHAR(255) NOT NULL
);

INSERT INTO messages (content) VALUES ('Hello World');
