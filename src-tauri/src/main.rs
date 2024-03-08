#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use fr_script::export_api::{ cmd, file, image, init, input, mouse, request, screen, sys, tools};
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app: &mut tauri::App| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            mouse::mouse_move_to,
            mouse::mouse_move_relative,
            mouse::mouse_move_click,
            mouse::mouse_press,
            mouse::mouse_release,
            mouse::mouse_wheel,
            mouse::mouse_get_pos,
            mouse::start_clicker,
            mouse::stop_clicker,
            mouse::mouse_drag,
            mouse::mouse_color,
            input::input_text,
            input::press_key,
            input::press_keys,
            input::key_down,
            input::key_up,
            screen::get_screen_size,
            screen::screenshot,
            screen::get_screen_zoom,
            screen::get_screen_rect_info,
            screen::screen_match_template,
            screen::screen_diff_templates,
            image::crop_picture,
            image::get_img_size,
            image::get_similarity_value,
            image::match_template,
            image::get_img_rect_info,
            image::get_img_color,
            image::ocr,
            image::screen_ocr,
            image::screen_ocr_contains,
            tools::get_dependence_version,
            file::get_install_dir,
            file::get_file_info,
            file::copy_dep_file,
            file::decompress_dep_file,
            file::open_file_explorer,
            file::read_file,
            file::write_file,
            init::init,
            request::request_get,
            sys::open_in_default_browser,
            cmd::run_cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
