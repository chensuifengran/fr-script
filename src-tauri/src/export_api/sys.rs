use webbrowser;

#[tauri::command]
pub async fn open_in_default_browser(url: String) -> Result<(), String> {
    if let Err(error) = webbrowser::open(&url) {
        log::error!(
            "[command]Error opening URL in browser: {:?} [{}]",
            error, url
        );
    } else {
        log::info!("URL opened successfully.");
    }
    Ok(())
}

#[tauri::command]
pub async fn error_report(msg: String) -> Result<(), ()> {
    log::error!("[前端]: {}", msg);
    Ok(())
}
