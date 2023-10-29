#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use fr_script::{
    export_api::{input, mouse_fn},
    // c_api::Util,
};

fn main() {
    // let util = Util::new();
    // util.screenshot("E:\\test.png", 0, 0, 100, 100).expect("error");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            mouse_fn::mouse_move_to,
            mouse_fn::mouse_move_relative,
            mouse_fn::mouse_move_click,
            mouse_fn::mouse_press,
            mouse_fn::mouse_release,
            mouse_fn::mouse_wheel,
            mouse_fn::mouse_get_pos,

            input::input_text,
            input::input_key,
            input::key_down,
            input::key_up,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
