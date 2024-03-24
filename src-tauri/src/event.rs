use tauri::Manager;

pub fn register_event_handler(app: &mut tauri::App) {
    app.listen_global("notify", |_| {});
}
