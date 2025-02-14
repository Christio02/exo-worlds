CREATE TABLE IF NOT EXISTS planets (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    mass DOUBLE PRECISION NOT NULL,
    radius DOUBLE PRECISION NOT NULL,
    planet_type VARCHAR(255) NOT NULL,
    habitability_index DOUBLE PRECISION NOT NULL,
    image_type VARCHAR(255) NOT NULL,
    image_data BYTEA NOT NULL
);