use crate::{
    constant::{API_KEY, API_SECRET, APP_ID},
    types::generate_result,
};
use log::error;
use reqwest::get;

#[tauri::command]
pub async fn request_get(url: String) -> Result<String, ()> {
    let resp = get(&url).await.unwrap().text().await;
    match resp {
        Ok(resp) => Ok(generate_result(format!("{}", resp), 200)),
        Err(e) => {
            error!("[command]request_get :{:?} [{}]", e, url);
            Ok(generate_result(format!("{}", e.to_string()), 500))
        }
    }
}

#[tauri::command]
pub async fn get_spark_info() -> Result<String, ()> {
    Ok(format!("{}-{}-{}", APP_ID, API_SECRET, API_KEY))
}
