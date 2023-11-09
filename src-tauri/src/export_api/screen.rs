use crate::{c_api::util::Util, types::generate_result};

pub fn detect_image_path_extensions(path: &str)-> bool {
    let image_extensions = ["jpg", "jpeg", "png", "gif", "bmp", "tiff"];
    let ext = path.split('.').rev().next().unwrap();
    image_extensions.contains(&ext)
}

#[tauri::command]
pub async fn get_screen_size() -> Result<String, ()> {
    let util: Util = Util::new();
    let res: String = util
        .get_screen_size()
        .unwrap_or("{\"x\":-1,\"y\":-1}".to_string());
    Ok(generate_result(res, 200))
}

#[tauri::command]
pub async fn get_screen_zoom() -> Result<String, ()> {
    let util: Util = Util::new();
    let res: f64 = util
        .get_screen_zoom()
        .unwrap_or(-1.0);
    Ok(generate_result(res, 200))
}

#[tauri::command]
pub async fn screenshot(path: &str, x: i32, y: i32, w: i32, h: i32) -> Result<String, ()> {
    let util: Util = Util::new();
    let res: i32;
    if path == ""{
        res = -2;
    } else if !detect_image_path_extensions(path){
        res = -3;
    }else if x == 0 && y == 0 && w == 0 && h == 0 {
        //全0或者有位置参数有-1表示全屏截图
        res = util.screenshot(path, -1, y, w, h).unwrap_or(-1);
    }else{
        res = util.screenshot(path, x, y, w, h).unwrap_or(-1);
    }
    let code: u32 = match res {
        -1 => 500,
        -2 => 501,
        -3 => 502,
        _ => 200,
    };
    let msg: String = match res {
        -1 => "程序出现异常，截图失败".to_string(),
        -2 => "截图保存不能为空".to_string(),
        -3 => "不支持的图片扩展名".to_string(),
        _ => "截图成功".to_string(),
    };
    Ok(generate_result(format!("{}", msg), code))
}

#[tauri::command]
pub async fn get_screen_rect_info() -> Result<String, ()>{
    let util: Util = Util::new();
    let res: String = util
        .get_screen_rect_info()
        .unwrap_or("{\"startX\":-1,\"startY\":-1,\"width\":-1,\"height\":-1}".to_string());
    Ok(generate_result(res, 200))
}



