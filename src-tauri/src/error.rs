#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("IO Error: {0}")]
    Io(#[from] std::io::Error),

    #[error("SQLX Error: {0}")]
    Sqlx(#[from] sqlx::Error),

    #[error("Error: {0}")]
    Custom(String),
}

impl AppError {
    pub fn new<T>(message: &str) -> AppResult<T> {
        Err(AppError::Custom(message.to_string()))
    }
}

impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type AppResult<T> = Result<T, AppError>;
