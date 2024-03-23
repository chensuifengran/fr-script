use log::error;
use reqwest::get;
use crate::types::generate_result;


#[tauri::command]
pub async fn request_get(url:String) -> Result<String, ()> {
    let resp = get(&url).await.unwrap().text().await;
    match resp {
        Ok(resp) => Ok(generate_result(format!("{}", resp), 200)),
        Err(e) => {
            error!("[command]request_get :{:?} [{}]", e, url);
            Ok(generate_result(format!("{}", e.to_string()), 500))
        }
    }
}