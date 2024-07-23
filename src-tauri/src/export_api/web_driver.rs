use thirtyfour::prelude::*;

#[tauri::command]
pub async fn example_web_driver() -> Result<(), String> {
    let caps = DesiredCapabilities::edge();
    let driver = WebDriver::new("http://localhost:9515", caps)
        .await
        .map_err(|e| e.to_string())?;
    // Navigate to https://wikipedia.org.
    driver
        .goto("https://www.baidu.com")
        .await
        .map_err(|e| e.to_string())?;
    // Find element from element.
    let elem_text = driver.find(By::Id("kw")).await.map_err(|e| e.to_string())?;

    // Type in the search terms.
    elem_text
        .send_keys("example_web_driver")
        .await
        .map_err(|e| e.to_string())?;

    // Always explicitly close the browser.
    // driver.quit().await.map_err(|e| e.to_string())?;

    Ok(())
}
