use crate::{c_api::util::Util, types::generate_result};

#[tauri::command]
pub async fn crop_picture(
    path: &str,
    x: i32,
    y: i32,
    width: i32,
    height: i32,
)->Result<String, ()>{
    let util: Util = Util::new();
    let res: i32 = util.crop_picture(path, x, y, width, height).unwrap_or(-1);
    let code: u32 = match res {
        0 => 500,
        -1 => 501,
        _ => 200,
    };
    let msg: String = match res {
        0 => "裁剪后图片输出写入失败".to_string(),
        -1 => "程序出现异常，裁剪失败".to_string(),
        _ => "裁剪成功".to_string(),
    };
    Ok(generate_result(format!("{}", msg), code))
}