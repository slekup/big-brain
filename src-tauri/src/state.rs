use std::path::PathBuf;

use sqlx::{migrate::MigrateDatabase, Sqlite, SqlitePool};
use tokio::{fs, sync::Mutex};
use tracing::info;

use crate::error::AppResult;

pub struct AppStateInner {
    pub pool: SqlitePool,
}

pub type AppState = Mutex<AppStateInner>;

fn get_config_dir() -> PathBuf {
    dirs::config_local_dir().unwrap().join("big-brain")
}

impl AppStateInner {
    pub async fn new() -> AppResult<Self> {
        let config_dir = get_config_dir();

        if !fs::try_exists(&config_dir).await? {
            fs::create_dir_all(&config_dir).await?;
        }

        let db_path = config_dir.join("data.db");
        let db_path_str = db_path.to_str().unwrap();

        if !Sqlite::database_exists(db_path_str).await.unwrap_or(false) {
            info!("Creating non-existent database {}", db_path_str);
            match Sqlite::create_database(db_path_str).await {
                Ok(_) => info!("Created DB successfully"),
                Err(error) => panic!("Failed to create DB: {}", error),
            }
        }

        let pool = SqlitePool::connect(db_path_str).await?;

        info!("Connected to sqlite database");

        Ok(Self { pool })
    }
}
