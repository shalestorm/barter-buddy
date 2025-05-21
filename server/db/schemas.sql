DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS connections;
DROP TABLE IF EXISTS connection_requests;
DROP TABLE IF EXISTS messages;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    username VARCHAR(16) NOT NULL,
    email VARCHAR(64) NOT NULL,
    password_hash TEXT NOT NULL,
    bio VARCHAR(255),
    rating int,
    profile_pic TEXT,
    create_date DATE NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL
    );

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    category_id int REFERENCES categories(id)
);

CREATE TABLE user_skills (
    id SERIAL PRIMARY KEY,
    user_id int,
    skill_id int
);

CREATE TABLE connections (
    id SERIAL PRIMARY KEY,
    user_a_id INT REFERENCES users(id),
    user_b_id INT REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE connection_requests (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    message TEXT
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    content TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    connection_id INT REFERENCES connections(id)
);

INSERT INTO users (first_name, last_name, username, email, password_hash, bio, rating, profile_pic, create_date)
VALUES
    ('Cayla', 'Thompson', 'blueeyed95', 'caylaleann18@gmail.com', '12345678', 'Looking for piano lessons!', '', '', '2025-05-20'),
    ('Cayla', 'Johnson', 'greeneyed95', 'caylaleann19@gmail.com', '12345678', 'Looking for rollerblading lessons, please', '', '', '2025-05-20'),
    ('Cayla', 'Wilson', 'greyeyed95', 'caylaleann20@gmail.com', '12345678', 'I like turtles.', '', '', '2025-05-20'),
    ('Cayla', 'Davidson', 'yelloweyed95', 'caylaleann21@gmail.com', '12345678', 'What?', '', '', '2025-05-20'),
    ('Cayla', 'Simpson', 'redeyed95', 'caylaleann22@gmail.com', '12345678', '', '', '', '2025-05-20'),
    ('Cayla', 'Dawson', 'pinkeyed95', 'caylaleann23@gmail.com', '12345678', '', '', '', '2025-05-20'),
    ('Cayla', 'Bobbyson', 'beigeeyed95', 'caylaleann24@gmail.com', '12345678', '', '', '', '2025-05-20'),
    ('Cayla', 'Billyson', 'wideeyed95', 'caylaleann25@gmail.com', '12345678', '', '', '', '2025-05-20'),
    ('Cayla', 'Jayson', 'buggyeyed95', 'caylaleann26@gmail.com', '12345678', '', '', '', '2025-05-20');

INSERT INTO categories (name) VALUES
    ('Music & Performing Arts'),
    ('Creative Crafts'),
    ('Trades & Technical'),
    ('Culinary & Baking'),
    ('Fitness & Sports'),
    ('Language & Communication'),
    ('Academic & Tutoring'),
    ('Gaming & Digital'),
    ('Wellness & Lifestyle'),
    ('Automotive & Mechanics'),
    ('Outdoor & Survival'),
    ('Other');

INSERT INTO skills (name, category_id) VALUES
    ('Guitar', 1),
    ('Spanish', 6),
    ('Twiddling my toes', 12),
    ('Minecraft speedruns', 8);

INSERT INTO user_skills (user_id, skill_id) VALUES
    (1, 1),
    (1, 4),
    (3, 2),
    (4, 1),
    (4, 2),
    (5, 3),
    (6, 1),
    (6, 2),
    (6, 3),
    (9, 3);

INSERT INTO connections (user_a_id, user_b_id, is_active)
VALUES
    (1, 3, TRUE),   -- blueeyed95 + greyeyed95
    (2, 4, TRUE),   -- greeneyed95 + yelloweyed95
    (6, 9, TRUE);   -- pinkeyed95 + buggyeyed95

INSERT INTO connection_requests (sender_id, receiver_id, message)
VALUES
    (5, 7, 'Hey there! Want to trade some skills?'), -- redeyed95 -> beigeeyed95
    (8, 2, 'Hi! checked out your listed skills would love to connect!'), -- wideeyed95 -> greeneyed95
    (3, 1, 'Wanna jam sometime?'); -- greyeyed95 -> blueeyed95


INSERT INTO messages (sender_id, receiver_id, content, timestamp, is_read, connection_id)
VALUES
    -- log examples for users 1 and 3 also set latest msg to unread -- also ensured that the connection matches with existing actual connections
    (1, 3, 'Hey! How’s it going?', NOW(), TRUE, 1),
    (3, 1, 'Good! fiddlin with my sick af guitar.', NOW(), TRUE, 1),
    (1, 3, 'Awesome, lets boogie bro - mind teaching me?', NOW(), FALSE, 1),

    -- 2 and 4
    (2, 4, 'Hey, are you free on the weekends for showing me a thing or two about chess?', NOW(), TRUE, 2),
    (4, 2, 'Sure! How about this weekend? maybe next weekend you could teach me how to twiddle my toes :O', NOW(), TRUE, 2),

    -- 6 and 9
    (6, 9, 'Yo dude, i noticed in your bio you listed 40 years of yo-yo trick experience?', NOW(), TRUE, 3),
    (9, 6, 'Haha, you know it, would you want me to show you a few, really been meaning to start learning french again!', NOW(), TRUE, 3);
