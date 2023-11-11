use crate::{c_api::util::Util, types::generate_result};

use super::constant::{ERROR_COORDINATE, ERROR_RECT_INFO, ERROR_WIDTH_HEIGHT};

/// 裁剪图片
///
/// 参数：
///
/// * `path`: `path` 参数是一个字符串，表示保存屏幕截图的文件路径。
/// * `x`: “x”参数表示屏幕截图起点的 x 坐标。它决定了屏幕截图区域的最左边位置。
/// * `y`: “y”参数表示屏幕截图起点的 y 坐标。它确定屏幕截图开始捕获屏幕的垂直位置。
/// * `width`: “width”参数表示屏幕截图区域的宽度。
/// * `height`: “height”参数表示屏幕截图区域的高度。
/// * `out_path`: `out_path` 参数是一个字符串，表示保存屏幕截图的文件路径。
///
/// 返回：
///
/// Result 类型，其中 String(JSON字符串) 作为成功值， () 作为错误值。
///
/// 返回示例："{\"code\":200,\"message\":\"裁剪成功\"}"
#[tauri::command]
pub async fn crop_picture(
    path: &str,
    x: i32,
    y: i32,
    width: i32,
    height: i32,
    out_path: &str,
) -> Result<String, ()> {
    let util: Util = Util::new();
    let res: i32 = util
        .crop_picture(path, x, y, width, height, out_path)
        .unwrap_or(-1);
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

/// 获取在指定图片标注矩形的起始点以及宽高
///
/// 参数：
///
/// * `img_path`: `img_path` 参数表示图片路径。
///
/// 返回：
///
/// Result 类型，其中 String(JSON字符串) 作为成功值， () 作为错误值。
///
/// 返回示例："{\"startX\":0,\"startY\":0,\"width\":1920,\"height\":1080}"
#[tauri::command]
pub async fn get_img_rect_info(img_path: &str) -> Result<String, ()> {
    let util: Util = Util::new();
    let res: String = util
        .get_img_rect_info(img_path)
        .unwrap_or(format!("{}", ERROR_RECT_INFO));
    Ok(res)
}

/// 图片模板匹配
///
/// 参数:
///
/// * `img_path`: `img_path` 参数表示原图路径。
/// * `temp_path`: `temp_path` 参数表示模板图路径。
/// * `exact_value`: “exact_value”它确定模板需要与图像匹配到何种程度才能被视为匹配。值越高，匹配需要越精确。<=0直接返回匹配结果，否则只返回大于等于精确值的匹配结果。
/// * `scale`: “scale”参数是一个浮点数，表示模板图像与屏幕区域匹配的缩放比例。值越高，越精确但是速度越慢。
///
/// 返回:
///
/// 一个 Result 类型，以 String(JSON字符串) 作为成功值，以空元组 () 作为错误值。
///
/// 返回示例："{\"x\":10,\"y\":200}"
#[tauri::command]
pub async fn match_template(
    img_path: &str,
    temp_path: &str,
    exact_value: f64,
    scale: f64,
) -> Result<String, ()> {
    let util: Util = Util::new();
    let res: String = util
        .match_template(img_path, temp_path, exact_value, scale)
        .unwrap_or(format!("{}", ERROR_COORDINATE));
    Ok(res)
}

/// 直方图比对检测相似度
///
///
/// 参数:
///
/// * `path_a`: `path_a` 待对比图片路径。
/// * `x`: 截取起点 x 坐标。
/// * `y`: 截取起点 y 坐标。
/// * `width`: 截取宽度。
/// * `height`: 截取高度。
/// * `path_b`: `path_b` 待对比图片路径。
///
/// “x”、“y”、“width”、“height” 任意值为-1表示path_a原图与path_b进行对比
///
/// 返回:
///
/// 一个 Result 类型, 以 String(JSON字符串) 作为成功值，以空元组 () 作为错误值。
///
/// 返回值示例：0.9
#[tauri::command]
pub async fn get_similarity_value(
    path_a: &str,
    x: i32,
    y: i32,
    width: i32,
    height: i32,
    path_b: &str,
) -> Result<f64, ()> {
    let util: Util = Util::new();
    let res: f64 = util
        .get_similarity_value(path_a, x, y, width, height, path_b)
        .unwrap_or(-1.0);
    Ok(res)
}

/// 获取图片宽高
/// 
/// 参数:
/// 
/// * `path`: `path` 参数表示图片路径。
/// 
/// 返回:
/// 
/// 一个 Result 类型，以 String(JSON字符串) 作为成功值，以空元组 () 作为错误值。
/// 
/// 返回示例："{\"width\":1920,\"height\":1080}"
#[tauri::command]
pub async fn get_img_size(path: &str) -> Result<String, ()> {
    let util: Util = Util::new();
    let res: String = util
        .get_image_size(path)
        .unwrap_or(format!("{}", ERROR_WIDTH_HEIGHT));
    Ok(res)
}