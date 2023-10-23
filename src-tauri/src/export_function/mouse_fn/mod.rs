use crate::types::{mouse_types::Coordinate, generate_result};
use mouse_rs::{types::keys::Keys, Mouse};



#[tauri::command]
pub fn move_to(x: i32, y: i32) -> String {
    let return_message: String;
    let result_code: u32;
    let mouse: Mouse = Mouse::new();
    if let Ok(_) = mouse.move_to(x, y) {
        result_code = 200;
        return_message = format!("成功将鼠标移动到x:{} y:{}!", x, y);
    } else {
        result_code = 500;
        return_message = format!("无法将鼠标移动到x:{} y:{}!", x, y);
    }
    generate_result(return_message, result_code)
}

#[tauri::command]
pub fn move_click(x: i32, y: i32, is_left: bool) -> String {
    let return_message: String;
    let result_code: u32;
    let mouse: Mouse = Mouse::new();
    if let Ok(_) = mouse.move_to(x, y) {
        if is_left {
            if let Ok(_) = mouse.press(&Keys::LEFT) {
                if let Ok(_) = mouse.release(&Keys::LEFT) {
                    result_code = 200;
                    return_message = format!("成功将鼠标移动到x:{} y:{} 并轻击左键!", x, y);
                } else {
                    result_code = 504;
                    return_message = format!("无法释放鼠标左键");
                }
            } else {
                result_code = 503;
                return_message = format!("无法点击鼠标左键");
            }
        } else {
            if let Ok(_) = mouse.press(&Keys::RIGHT) {
                if let Ok(_) = mouse.release(&Keys::RIGHT) {
                    result_code = 200;
                    return_message = format!("成功将鼠标移动到x:{} y:{} 并轻击右键!", x, y);
                } else {
                    result_code = 502;
                    return_message = format!("无法释放击鼠标右键");
                }
            } else {
                result_code = 501;
                return_message = format!("无法点击击鼠标右键");
            }
        }
    } else {
        result_code = 500;
        return_message = format!("无法将鼠标移动至目标位置x:{} y:{}!", x, y);
    }
    generate_result(return_message, result_code)
}

#[tauri::command]
pub fn press(is_left: bool) -> String {
    let return_message: String;
    let result_code: u32;
    let mouse: Mouse = Mouse::new();
    if is_left {
        if let Ok(_) = mouse.press(&Keys::LEFT) {
            result_code = 200;
            return_message = format!("成功点击鼠标左键!");
        } else {
            result_code = 502;
            return_message = format!("无法点击鼠标左键");
        }
    } else {
        if let Ok(_) = mouse.press(&Keys::RIGHT) {
            result_code = 200;
            return_message = format!("成功点击鼠标右键!");
        } else {
            result_code = 501;
            return_message = format!("无法点击鼠标右键");
        }
    }
    generate_result(return_message, result_code)
}

#[tauri::command]
pub fn release(is_left: bool) -> String {
    let return_message: String;
    let result_code: u32;
    let mouse: Mouse = Mouse::new();
    if is_left {
        if let Ok(_) = mouse.release(&Keys::LEFT) {
            result_code = 200;
            return_message = format!("成功释放鼠标左键!");
        } else {
            result_code = 502;
            return_message = format!("无法释放鼠标左键");
        }
    } else {
        if let Ok(_) = mouse.release(&Keys::RIGHT) {
            result_code = 200;
            return_message = format!("成功释放鼠标右键!");
        } else {
            result_code = 501;
            return_message = format!("无法释放鼠标右键");
        }
    }
    generate_result(return_message, result_code)
}

#[tauri::command]
pub fn wheel(delta: i32) -> String {
    let return_message: String;
    let result_code: u32;
    let mouse: Mouse = Mouse::new();
    if let Ok(_) = mouse.wheel(delta) {
        result_code = 200;
        return_message = format!("成功滚动鼠标滚轮!滚动幅度：{}", delta);
    } else {
        result_code = 500;
        return_message = format!("无法滚动鼠标滚轮");
    }
    generate_result(return_message, result_code)
}

#[tauri::command]
pub fn get_pos() -> String {
    let return_message: Coordinate;
    let result_code: u32;
    let mouse: Mouse = Mouse::new();
    if let Ok(pos) = mouse.get_position() {
        result_code = 200;
        return_message = Coordinate::new(pos.x, pos.y);
    } else {
        result_code = 500;
        return_message = Coordinate::new(-1, -1);
    }
    generate_result(return_message, result_code)
}
