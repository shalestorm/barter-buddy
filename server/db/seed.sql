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
    rating int DEFAULT NULL,
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
	('Cayla', 'Thompson', 'blueeyed95', 'caylaleann18@gmail.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Looking for piano lessons!', NULL, 'http://localhost:8000/static/profile_pics/cayla2.jpg', '2025-05-20'),
    ('Liam', 'Bennett', 'liamben001', 'liamben001@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Love teaching guitar!', NULL, 'http://localhost:8000/static/profile_pics/default.png', '2025-05-29'),
    ('Emma', 'Clark', 'emmaclark002', 'emmaclark002@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'I would love to learn about photography and cooking!', NULL, 'http://localhost:8000/static/profile_pics/emma.png', '2025-05-29'),
    ('Noah', 'Garcia', 'noahg003', 'noahg003@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Learning jazz piano.', NULL, 'http://localhost:8000/static/profile_pics/noah.png', '2025-05-29'),
    ('Olivia', 'Rodriguez', 'oliviar004', 'oliviar004@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'I can make jewlery, and would love to learn how to rock climb ', NULL, 'http://localhost:8000/static/profile_pics/olivia.png', '2025-05-29'),
    ('Elijah', 'Lee', 'elijahlee005', 'elijahlee005@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Drummer & cat dad.', NULL, 'http://localhost:8000/static/profile_pics/default.png', '2025-05-29'),
    ('Ava', 'Young', 'avayoung006', 'avayoung006@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'I am a drummer, would like to learn how to change oil in my car', NULL, 'http://localhost:8000/static/profile_pics/ava.png', '2025-05-29'),
    ('James', 'Hall', 'jameshall007', 'jameshall007@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Beginner violinist.', NULL, 'http://localhost:8000/static/profile_pics/james.png', '2025-05-29'),
    ('Sophia', 'Allen', 'sophiaa008', 'sophiaa008@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Harry Potter Enthusiast, can teach piano and violin', NULL, 'http://localhost:8000/static/profile_pics/default.png', '2025-05-29'),
    ('Benjamin', 'Wright', 'benwright009', 'benwright009@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Open to jam sessions!', NULL, 'http://localhost:8000/static/profile_pics/ben.png', '2025-05-29'),
    ('Isabella', 'King', 'isabellak010', 'isabellak010@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Im an electrician, I love to bake cookies ', NULL, 'http://localhost:8000/static/profile_pics/default.png', '2025-05-29'),
    ('Lucas', 'Scott', 'lucass011', 'lucass011@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Looking for a tutor.', NULL, 'http://localhost:8000/static/profile_pics/default.png', '2025-05-29'),
    ('Mia', 'Green', 'miag012', 'miag012@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', '', NULL, 'http://localhost:8000/static/profile_pics/default.png', '2025-05-29'),
    ('Henry', 'Adams', 'henrya013', 'henrya013@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Classical music fan.', NULL, 'http://localhost:8000/static/profile_pics/default.png', '2025-05-29'),
    ('Amelia', 'Nelson', 'amelian014', 'amelian014@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'I play soccer, and do pottery. I want to learn more about foraging for edible plants', NULL, 'http://localhost:8000/static/profile_pics/amelia.png', '2025-05-29'),
    ('Alexander', 'Carter', 'alexcarter015', 'alexcarter015@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Flute player & teacher.', NULL, 'http://localhost:8000/static/profile_pics/alexander.png', '2025-05-29'),
    ('Charlotte', 'Mitchell', 'charm016', 'charm016@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Word and Excel enthusiast', NULL, 'http://localhost:8000/static/profile_pics/default.png', '2025-05-29'),
    ('Daniel', 'Perez', 'danp017', 'danp017@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Music theory nerd.', NULL, 'http://localhost:8000/static/profile_pics/daniel.png', '2025-05-29'),
    ('Evelyn', 'Roberts', 'evelynr018', 'evelynr018@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Underwater Basket Weaving instructor, want to learn yoga', NULL, 'http://localhost:8000/static/profile_pics/evelyn.png', '2025-05-29'),
    ('Matthew', 'Turner', 'mattt019', 'mattt019@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Gigging every weekend. Rock Climbing Nerd', NULL, 'http://localhost:8000/static/profile_pics/matthew.png', '2025-05-29'),
    ('Abigail', 'Phillips', 'abip020', 'abip020@example.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Coffee Snob, Drama coach', NULL, 'http://localhost:8000/static/profile_pics/default.png', '2025-05-29'),
    ('Tiberius', 'James', 'tiorion', 'tjames@orionrising.dev', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'Can teach coding. Looking to learn how to read music.', NULL, 'http://localhost:8000/static/profile_pics/ti.png', '2025-05-30'),
    ('Skyler', 'McLain', 'shale', 'allhailtheshale@shale.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'I want to learn how to drive a tractor', NULL, 'http://localhost:8000/static/profile_pics/skyler.png', '2025-05-30'),
    ('Ricardo', 'Tizón', 'pakoh', 'pakoh@pakoh.com', '$2b$12$gWJVTEyNpdQv.Gm4wQfHf.jhyLlt3gTfNtoLkHtvGM9cdKPx1YUCu', 'I can teach you Spanish.', NULL, 'http://localhost:8000/static/profile_pics/ric.png', '2025-05-30');

INSERT INTO categories (name) VALUES
    ('Music & Performing Arts'), --1
    ('Creative Crafts'), --2
    ('Trades & Technical'), --3
    ('Culinary & Baking'), --4
    ('Fitness & Sports'), --5
    ('Language & Communication'), --6
    ('Academic & Tutoring'), --7
    ('Gaming & Digital'), --8
    ('Wellness & Lifestyle'), --9
    ('Automotive & Mechanics'), --10
    ('Outdoor & Survival'), --11
    ('Other'); --12

INSERT INTO skills (name, category_id) VALUES
	('Guitar', 1),
    ('Spanish', 6),
    ('Twiddling my toes', 12),
    ('Minecraft speedruns', 8),
    ('Singing', 1),
    ('Drumming', 1),
    ('Theater Acting', 1),
    ('Violin', 1),
    ('Knitting', 2),
    ('Watercolor Painting', 2),
    ('Jewelry Making', 2),
    ('Pottery', 2),
    ('Welding', 3),
    ('Carpentry', 3),
    ('3D Printing', 3),
    ('Electrical Wiring', 3),
    ('Cake Decorating', 4),
    ('Sushi Rolling', 4),
    ('Bread Baking', 4),
    ('Grilling Techniques', 4),
    ('Yoga', 5),
    ('Boxing', 5),
    ('Soccer', 5),
    ('Rock Climbing', 5),
    ('American Sign Language', 6),
    ('French', 6),
    ('Public Speaking', 6),
    ('Debate Skills', 6),
    ('Calculus Tutoring', 7),
    ('Essay Writing', 7),
    ('Physics Help', 7),
    ('SAT Prep', 7),
    ('Game Modding', 8),
    ('Twitch Streaming', 8),
    ('Roblox Game Design', 8),
    ('Unity Game Development', 8),
    ('Meditation Techniques', 9),
    ('Home Organization', 9),
    ('Time Management', 9),
    ('Skincare Routines', 9),
    ('Engine Diagnostics', 10),
    ('Brake Repair', 10),
    ('Oil Change Basics', 10),
    ('Motorcycle Maintenance', 10),
    ('Fire Starting', 11),
    ('Backpacking', 11),
    ('Navigation with Maps', 11),
    ('Foraging Edible Plants', 11),
    ('Juggling', 12),
    ('Balloon Animals', 12),
    ('Speed Cubing', 12),
    ('Fantasy Map Making', 12);

INSERT INTO user_skills (user_id, skill_id) VALUES
    (1, 1),
    (1, 19),
    (1, 35),
    (1, 39),
    (1, 51),
    (1, 52),
    (2, 1),
    (3, 1),
    (3, 15),
    (3, 34),
    (3, 47),
    (4, 7),
    (4, 9),
    (4, 10),
    (4, 17),
    (4, 21),
    (4, 29),
    (5, 3),
    (5, 11),
    (5, 17),
    (5, 24),
    (5, 36),
    (5, 52),
    (6, 1),
    (6, 9),
    (7, 6),
    (7, 14),
    (7, 27),
    (7, 33),
    (7, 43),
    (7, 49),
    (8, 1),
    (9, 1),
    (9, 12),
    (9, 50),
    (10, 2),
    (10, 15),
    (10, 25),
    (10, 32),
    (10, 40),
    (10, 46),
    (11, 4),
    (11, 16),
    (11, 19),
    (11, 26),
    (11, 35),
    (11, 51),
    (12, 12),
    (14, 1),
    (14, 33),
    (15, 8),
    (15, 12),
    (15, 23),
    (15, 31),
    (15, 38),
    (15, 48),
    (16, 1),
    (18, 5),
    (18, 22),
    (18, 30),
    (18, 39),
    (18, 47),
    (18, 52),
    (19, 5),
    (19, 1),
    (19, 41),
    (19, 49),
    (20, 5),
    (22, 6),
    (22, 9),
    (22, 47),
    (23, 4),
    (23, 15),
    (23, 48),
    (24, 2),
    (24, 10),
    (24, 23);

INSERT INTO connections (user_a_id, user_b_id, is_active)
VALUES
    (1, 2, TRUE),   -- blueeyed95 + liamben001
    (1, 3, TRUE),   -- blueeyed95 + emmaclark002
    (1, 4, TRUE),   -- blueeyed95 + noahg003
    (1, 9, TRUE),   -- blueeyed95 + sophiaa008
    (2, 4, TRUE),   -- liamben001 + noahg003
    (2, 3, TRUE),   -- liamben001 + emmaclark002
    (6, 9, TRUE),   -- elijahlee005 + sophiaa008
    (9, 3, TRUE),   -- sophiaa008 + emmaclark002
    (1, 22, TRUE),  -- blueeyed95 + tiorion
    (1, 23, TRUE),  -- blueeyed95 + shale
    (1, 23, TRUE),  -- blueeyed95 + pakoh
    (22, 23, TRUE),  -- tiorion + shale
    (22, 24, TRUE),  -- tiorion + pakoh
    (23, 24, TRUE);  -- shale + pakoh

INSERT INTO connection_requests (sender_id, receiver_id, message)
VALUES
    (1, 7, 'Hey there! Want to trade some skills?'), -- blueeyed95 -> avayoung00
    (1, 10, 'Hi! checked out your listed skills would love to connect!'), -- blueeyed95 -> benwright009
    (11, 1, 'Wanna jam sometime?'), -- isabellak010 -> blueeyed95
    (13, 1, 'Hi there! Wanna be buddies?'), -- miag012 -> blueeyed95
    (20, 1, 'New here, but would love to connect.'); -- mattt019 -> blueeyed95


INSERT INTO messages (sender_id, receiver_id, content, timestamp, is_read, connection_id)
VALUES
    -- log examples for users 1 (blueeyed95) and 3 (emmaclark002) also set latest msg to unread
    (1, 3, 'Hey! How’s it going?', NOW(), TRUE, 2),
    (3, 1, 'Good! fiddlin with my guitar.', NOW(), TRUE, 2),
    (1, 3, 'Awesome, lets boogie bro - mind teaching me?', NOW(), FALSE, 2),

    -- 2 (liamben001) and 4(noahg003)
    (2, 4, 'Hey, are you free on the weekends for showing me a thing or two about chess?', NOW(), TRUE, 5),
    (4, 2, 'Sure! How about this weekend? maybe next weekend you could teach me how to twiddle my toes :O', NOW(), TRUE, 5),

    -- 6 (elijahlee005) and 9 (sofiaa008)
    (6, 9, 'Yo dude, i noticed in your bio you listed 40 years of yo-yo trick experience?', NOW(), TRUE, 7),
    (9, 6, 'Haha, you know it, would you want me to show you a few, really been meaning to start learning french again!', NOW(), TRUE, 7);
