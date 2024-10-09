use tauri::Listener;

pub fn register_event_handler(app: &mut tauri::App) {
    app.listen_any("notify", |_| {});
}
