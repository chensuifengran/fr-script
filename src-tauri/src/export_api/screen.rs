use crate::{libs::util::Util, types::generate_result, UTIL_INSTANCE};
use enigo::*;
use std::sync::Arc;

use super::constant::{
    ERROR_COLOR, ERROR_COORDINATE, ERROR_MSG_DATA, ERROR_RECT_INFO, ERROR_WIDTH_HEIGHT,
};

pub fn detect_image_path_extensions(path: &str) -> bool {
    let image_extensions = ["jpg", "jpeg", "png", "bmp", "tiff"];
    match path.split('.').rev().next() {
        Some(ext) => image_extensions.contains(&ext),
        None => false,
    }
}

/// 获取屏幕尺寸并将结果作为 JSON 字符串返回。
///
/// 返回:
///
/// 一个 Result 类型，以 String(JSON字符串)  作为成功值，以空元组 () 作为错误值。
///
/// 返回示例："{\"width\":1920,\"height\":1080}"
#[tauri::command]
pub async fn get_screen_size() -> Result<String, ()> {
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    let res: String = util
        .get_screen_size()
        .unwrap_or(format!("{}", ERROR_WIDTH_HEIGHT));
    if res == format!("{}", ERROR_WIDTH_HEIGHT) {
        log::error!("[command]get_screen_size:获取屏幕尺寸失败");
    }
    Ok(res)
}

/// 获取屏幕缩放级别
///
/// 返回:
///
/// 一个“Result”类型，其中 String(JSON字符串) 作为成功值，“()”作为错误值。
///
/// 返回示例：1
#[tauri::command]
pub async fn get_screen_zoom() -> Result<f64, ()> {
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    let res: f64 = util.get_screen_zoom().unwrap_or(-1.0);
    if res == -1.0 {
        log::error!("[command]get_screen_zoom:获取屏幕缩放级别失败");
    }
    Ok(res)
}

/// 捕获屏幕截图
///
/// 参数:
///
/// * `path`: `path` 参数是一个字符串，表示保存屏幕截图的文件路径。
/// * `x`: “x”参数表示屏幕截图起点的 x 坐标。它决定了屏幕截图区域的最左边位置。
/// * `y`: “y”参数表示屏幕截图起点的 y 坐标。它确定屏幕截图开始捕获屏幕的垂直位置。
/// * `w`: “w”参数表示屏幕截图区域的宽度。
/// * `h`: “h”参数表示屏幕截图区域的高度。
/// * “x” “y” “w” “h”中的任何一个值为-1，表示全屏截图。
///
/// 返回:
///
/// Result 类型，其中 String(JSON字符串) 作为成功值， () 作为错误值。
///
/// 返回示例："{\"code\":200,\"message\":\"截图成功\"}"
#[tauri::command]
pub async fn screenshot(path: &str, x: i32, y: i32, w: i32, h: i32) -> Result<String, ()> {
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    let res: i32;
    if path == "" {
        res = -2;
    } else if !detect_image_path_extensions(path) {
        res = -3;
    } else if x == 0 && y == 0 && w == 0 && h == 0 {
        //全0或者有位置参数有-1表示全屏截图
        res = util.screenshot(path, -1, y, w, h).unwrap_or(-1);
    } else {
        res = util.screenshot(path, x, y, w, h).unwrap_or(-1);
    }
    let code: u32 = match res {
        -1 => 500,
        -2 => 501,
        -3 => 502,
        _ => 200,
    };
    let msg: String = match res {
        -1 => {
            log::error!(
                "[command]screenshot:截图失败 [{}, {}, {}, {}, {}]",
                path,
                x,
                y,
                w,
                h
            );
            "截图失败".to_string()
        }
        -2 => {
            log::error!(
                "[command]screenshot:图片路径为空 [{}, {}, {}, {}, {}]",
                path,
                x,
                y,
                w,
                h
            );
            "图片路径为空".to_string()
        }
        -3 => {
            log::error!(
                "[command]screenshot:图片路径不合法 [{}, {}, {}, {}, {}]",
                path,
                x,
                y,
                w,
                h
            );
            "图片路径不合法".to_string()
        }
        _ => "截图成功".to_string(),
    };
    Ok(generate_result(format!("{}", msg), code))
}

/// 获得当前屏幕所选矩形区域的矩形信息。
///
/// 返回:
///
/// 一个 Result 类型，以 String(JSON字符串) 作为成功值，以空元组 () 作为错误值。
///
/// 返回示例："{\"startX\":0,\"startY\":0,\"width\":1920,\"height\":1080}"
#[tauri::command]
pub async fn get_screen_rect_info() -> Result<String, ()> {
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    let res: String = util
        .get_screen_rect_info()
        .unwrap_or(format!("{}", ERROR_RECT_INFO));
    if res == format!("{}", ERROR_RECT_INFO) {
        log::error!("[command]get_screen_rect_info:获取屏幕矩形信息失败");
    }
    Ok(res)
}

/// 捕获屏幕截图并与模板图像进行匹配
///
/// 参数:
///
/// * `x`: 截图起点x坐标。
/// * `y`: 截图起点y坐标。
/// * `width`: 截图宽度。
/// * `height`: 截图高度。
/// * `temp_path`: 模板图片路径。
/// * `exact_value`: 确定模板图像需要与屏幕区域匹配的紧密程度才能被视为匹配。值越高，匹配需要越精确。<=0直接返回匹配结果，否则只返回大于等于精确值的匹配结果
/// * `scale`: 缩放倍数，0为默认缩放倍数。有效值：0~1的浮点数。
/// “x”、“y”、“width”、“height” 任意值为-1表示全屏截图进行匹配（不推荐）。
///
/// 返回:
///
/// 一个 Result 类型，以 String(JSON字符串) 作为成功值，以空元组 () 作为错误值。
/// 返回示例："{\"x\":0,\"y\":0}"
#[tauri::command]
pub async fn screen_match_template(
    x: i32,
    y: i32,
    width: i32,
    height: i32,
    temp_path: &str,
    exact_value: f64,
    scale: f64,
) -> Result<String, ()> {
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    let res: String = util
        .screen_match_template(x, y, width, height, temp_path, exact_value, scale)
        .unwrap_or(format!("{}", ERROR_COORDINATE));
    if res == format!("{}", ERROR_COORDINATE) {
        log::error!(
            "[command]screen_match_template:屏幕匹配模板失败 [{}, {}, {}, {}, {}, {}, {}]",
            x,
            y,
            width,
            height,
            temp_path,
            exact_value,
            scale
        );
    }
    Ok(res)
}

/// 捕获屏幕截图并与多模板图像匹配，进行差异比较
///
/// 参数:
///
/// * `x`: 截图起点x坐标。
/// * `y`: 截图起点y坐标。
/// * `width`: 截图宽度。
/// * `height`: 截图高度。
/// * `temp_paths`: 模板图像的路径，多路径使用“|”分割。
/// * `target_index`: 主模板索引，其余模板会携带与主模板的位置偏移量。
///
/// 返回:
///
/// 一个 Result 类型，以 String(JSON字符串) 作为成功值，以空元组 () 作为错误值。
///
/// 返回值类型描述：本方法返回一个对象(字符串)，每个对象包含：
/// * `message` 字符串，是否成功匹配。
///
/// * `data` 对象数组，每个对象的属性有：
///
/// `x`、`y`、`width`、`height`、
///
/// `centerX` 图像中心X坐标、
///
/// `centerY` 图像中心Y坐标、
///
/// `targetOffsetX` 中心坐标与主模板的中心坐标的X轴偏移量、
///
/// `targetOffsetY` 中心坐标与主模板的中心坐标的Y轴偏移量
#[tauri::command]
pub async fn screen_diff_templates(
    x: i32,
    y: i32,
    width: i32,
    height: i32,
    temp_paths: &str,
    target_index: i32,
) -> Result<String, ()> {
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    let res: String = util
        .screen_diff_templates(x, y, width, height, temp_paths, target_index)
        .unwrap_or(format!("{}", ERROR_MSG_DATA));
    if res == format!("{}", ERROR_MSG_DATA) {
        log::error!(
            "[command]screen_diff_templates:屏幕匹配模板失败 [{}, {}, {}, {}, {}, {}]",
            x,
            y,
            width,
            height,
            temp_paths,
            target_index
        );
    }
    Ok(res)
}

#[tauri::command]
pub async fn screen_color(x: Option<i32>, y: Option<i32>) -> Result<String, ()> {
    let util: Arc<Util> = UTIL_INSTANCE.clone();
    if x.is_none() || y.is_none() {
        let enigo = Enigo::new(&Settings::default());
        if let Ok(enigo) = enigo {
            let r = enigo.location();
            if let Ok((x, y)) = r {
                let color = util
                    .get_screen_color(x, y)
                    .unwrap_or(format!("{}", ERROR_COLOR));
                if color == format!("{}", ERROR_COLOR) {
                    log::error!("[command]screen_color:获取屏幕颜色失败 [{}, {}]", x, y);
                }
                return Ok(color);
            }
            log::error!("[command]screen_color: get location failed");
            return Err(());
        }
        log::error!("[command]screen_color: new Enigo failed");
        Err(())
    } else {
        let x = x.unwrap();
        let y = y.unwrap();
        let color = util
            .get_screen_color(x, y)
            .unwrap_or(format!("{}", ERROR_COLOR));
        if color == format!("{}", ERROR_COLOR) {
            log::error!("[command]screen_color:获取屏幕颜色失败 [{}, {}]", x, y);
        }
        Ok(color)
    }
}
