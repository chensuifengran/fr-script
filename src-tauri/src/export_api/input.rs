use enigo::*;

use crate::types::generate_result;

#[tauri::command]
pub async fn input_text(text: &str) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.key_sequence(text);
    Ok(generate_result(String::from("input_text ok"), 200))
}

#[tauri::command]
pub async fn press_key(key: Key) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.key_click(key);
    Ok(generate_result(String::from("press_key ok"), 200))
}

#[tauri::command]
pub async fn press_keys(keys: Vec<Key>) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();

    // 按下所有的键
    for key in &keys {
        enigo.key_down(*key);
    }

    // 逆序抬起所有的键
    for key in keys.into_iter().rev() {
        enigo.key_up(key);
    }

    Ok(generate_result(String::from("press_keys ok"), 200))
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
