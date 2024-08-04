CREATE TABLE{
    user_id INT PRIMARY KEY,
    user_name VARCHAR(50),
    user_pass VARCHAR(256),
    registration_date DATE NOT NULL,
    PRIMARY KEY(user_id),
    UNIQUE KEY(user_name)
    };