use tokio::fs;
use uuid::Uuid;

use crate::error::{AppError, AppResult};

use super::dirs::get_data_dir;

const VALID_IMAGE_TYPES: [&str; 4] = ["png", "jpg", "jpeg", "gif"];

/// Save an image to the device and return the path of the image.
pub async fn save_image(image_data: Vec<u8>, image_type: String) -> AppResult<String> {
    if !VALID_IMAGE_TYPES.contains(&image_type.as_str()) {
        let image_types_str = VALID_IMAGE_TYPES.join(", ");
        return AppError::new(&format!(
            "Invalid image type, must be one of: {}.",
            image_types_str
        ));
    }

    let uuid = Uuid::new_v4().to_string();
    let path = get_data_dir().join(format!("images/{}.{}", uuid, image_type));

    fs::write(&path, image_data).await?;

    Ok(path.to_str().unwrap().to_string())
}
