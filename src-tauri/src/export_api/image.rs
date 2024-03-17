use std::sync::Arc;

use super::constant::{ERROR_COORDINATE, ERROR_OCR_RESULT, ERROR_RECT_INFO, ERROR_WIDTH_HEIGHT};
use crate::UTIL_INSTANCE;
use crate::{c_api::util::Util, types::generate_result, PPOCR_INSTANCE};

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
    let util: Arc<Util> = UTIL_INSTANCE.clone();
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
    let util: Arc<Util> = UTIL_INSTANCE.clone();
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
    let util: Arc<Util> = UTIL_INSTANCE.clone();
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
    let util: Arc<Util> = UTIL_INSTANCE.clone();
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
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    let res: String = util
        .get_image_size(path)
        .unwrap_or(format!("{}", ERROR_WIDTH_HEIGHT));
    Ok(res)
}

/// ocr识别
///
/// 参数:
///
/// * `img_path`: 图片路径。
/// * `x`: 未传或者-1表示整图识别
/// * `y`: 未传或者-1表示整图识别
/// * `width`: 未传或者-1表示整图识别
/// * `height`: 未传或者-1表示整图识别
///
/// 返回:
///
/// 一个 Result 类型，以 String(JSON字符串) 作为成功值，以空元组 () 作为错误值。
///
/// 返回值解释：
/// 返回一个JSON对象字符串，包含code和result两个字段，
///
///     code为识别状态1为成功，其它为失败，
///     result为识别结果，
/// 	    成功时为对象数组，对象中包含识别到的文字及其位置信息，
/// 	    失败时为字符串，包含错误信息
#[tauri::command]
pub async fn ocr(
    img_path: &str,
    x: Option<i32>,
    y: Option<i32>,
    width: Option<i32>,
    height: Option<i32>,
) -> Result<String, ()> {
    let ppocr = PPOCR_INSTANCE.clone();
    let x: i32 = match x {
        Some(x) => x,
        None => -1,
    };
    let y: i32 = match y {
        Some(y) => y,
        None => -1,
    };
    let width: i32 = match width {
        Some(width) => width,
        None => -1,
    };
    let height: i32 = match height {
        Some(height) => height,
        None => -1,
    };
    if x == -1 || y == -1 || width == -1 || height == -1 {
        let res: String = ppocr
            .ocr(img_path)
            .unwrap_or(format!("{}", ERROR_OCR_RESULT));
        Ok(res)
    } else {
        let res: String = ppocr
            .ocr_rect(img_path, x, y, width, height)
            .unwrap_or(format!("{}", ERROR_OCR_RESULT));
        Ok(res)
    }
}

/// 识别屏幕指定范围的文字信息
///
/// 参数
///
/// * `x` - 截取起点x坐标,不传或者为-1表示全屏识别
/// * `y` - 截取起点y坐标,不传或者为-1表示全屏识别
/// * `width` - 截取宽度,不传或者为-1表示全屏识别
/// * `height` - 截取高度,不传或者为-1表示全屏识别
/// * `only_text` - 是否只返回文字信息,不传为false
///
/// 返回：
///
/// 返回一个JSON对象字符串，包含code和result两个字段，
/// code为识别状态1为成功，其它为失败，
///
/// result为识别结果，
///   `only_text=false`成功时为对象数组，对象中包含识别到的文字及其位置信息，
///   `only_text=true` 成功时为字符串数组，包含识别到的文字，
///   失败时为字符串，包含错误信息
#[tauri::command]
pub async fn screen_ocr(
    x: Option<i32>,
    y: Option<i32>,
    width: Option<i32>,
    height: Option<i32>,
    only_text: Option<bool>,
) -> Result<String, ()> {
    let ppocr = PPOCR_INSTANCE.clone();
    let x: i32 = match x {
        Some(x) => x,
        None => -1,
    };
    let y: i32 = match y {
        Some(y) => y,
        None => -1,
    };
    let width: i32 = match width {
        Some(width) => width,
        None => -1,
    };
    let height: i32 = match height {
        Some(height) => height,
        None => -1,
    };
    let only_text = match only_text {
        Some(e) => e,
        None => false,
    };
    if only_text {
        Ok(ppocr
            .screen_ocr_only_texts(x, y, width, height)
            .unwrap_or(format!("{}", ERROR_OCR_RESULT)))
    } else {
        Ok(ppocr
            .screen_ocr(x, y, width, height)
            .unwrap_or(format!("{}", ERROR_OCR_RESULT)))
    }
}

/// 获取图片指定坐标点的颜色
///
/// 参数
///
/// * `image_path` - 图片路径
/// * `x` - 坐标点x坐标
/// * `y` - 坐标点y坐标
///
/// 返回：
///
/// 返回一个字符串，包含坐标点的颜色值，如果坐标点超出图片范围，返回空字符串
#[tauri::command]
pub async fn img_color(
    path: &str,
    x: i32,
    y: i32
) -> Result<String, ()> {
    let x = if x < 0 { 0 } else { x };
    let y = if y < 0 { 0 } else { y };
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    let res: String = util
        .get_image_color(x, y,path)
        .unwrap_or("".to_string());
    Ok(res)
}

/// 识别屏幕指定范围的文字信息是否包含所提供的文字
///
/// 参数
///
/// * `x` - 截取起点x坐标,不传或者为-1表示全屏识别
/// * `y` - 截取起点y坐标,不传或者为-1表示全屏识别
/// * `width` - 截取宽度,不传或者为-1表示全屏识别
/// * `height` - 截取高度,不传或者为-1表示全屏识别
/// * `texts` - 需要识别的文字
///
/// 返回：
///
/// {bool} 是否包含
#[tauri::command]
pub async fn screen_ocr_contains(
    x: Option<i32>,
    y: Option<i32>,
    width: Option<i32>,
    height: Option<i32>,
    texts: &str,
) -> Result<bool, ()> {
    let ppocr = PPOCR_INSTANCE.clone();
    let x: i32 = match x {
        Some(x) => x,
        None => -1,
    };
    let y: i32 = match y {
        Some(y) => y,
        None => -1,
    };
    let width: i32 = match width {
        Some(width) => width,
        None => -1,
    };
    let height: i32 = match height {
        Some(height) => height,
        None => -1,
    };
    match ppocr.screen_ocr_find_texts(x, y, width, height, texts) {
        Ok(res) => {
            if res == 1 {
                Ok(true)
            } else {
                Ok(false)
            }
        }
        Err(_) => Err(()),
    }
}
