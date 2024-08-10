-- Create the 'question' table
CREATE TABLE IF NOT EXISTS question (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER NOT NULL,
    question_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    archived BOOLEAN CHECK (archived IN (0, 1)) DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (deck_id)
        REFERENCES deck (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create an index on the 'deck_id' column
CREATE INDEX IF NOT EXISTS idx_question_deck_id on question (deck_id);



-- Create the 'multi_choice_question' table
CREATE TABLE IF NOT EXISTS multi_choice_question (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    layout_rows INTEGER NOT NULL ,
    single_answer BOOLEAN CHECK (single_answer IN (0, 1)) DEFAULT 0,
    FOREIGN KEY (question_id)
        REFERENCES question (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create an index on the 'question_id' column
CREATE INDEX IF NOT EXISTS idx_multi_choice_question_question_id on multi_choice_question (question_id);



-- Create the 'multi_choice_answer' table
CREATE TABLE IF NOT EXISTS multi_choice_answer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    content TEXT,
    image TEXT UNIQUE,
    correct BOOLEAN CHECK (correct IN (0, 1)) DEFAULT 0,
    FOREIGN KEY (question_id)
        REFERENCES question (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

-- Create an index on the 'question_id' column
CREATE INDEX IF NOT EXISTS idx_multi_choice_answer_question_id on multi_choice_answer (question_id);
