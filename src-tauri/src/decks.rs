use std::time::Instant;

use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use tauri::State;
use tracing::info;

use crate::{error::AppResult, state::AppState};

#[derive(FromRow, Serialize)]
pub struct Deck {
    id: i32,
    parent_id: Option<i32>,
    name: String,
    description: Option<String>,
    color: String,
    cover_image: Option<Vec<u8>>,
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
}

#[tauri::command]
pub async fn new_deck(deck: NewDeck, state: State<'_, AppState>) -> AppResult<i32> {
    let start = Instant::now();
    let state = state.lock().await;

    let query = "INSERT INTO decks (parent_id, name, description, color, cover_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
    let result = sqlx::query(query)
        .bind(deck.parent_id)
        .bind(&deck.name)
        .bind(deck.description)
        .bind(deck.color)
        .bind(deck.cover_image)
        .bind(chrono::Utc::now().to_rfc3339())
        .bind(chrono::Utc::now().to_rfc3339())
        .execute(&state.pool)
        .await?;

    let id = result.last_insert_rowid() as i32;

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
    cover_image: Option<Vec<u8>>,
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
        "SELECT id, name, color, cover_image FROM decks WHERE archived = 0{}",
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
        "SELECT id, parent_id, name, description, color, cover_image, archived, created_at, updated_at FROM decks WHERE id = {}",
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

    let query = format!("SELECT name FROM decks WHERE id = {}", id);
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
            "SELECT id, parent_id, name FROM decks WHERE id = {}",
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
