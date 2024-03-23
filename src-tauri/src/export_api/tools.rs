
use crate::{
    c_api::util::Util,
    PPOCR_INSTANCE, UTIL_INSTANCE,
};
use std::{fs, sync::Arc};

use super::constant::ERROR_VERSION;

/// 测试盘符是否可用
///
/// 参数:
///
/// * `drive`: 盘符，例如：D
///
/// 返回:
///
/// {bool} 是否可用
pub fn test_drive(drive: &char) -> bool {
    match fs::File::create(format!("{}:\\__test_out__.png", drive)) {
        Ok(_) => match fs::remove_file(format!("{}:\\__test_out__.png", drive)) {
            Ok(_) => true,
            Err(e) => {
                log::error!("test_drive :{:?} [{}]", e, drive);
                false
            },
        },
        Err(e) => {
            log::error!("test_drive :{:?} [{}]", e, drive);
            false
        },
    }
}

/// 从D到J枚举一个可用的盘符，类型为char
///
/// 返回：
///
/// Result<char,()>
pub fn auto_select_drive() -> Result<char, ()> {
    let drive_enum = ['D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let mut res = ' ';
    for i in 0..=6 {
        let c = drive_enum[i];
        if test_drive(&c) {
            res = c;
            break;
        }
    }
    if res != ' ' {
        Ok(res)
    } else {
        //返回C盘
        Ok('C')
    }
}

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
        log::error!("[command]get_dependence_version: ppocr version={}, util version={}", p_version, u_version);
    }
    Ok(format!("{}-{}", p_version, u_version))
}
