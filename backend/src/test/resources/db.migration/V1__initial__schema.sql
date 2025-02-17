CREATE TABLE IF NOT EXISTS planets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    mass DOUBLE NOT NULL,
    radius DOUBLE NOT NULL,
    habitability_index DOUBLE NOT NULL,
    image_type VARCHAR(255) NOT NULL,
    image_data BINARY LARGE OBJECT NOT NULL
);