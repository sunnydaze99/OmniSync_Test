DROP TABLE IF EXISTS cards;

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    click_count INT DEFAULT 0,
    first_click TIMESTAMP NULL
);

INSERT INTO cards (id, click_count, first_click) VALUES
(1, 0, NULL),
(2, 0, NULL),
(3, 0, NULL),
(4, 0, NULL),
(5, 0, NULL),
(6, 0, NULL),
(7, 0, NULL),
(8, 0, NULL);
