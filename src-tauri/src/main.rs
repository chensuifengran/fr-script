#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use fr_script::export_function::{mouse_fn, input};
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            mouse_fn::move_to,
            mouse_fn::move_click,
            mouse_fn::press,
            mouse_fn::release,
            mouse_fn::wheel,
            mouse_fn::get_pos,
            input::test
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

}
