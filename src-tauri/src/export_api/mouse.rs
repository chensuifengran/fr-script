use crate::types::{mouse_types::Coordinate, generate_result};
use enigo::*;

#[tauri::command]
pub async fn mouse_move_to(x: i32, y: i32) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.mouse_move_to(x, y);
    Ok(generate_result(String::from("mouse_move_to ok"), 200))
}

#[tauri::command]
pub async fn mouse_move_relative(x: i32, y: i32) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.mouse_move_relative(x, y);
    Ok(generate_result(String::from("mouse_move_to ok"), 200))
}

#[tauri::command]
pub async fn mouse_move_click(x: i32, y: i32, is_left: bool) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.mouse_move_to(x, y);
    if is_left {
        enigo.mouse_click(MouseButton::Left);
    } else {
        enigo.mouse_click(MouseButton::Right);
    }
    Ok(generate_result(String::from("mouse_move_click ok"), 200))
}

#[tauri::command]
pub async fn mouse_press(is_left: bool) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    if is_left {
        enigo.mouse_down(MouseButton::Left);
    } else {
        enigo.mouse_down(MouseButton::Right);
    }
    Ok(generate_result(String::from("mouse_press ok"), 200))
}

#[tauri::command]
pub async fn mouse_release(is_left: bool) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    if is_left {
        enigo.mouse_up(MouseButton::Left);
    } else {
        enigo.mouse_up(MouseButton::Right);
    }
    Ok(generate_result(String::from("mouse_release ok"), 200))
}

#[tauri::command]
pub async fn mouse_wheel(delta: i32) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.mouse_scroll_y(delta);
    Ok(generate_result(String::from("mouse_wheel ok"), 200))
}

#[tauri::command]
pub async fn mouse_get_pos() -> Result<String, ()> {
    let enigo: Enigo = Enigo::new();
    let (x, y) = enigo.mouse_location();
    let coordinate = Coordinate::new(x, y);
    Ok(generate_result(coordinate, 200))
}
