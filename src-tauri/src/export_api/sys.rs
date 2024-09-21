use std::sync::Arc;

use tauri::Manager;
use webbrowser;

use crate::{libs::util::Util, UTIL_INSTANCE};

#[tauri::command]
pub async fn open_in_default_browser(url: String) -> Result<(), String> {
    if let Err(error) = webbrowser::open(&url) {
        log::error!(
            "[command]Error opening URL in browser: {:?} [{}]",
            error,
            url
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

#[tauri::command]
pub async fn close_splashscreen(window: tauri::Window) {
    // 关闭初始屏幕
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // 显示主窗口
    window.get_window("main").unwrap().show().unwrap();
}

#[tauri::command]
pub async fn free_all_json_string() -> Result<bool, ()> {
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    match util.free_all_json_string() {
        Ok(_) => {
            log::debug!("成功释放所有JSON字符串");
            Ok(true)
        },
        Err(_) => {
            log::error!("[command]free_all_json_string:释放所有JSON字符串失败");
            Ok(false)
        }
    }
}