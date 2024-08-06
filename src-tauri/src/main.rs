// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use state::AppStateInner;
use tauri::{Builder, Manager};
use tokio::sync::Mutex;

mod decks;
mod error;
mod questions;
mod state;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let mut app_state = Mutex::new(AppStateInner::new().await?);

    sqlx::migrate!().run(&app_state.lock().await.pool).await?;

    Builder::default()
        .setup(|app| {
            app.manage(app_state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_version,
            decks::new_deck,
            decks::get_decks,
            decks::get_deck,
            decks::get_deck_name,
            decks::get_deck_crumbs
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

#[tauri::command]
fn get_version<'a>() -> &'a str {
    env!("CARGO_PKG_VERSION")
}
