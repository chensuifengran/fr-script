use super::constant::ERROR_VERSION;
use crate::{
    libs::{hooks::CaptureHook, util::Util},
    types::hook_types::CaptureOptions,
    PPOCR_INSTANCE, UTIL_INSTANCE,
};
use std::sync::Arc;

/// 获取依赖版本
///
/// 返回：
///
/// 一个“Result”类型，其中“String”作为成功值，“()”作为错误值。
#[tauri::command]
pub async fn get_dependence_version() -> Result<String, ()> {
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    let ppocr = PPOCR_INSTANCE.clone();
    let p_version: String = ppocr.get_version().unwrap_or(format!("{}", ERROR_VERSION));
    let u_version: String = util.get_version().unwrap_or(format!("{}", ERROR_VERSION));
    if p_version == format!("{}", ERROR_VERSION) || u_version == format!("{}", ERROR_VERSION) {
        log::error!(
            "[command]get_dependence_version: ppocr version={}, util version={}",
            p_version,
            u_version
        );
    }
    Ok(format!("{}-{}", p_version, u_version))
}

#[tauri::command]
pub async fn capture_operation(
    capture_options: Option<CaptureOptions>,
    generate_comment: Option<bool>,
) -> Result<Vec<String>, ()> {
    let mut capture_hook: CaptureHook = CaptureHook::new(capture_options, generate_comment);
    Ok(capture_hook.capture())
}

#[tauri::command]
pub async fn qiut_capture_operation() -> Result<(), ()> {
    CaptureHook::quit();
    Ok(())
}
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_capture_operation() {
        let res = capture_operation(Some(CaptureOptions::default()), Some(true)).await;
        if let Ok(v) = res {
            println!("{}", v.join("\n"));
        } else {
            println!("error");
        }
    }

    #[tokio::test]
    async fn test_qiut_capture_operation() {
        tokio::time::sleep(std::time::Duration::from_secs(5)).await;
        let _ = qiut_capture_operation().await;
        println!("test_qiut_capture_operation");
    }
}
