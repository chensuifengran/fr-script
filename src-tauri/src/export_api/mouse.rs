use crate::{
    types::{generate_result, mouse_types::Coordinate},
    CLICKER,
};
use enigo::*;
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use std::thread;
use std::time::Duration;

pub struct Clicker {
    pub running: Arc<AtomicBool>,
    pub handle: Option<thread::JoinHandle<()>>,
}

impl Clicker {
    pub fn new() -> Self {
        Self {
            running: Arc::new(AtomicBool::new(false)),
            handle: None,
        }
    }

    pub fn start(&mut self, duration: Duration, sleep: u64, button: MouseButton) {
        self.stop();
        let running = self.running.clone();
        running.store(true, Ordering::SeqCst);
        let mut enigo = Enigo::new();
        self.handle = Some(thread::spawn(move || {
            let start_time = std::time::Instant::now();
            while running.load(Ordering::SeqCst)
                && std::time::Instant::now() - start_time < duration
            {
                enigo.mouse_click(button);
                thread::sleep(Duration::from_millis(sleep));
            }
        }));
    }

    pub fn stop(&mut self) {
        self.running.store(false, Ordering::SeqCst);
        if let Some(handle) = self.handle.take() {
            match handle.join() {
                Ok(_) => {}
                Err(e) => {
                    log::error!("clicker stop :{:?}", e);
                }
            }
        }
    }
}

#[tauri::command]
pub fn stop_clicker() {
    match CLICKER.lock() {
        Ok(mut clicker) => clicker.stop(),
        Err(e) => {
            log::error!("[command]stop_clicker :{:?}", e);
        }
    }
}

#[tauri::command]
pub fn start_clicker(duration: u64, sleep: Option<u64>, button: Option<i32>) {
    if duration == 0 {
        stop_clicker();
        return;
    }
    let button = match button {
        Some(button) => {
            if button == 0 {
                MouseButton::Left
            } else if button == 1 {
                MouseButton::Middle
            } else {
                MouseButton::Right
            }
        }
        None => MouseButton::Left,
    };
    let sleep = sleep.unwrap_or(50);
    match CLICKER.lock() {
        Ok(mut clicker) => clicker.start(Duration::from_secs(duration), sleep, button.clone()),
        Err(e) => {
            log::error!("[command]start_clicker :{:?} [{}, {}, {:?}]", e, duration, sleep, button);
        }
    }
}

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
pub async fn mouse_move_click(x: i32, y: i32, button: i32) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    enigo.mouse_move_to(x, y);
    if button == 0 {
        enigo.mouse_click(MouseButton::Left);
    } else if button == 1 {
        enigo.mouse_click(MouseButton::Middle);
    } else {
        enigo.mouse_click(MouseButton::Right);
    }
    Ok(generate_result(String::from("mouse_move_click ok"), 200))
}

#[tauri::command]
pub async fn mouse_press(button: i32) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    if button == 0 {
        enigo.mouse_down(MouseButton::Left);
    } else if button == 1 {
        enigo.mouse_down(MouseButton::Middle);
    } else {
        enigo.mouse_down(MouseButton::Right);
    }
    Ok(generate_result(String::from("mouse_press ok"), 200))
}

#[tauri::command]
pub async fn mouse_release(button: i32) -> Result<String, ()> {
    let mut enigo: Enigo = Enigo::new();
    if button == 0 {
        enigo.mouse_up(MouseButton::Left);
    } else if button == 1 {
        enigo.mouse_up(MouseButton::Middle);
    } else {
        enigo.mouse_up(MouseButton::Right);
    }
    Ok(generate_result(String::from("mouse_release ok"), 200))
}

#[tauri::command]
pub async fn mouse_drag(x: i32, y: i32, to_x: i32, to_y: i32, duration: Option<i32>) -> Result<String, ()> {
    //duration为从x,y到to_x,to_y的时间，单位为ms
    let mut enigo: Enigo = Enigo::new();
    if x < 0 || y < 0 {
        let (cur_x, cur_y) = enigo.mouse_location();
        enigo.mouse_move_to(cur_x, cur_y);
    } else {
        enigo.mouse_move_to(x, y);
    }
    enigo.mouse_down(MouseButton::Left);
    if let Some(duration) = duration {
        let dx = (to_x - x) as f32;
        let dy = (to_y - y) as f32;
        let step = 10;
        let step_x = dx / step as f32;
        let step_y = dy / step as f32;
        for _ in 0..step {
            enigo.mouse_move_relative(step_x as i32, step_y as i32);
            thread::sleep(Duration::from_millis(duration as u64 / step as u64));
        }
    }
    enigo.mouse_move_to(to_x, to_y);
    enigo.mouse_up(MouseButton::Left);
    Ok(generate_result(String::from("mouse_drag ok"), 200))
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
