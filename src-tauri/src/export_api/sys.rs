use webbrowser;

#[tauri::command]
pub async fn open_in_default_browser(url: String) -> Result<(), String> {
    if let Err(error) = webbrowser::open(&url) {
        println!("Error opening URL in browser: {}", error);
    } else {
        println!("URL opened successfully.");
    }
    Ok(())
}
