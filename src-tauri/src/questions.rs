use serde::Serialize;

use crate::error::AppResult;

#[derive(Serialize)]
pub enum QuestionType {
    MultiChoice,
    MultiResponse,
    Binary,
    FillBlank,
    ShortAnswer,
    LongAnswer,
    Match,
    Sequence,
    WordDrag,
    Dropdown,
    Numeric,
    HotSpot,
    Code,
    Math,
    GeoLocation,
}

pub struct Question {
    id: i32,
    deck_id: i32,
    question_id: i32,
    question_type: QuestionType,
    title: String,
    markdown: Option<String>,
    created_at: String,
    updated_at: String,
}

pub struct MultiChoiceQuestion {
    id: i32,
    layout_rows: i32,
    single_answer: bool,
}

pub struct MultiChoiceAnswer {
    id: i32,
    correct: bool,
}

pub struct MultiResponseQuestion {
    id: i32,
    answers: Vec<String>,
    correct_answers: Vec<i32>,
}

pub struct BinaryQuestion {
    id: i32,
    answer: bool,
}

pub struct FillBlankQuestion {
    id: i32,
}

pub struct ShortAnswerQuestion {
    id: i32,
}

pub struct LongAnswerQuestion {
    id: i32,
}

pub struct MatchQuestion {
    id: i32,
}

pub struct SequenceQuestion {
    id: i32,
}

pub struct WordDragQuestion {
    id: i32,
}

pub struct DropdownQuestion {
    id: i32,
}

pub struct NumericQuestion {
    id: i32,
}

pub struct HotspotQuestion {
    id: i32,
}

pub struct CodeQuestion {
    id: i32,
}

pub struct MathQuestion {
    id: i32,
}

pub struct GeoLocationQuestion {
    id: i32,
}

pub struct NewQuestion {
    deck_id: i32,
    question_id: i32,
    question_type: QuestionType,
    title: String,
    markdown: Option<String>,
}

pub async fn new_question(question: NewQuestion) -> AppResult<()> {
    Ok(())
}

// What's the ____ Mr Wolf?
// - split the sentence into a vector
// -
