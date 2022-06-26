CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL, 
    "createdAt" timestamp DEFAULT NOW(),
    "updatedAt" timestamp
);

INSERT INTO users (firstname, lastname, username, email, password)
VALUES ('John', 'Doe', 'jd', 'john@gmail.com', '$2a$10$ZR2sHP9KuYxykbHLCO/7/eDzu7ja.lRusRqErALC2/C.3wUqwTDTO')