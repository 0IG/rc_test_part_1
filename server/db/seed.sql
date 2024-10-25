\c rc_test;

INSERT INTO
    users (name, email, password, role)
VALUES
    ('Admin', 'admin@admin.admin', 'password', 'admin'),
    ('Alice Johnson', 'alice@example.com', 'password1', 'user'),
    ('Bob Williams', 'bob@example.com', 'password2', 'user'),
    ('Charlie Brown', 'charlie@example.com', 'password3', 'user'),
    ('Dana White', 'dana@example.com', 'password4', 'user'),
    ('Eva Green', 'eva@example.com', 'password5', 'user'),
    ('Frank Miller', 'frank@example.com', 'password6', 'user'),
    ('Grace Lee', 'grace@example.com', 'password7', 'user'),
    ('Hannah Scott', 'hannah@example.com', 'password8', 'user'),
    ('Ian Thompson', 'ian@example.com', 'password9', 'user'),
    ('Jane Smith', 'jane@example.com', 'password10', 'user'),
    ('Kevin Turner', 'kevin@example.com', 'password11', 'user'),
    ('Laura Adams', 'laura@example.com', 'password12', 'user'),
    ('Mike Wilson', 'mike@example.com', 'password13', 'user'),
    ('Nina Patel', 'nina@example.com', 'password14', 'user'),
    ('Oliver Harris', 'oliver@example.com', 'password15', 'user'),
    ('Paula Clark', 'paula@example.com', 'password16', 'user'),
    ('Quincy Lewis', 'quincy@example.com', 'password17', 'user'),
    ('Rachel Martin', 'rachel@example.com', 'password18', 'user'),
    ('Steve King', 'steve@example.com', 'password19', 'user'),
    ('Tina Adams', 'tina@example.com', 'password20', 'user'),
    ('Ursula Carter', 'ursula@example.com', 'password21', 'user');

INSERT INTO
    movies (title, user_id, release_date)
VALUES
    ('The Matrix', 1, '1999-03-31'),
    ('The Godfather', 3, '1972-03-24'),
    ('The Dark Knight', 2, '2008-07-18'),
    ('Pulp Fiction', 4, '1994-10-14'),
    ('Inception', 3, '2010-07-16'),
    ('Avatar', 2, '2009-12-18'),
    ('Titanic', 1, '1997-12-19');

