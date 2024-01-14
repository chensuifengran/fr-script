use reqwest::get;
use crate::types::generate_result;


#[tauri::command]
pub async fn request_get(url:String) -> Result<String, ()> {
    let resp = get(url).await.unwrap().text().await;
    match resp {
        Ok(resp) => Ok(generate_result(format!("{}", resp), 200)),
        Err(e) => Ok(generate_result(format!("{}", e.to_string()), 500))
    }
}