#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use fr_script::{event::register_event_handler, export_api::{cmd, file, image, init, input, mouse, request, screen, sys, tools}};
use tauri::Manager;
fn main() {
    tauri::Builder::default()
        .setup(|_app: &mut tauri::App| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = _app.get_window("main").unwrap();
                window.open_devtools();
            }
            let resource_path = _app
                .path_resolver()
                .resolve_resource("resources/log4rs.yml")
                .expect("failed to resolve resource");
            log4rs::init_file(resource_path, Default::default()).unwrap();
            register_event_handler(_app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            mouse::move_mouse,
            mouse::mouse_move_click,
            mouse::mouse_press,
            mouse::mouse_release,
            mouse::mouse_wheel,
            mouse::mouse_get_pos,
            mouse::start_clicker,
            mouse::stop_clicker,
            mouse::mouse_drag,
            mouse::mouse_move_up,
            mouse::mouse_move_down,
            input::input_text,
            input::press_key,
            input::press_keys,
            input::key_down,
            input::key_up,
            screen::screen_color,
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
            image::img_color,
            image::ocr,
            image::screen_ocr,
            image::screen_ocr_contains,
            tools::get_dependence_version,
            tools::capture_operation,
            tools::qiut_capture_operation,
            file::get_install_dir,
            file::get_file_info,
            file::copy_dep_file,
            file::decompress_dep_file,
            file::open_file_explorer,
            file::read_file,
            file::write_file,
            file::read_dir,
            init::init,
            request::request_get,
            sys::open_in_default_browser,
            sys::error_report,
            cmd::run_cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
