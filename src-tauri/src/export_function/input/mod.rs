use enigo::*;
use std::thread;
use std::time::Duration;

use crate::types::generate_result;

#[tauri::command]
pub async fn test() -> String {
    thread::sleep(Duration::from_secs(1));
    let mut enigo: Enigo = Enigo::new();
    enigo.key_sequence("Hello, world!");
    enigo.key_down(Key::Control);
    enigo.key_click(Key::Layout('a'));
    enigo.key_up(Key::Control);
    generate_result(String::from("true"), 200)
}
