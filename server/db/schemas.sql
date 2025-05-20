DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS connections;
DROP TABLE IF EXISTS connection_requests
DROP TABLE IF EXISTS messages;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    username VARCHAR(16) NOT NULL,
    email VARCHAR(64) NOT NULL,
    password_hash TEXT NOT NULL, --???
    bio VARCHAR(255),
    rating int,
    profile_pic TEXT,
    create_date DATE NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    category_id int,
);

CREATE TABLE user_skills (
    id SERIAL PRIMARY KEY,
    user_id int,
    skill_id int,
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
    ("Music & Performing Arts"), --1
    ("Creative Crafts"), --2
    ("Trades & Technical"), --3
    ("Culinary & Baking"), --4
    ("Fitness & Sports"), --5
    ("Language & Communication"), --6
    ("Academic & Tutoring"), --7
    ("Gaming & Digital"), --8
    ("Wellness & Lifestyle"), --9
    ("Automotive & Mechanics"), --10
    ("Outdoor & Survival"), --11
    ("Other"); --12

INSERT INTO skills (name, category_id) VALUES
    ("Guitar", 1),
    ("Spanish", 6),
    ("Twiddling my toes", 12),
    ("Minecraft speedruns", 8);

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
