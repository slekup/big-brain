-- Create the 'decks' table
CREATE TABLE IF NOT EXISTS decks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    cover_image BLOB,
    archived BOOLEAN CHECK (archived IN (0, 1)) DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (parent_id)
        REFERENCES decks (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create an index on the 'parent_id' column
CREATE INDEX IF NOT EXISTS idx_decks_parent_id on decks (parent_id);
