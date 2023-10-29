use enigo::*;

use crate::types::generate_result;

#[tauri::command]
pub async fn input_text(text: &str) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.key_sequence(text);
    Ok(generate_result(String::from("input_text ok"), 200))
}

#[tauri::command]
pub async fn input_key(key: Key) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.key_click(key);
    Ok(generate_result(String::from("input_key ok"), 200))
}

#[tauri::command]
pub async fn key_down(key: Key) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.key_down(key);
    Ok(generate_result(String::from("key_down ok"), 200))
}

#[tauri::command]
pub async fn key_up(key: Key) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.key_up(key);
    Ok(generate_result(String::from("key_up ok"), 200))
}
