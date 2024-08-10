use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, SqlitePool};
use tauri::State;
use tokio::time::Instant;
use tracing::info;

use crate::{error::AppResult, state::AppState};

#[derive(Serialize, Deserialize, sqlx::Type)]
#[serde(rename_all = "snake_case")]
pub enum QuestionType {
    MultiChoice,
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
    Geolocation,
}

impl std::fmt::Display for QuestionType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        // Must be the same as the prefix for the question type table.
        let res = match self {
            QuestionType::MultiChoice => "multi_choice",
            QuestionType::Binary => "binary",
            QuestionType::FillBlank => "fill_blank",
            QuestionType::ShortAnswer => "short_answer",
            QuestionType::LongAnswer => "long_answer",
            QuestionType::Match => "match",
            QuestionType::Sequence => "sequence",
            QuestionType::WordDrag => "word_drag",
            QuestionType::Dropdown => "dropdown",
            QuestionType::Numeric => "numeric",
            QuestionType::HotSpot => "hotspot",
            QuestionType::Code => "code",
            QuestionType::Math => "math",
            QuestionType::Geolocation => "geolocation",
        };
        write!(f, "{}", res)
    }
}

#[derive(FromRow, Serialize)]
pub struct Question {
    id: i32,
    deck_id: i32,
    question_type: QuestionType,
    title: String,
    content: Option<String>,
    archived: bool,
    created_at: String,
    updated_at: String,
}

pub struct MultiChoiceQuestion {
    id: i32,
    question_id: i32,
    layout_cols: i32,
    single_answer: bool,
}

pub struct MultiChoiceAnswer {
    id: i32,
    question_id: i32,
    content: String,
    correct: bool,
}

/* pub struct BinaryQuestion {
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
} */

#[derive(Deserialize)]
pub struct NewQuestion {
    deck_id: i32,
    question_type: QuestionType,
    title: String,
    content: Option<String>,
}

pub async fn new_question(question: &NewQuestion, pool: &SqlitePool) -> AppResult<i64> {
    let question_query = "INSERT INTO question (deck_id, question_type, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)";
    let result = sqlx::query(question_query)
        .bind(question.deck_id)
        .bind(&question.question_type)
        .bind(&question.title)
        .bind(&question.content)
        .bind(chrono::Utc::now().to_rfc3339())
        .bind(chrono::Utc::now().to_rfc3339())
        .execute(pool)
        .await?;

    let id = result.last_insert_rowid();

    Ok(id)
}

#[derive(Deserialize)]
pub struct NewMultiChoiceAnswer {
    content: Option<String>,
    correct: bool,
}

#[derive(Deserialize)]
pub struct NewMultiChoiceQuestion {
    layout_cols: i32,
    single_answer: bool,
    answers: Vec<NewMultiChoiceAnswer>,
}

#[tauri::command(rename_all = "snake_case")]
pub async fn new_multi_choice_question(
    question: NewQuestion,
    multi_choice_question: NewMultiChoiceQuestion,
    state: State<'_, AppState>,
) -> AppResult<()> {
    let start = Instant::now();
    let state = state.lock().await;

    let question_id = new_question(&question, &state.pool).await?;

    let question_query =
        "INSERT INTO multi_choice_question (question_id, layout_rows, single_answer) VALUES (?, ?, ?)";
    let result = sqlx::query(question_query)
        .bind(question_id)
        .bind(multi_choice_question.layout_cols)
        .bind(multi_choice_question.single_answer)
        .execute(&state.pool)
        .await?;
    let question_id = result.last_insert_rowid();

    for answer in multi_choice_question.answers {
        let answer_query =
            "INSERT INTO multi_choice_answer (question_id, content, correct) VALUES (?, ?, ?)";
        sqlx::query(answer_query)
            .bind(question_id)
            .bind(answer.content)
            .bind(answer.correct)
            .execute(&state.pool)
            .await?;
    }

    info!(
        "Created new question \"{}\" (type: {}) in {:?}",
        question.title,
        question.question_type,
        start.elapsed()
    );

    Ok(())
}

#[derive(FromRow, Serialize)]
pub struct QuestionPreview {
    id: i32,
    question_type: String,
    title: String,
}

#[tauri::command(rename_all = "snake_case")]
pub async fn get_questions(
    deck_id: i32,
    state: State<'_, AppState>,
) -> AppResult<Vec<QuestionPreview>> {
    let start = Instant::now();
    let state = state.lock().await;

    let query = format!(
        "SELECT id, question_type, title FROM question WHERE archived = 0 AND deck_id = {}",
        deck_id
    );
    let questions = sqlx::query_as::<_, QuestionPreview>(&query)
        .fetch_all(&state.pool)
        .await?;

    info!("Get questions in {:?}", start.elapsed());

    Ok(questions)
}

#[tauri::command]
pub async fn get_question(id: i32, state: State<'_, AppState>) -> AppResult<Question> {
    let start = Instant::now();
    let state = state.lock().await;

    let query = format!("SELECT id, deck_id, question_type, title, content, archived, created_at, updated_at FROM question WHERE id = {}", id);
    let question = sqlx::query_as::<_, Question>(&query)
        .fetch_one(&state.pool)
        .await?;

    info!("Fetched question in {:?}", start.elapsed());

    Ok(question)
}
