use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use tauri::State;
use tokio::time::Instant;
use tracing::info;

use crate::{
    error::{AppError, AppResult},
    state::AppState,
    utils::image::save_image,
};

#[derive(FromRow, Serialize)]
pub struct Deck {
    id: i64,
    parent_id: Option<i64>,
    name: String,
    description: Option<String>,
    color: String,
    cover_image: Option<String>,
    archived: bool,
    created_at: String,
    updated_at: String,
}

#[derive(Deserialize)]
pub struct NewDeck {
    parent_id: Option<String>,
    name: String,
    description: Option<String>,
    color: String,
    cover_image: Option<Vec<u8>>,
    cover_image_type: Option<String>,
}

#[tauri::command]
pub async fn new_deck(deck: NewDeck, state: State<'_, AppState>) -> AppResult<i64> {
    let start = Instant::now();
    let state = state.lock().await;

    let cover_image: Option<String> = if let Some(image_data) = deck.cover_image {
        if let Some(image_type) = deck.cover_image_type {
            Some(save_image(image_data, image_type).await?)
        } else {
            return AppError::new("Image type not provided");
        }
    } else {
        None
    };

    let query = "INSERT INTO deck (parent_id, name, description, color, cover_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
    let result = sqlx::query(query)
        .bind(deck.parent_id)
        .bind(&deck.name)
        .bind(deck.description)
        .bind(deck.color)
        .bind(cover_image)
        .bind(chrono::Utc::now().to_rfc3339())
        .bind(chrono::Utc::now().to_rfc3339())
        .execute(&state.pool)
        .await?;

    let id = result.last_insert_rowid();

    info!(
        "Created new deck \"{}\" in {:?}",
        deck.name,
        start.elapsed()
    );

    Ok(id)
}

#[derive(FromRow, Serialize)]
pub struct DeckPreview {
    id: i32,
    name: String,
    color: String,
    cover_image: Option<String>,
}

#[tauri::command]
pub async fn get_decks(id: Option<i32>, state: State<'_, AppState>) -> AppResult<Vec<DeckPreview>> {
    let start = Instant::now();
    let state = state.lock().await;

    let id_filter = if let Some(id) = id {
        format!(" AND parent_id = {}", id)
    } else {
        " AND parent_id IS NULL".to_string()
    };

    let query = format!(
        "SELECT id, name, color, cover_image FROM deck WHERE archived = 0{}",
        id_filter
    );
    let decks = sqlx::query_as::<_, DeckPreview>(&query)
        .fetch_all(&state.pool)
        .await?;

    info!("fetched decks in {:?}", start.elapsed());

    Ok(decks)
}

#[tauri::command]
pub async fn get_deck(id: i32, state: State<'_, AppState>) -> AppResult<Deck> {
    let start = Instant::now();
    let state = state.lock().await;

    let query = format!(
        "SELECT id, parent_id, name, description, color, cover_image, archived, created_at, updated_at FROM deck WHERE id = {}",
        id
    );
    let deck = sqlx::query_as::<_, Deck>(&query)
        .fetch_one(&state.pool)
        .await?;

    info!("fetched deck in {:?}", start.elapsed());

    Ok(deck)
}

#[tauri::command]
pub async fn get_deck_name(id: i32, state: State<'_, AppState>) -> AppResult<String> {
    let start = Instant::now();
    let state = state.lock().await;

    #[derive(FromRow, Serialize)]
    struct DeckName {
        name: String,
    }

    let query = format!("SELECT name FROM deck WHERE id = {}", id);
    let deck = sqlx::query_as::<_, DeckName>(&query)
        .fetch_one(&state.pool)
        .await?;

    info!("fetched deck name in {:?}", start.elapsed());

    Ok(deck.name)
}

#[derive(Serialize)]
pub struct Crumb {
    id: i32,
    name: String,
}

#[tauri::command]
pub async fn get_deck_crumbs(id: i32, state: State<'_, AppState>) -> AppResult<Vec<Crumb>> {
    let start = Instant::now();
    let state = state.lock().await;

    let mut current_id = id;
    let mut at_root = false;
    let mut crumbs: Vec<Crumb> = vec![];

    #[derive(FromRow)]
    struct DeckCrumb {
        id: i32,
        parent_id: Option<i32>,
        name: String,
    }

    while !at_root {
        let query = format!(
            "SELECT id, parent_id, name FROM deck WHERE id = {}",
            current_id
        );
        let deck = sqlx::query_as::<_, DeckCrumb>(&query)
            .fetch_one(&state.pool)
            .await?;
        crumbs.push(Crumb {
            id: current_id,
            name: deck.name,
        });
        current_id = id;
        if let Some(parent_id) = deck.parent_id {
            current_id = parent_id;
        } else {
            at_root = true
        }
    }

    info!("fetched deck crumbs in {:?}", start.elapsed());

    Ok(crumbs)
}
