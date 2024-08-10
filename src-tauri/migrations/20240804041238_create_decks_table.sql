-- Create the 'deck' table
CREATE TABLE IF NOT EXISTS deck (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    cover_image TEXT UNIQUE,
    archived BOOLEAN CHECK (archived IN (0, 1)) DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (parent_id)
        REFERENCES deck (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create an index on the 'parent_id' column
CREATE INDEX IF NOT EXISTS idx_deck_parent_id on deck (parent_id);
