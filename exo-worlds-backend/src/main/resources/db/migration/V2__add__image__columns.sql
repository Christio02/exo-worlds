ALTER TABLE planets
    ADD COLUMN IF NOT EXISTS image_data BYTEA,
    ADD COLUMN IF NOT EXISTS image_type VARCHAR(255);

UPDATE planets
SET image_data = decode('', 'hex'),
    image_type = 'image/jpeg'
WHERE image_data IS NULL;

ALTER TABLE planets
    ALTER COLUMN image_data SET NOT NULL,
ALTER COLUMN image_type SET NOT NULL;