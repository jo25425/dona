-- Custom SQL migration file, put your code below! --
ALTER TABLE donations
    ADD COLUMN created_at TIMESTAMP DEFAULT NOW() NOT NULL;
