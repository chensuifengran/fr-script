use crate::{
    types::{generate_result, mouse_types},
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

    pub fn start(&mut self, duration: Duration, sleep: u64, button: Button) {
        self.stop();
        let running = self.running.clone();
        running.store(true, Ordering::SeqCst);
        let enigo = Enigo::new(&Settings::default());
        if let Ok(mut enigo) = enigo {
            self.handle = Some(thread::spawn(move || {
                let start_time = std::time::Instant::now();
                while running.load(Ordering::SeqCst)
                    && std::time::Instant::now() - start_time < duration
                {
                    let _ = enigo.button(button, Direction::Click);
                    thread::sleep(Duration::from_millis(sleep));
                }
            }));
        }
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
                Button::Left
            } else if button == 1 {
                Button::Middle
            } else {
                Button::Right
            }
        }
        None => Button::Left,
    };
    let sleep = sleep.unwrap_or(50);
    match CLICKER.lock() {
        Ok(mut clicker) => clicker.start(Duration::from_secs(duration), sleep, button.clone()),
        Err(e) => {
            log::error!(
                "[command]start_clicker :{:?} [{}, {}, {:?}]",
                e,
                duration,
                sleep,
                button
            );
        }
    }
}

#[tauri::command]
pub async fn move_mouse(x: i32, y: i32, relative: Option<bool>) -> Result<String, String> {
    let move_type = match relative {
        Some(true) => Coordinate::Rel,
        _ => Coordinate::Abs,
    };
    let enigo = Enigo::new(&Settings::default());
    if let Ok(mut enigo) = enigo {
        let res = enigo.move_mouse(x, y, move_type);
        return match res {
            Ok(_) => Ok(generate_result(String::from("move_mouse ok"), 200)),
            Err(e) => {
                log::error!(
                    "[command]move_mouse error: {:?}, args: {}, {}, {:?}",
                    e,
                    x,
                    y,
                    relative
                );
                Err(generate_result(e.to_string(), 501))
            }
        };
    }
    log::error!("[command]move_mouse error: new enigo failed");
    Err(generate_result(
        "[command]move_mouse error: new enigo failed".to_string(),
        502,
    ))
}

#[tauri::command]
pub async fn mouse_move_click(x: i32, y: i32, button: i32) -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    if let Ok(mut enigo) = enigo {
        move_mouse(x, y, None).await?;
        let mut is_ok = true;
        if button == 0 {
            let res = enigo.button(Button::Left, Direction::Click);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_move_click error: {:?}", res)
            }
        } else if button == 1 {
            let res = enigo.button(Button::Middle, Direction::Click);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_move_click error: {:?}", res)
            }
        } else {
            // enigo.button(Button::Right, Direction::Click);
            let res = enigo.button(Button::Right, Direction::Click);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_move_click error: {:?}", res)
            }
        }
        return if is_ok {
            Ok(generate_result(String::from("mouse_move_click ok"), 200))
        } else {
            Err(generate_result(String::from("mouse_move_click error"), 501))
        };
    }
    log::error!("[command]mouse_move_click: new enigo failed");
    Err(String::from("[command]mouse_move_click: new enigo failed"))
}

#[tauri::command]
pub async fn mouse_move_up(x: i32, y: i32, button: i32) -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    if let Ok(mut enigo) = enigo {
        let mut is_ok = true;
        move_mouse(x, y, None).await?;
        if button == 0 {
            let res = enigo.button(Button::Left, Direction::Release);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_move_up error: {:?}", res)
            }
        } else if button == 1 {
            let res = enigo.button(Button::Middle, Direction::Release);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_move_up error: {:?}", res)
            }
        } else {
            let res = enigo.button(Button::Right, Direction::Release);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_move_up error: {:?}", res)
            }
        }
        return if is_ok {
            Ok(generate_result(String::from("mouse_move_down ok"), 200))
        } else {
            Err(generate_result(String::from("mouse_move_up error"), 501))
        };
    }
    log::error!("[command]mouse_move_up: new enigo failed");
    Err(String::from("[command]mouse_move_up: new enigo failed"))
}
#[tauri::command]
pub async fn mouse_move_down(x: i32, y: i32, button: i32) -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    if let Ok(mut enigo) = enigo {
        move_mouse(x, y, None).await?;
        let mut is_ok = true;
        if button == 0 {
            // enigo.button(Button::Left, Direction::Press);
            let res = enigo.button(Button::Left, Direction::Press);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_move_down error: {:?}", res)
            }
        } else if button == 1 {
            // enigo.button(Button::Middle, Direction::Press);
            let res = enigo.button(Button::Middle, Direction::Press);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_move_down error: {:?}", res)
            }
        } else {
            let res = enigo.button(Button::Right, Direction::Press);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_move_down error: {:?}", res)
            }
        }
        return if is_ok {
            Ok(generate_result(String::from("mouse_move_down ok"), 200))
        } else {
            Err(generate_result(String::from("mouse_move_down error"), 501))
        };
    }
    log::error!("[command]mouse_move_down: new enigo failed");
    Err(String::from("[command]mouse_move_down: new enigo failed"))
}

#[tauri::command]
pub async fn mouse_press(button: i32) -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    if let Ok(mut enigo) = enigo {
        let mut is_ok = true;
        if button == 0 {
            let res = enigo.button(Button::Left, Direction::Press);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_press error: {:?}", res)
            }
        } else if button == 1 {
            let res = enigo.button(Button::Middle, Direction::Press);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_press error: {:?}", res)
            }
        } else {
            let res = enigo.button(Button::Right, Direction::Press);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_press error: {:?}", res)
            }
        }
        return if is_ok {
            Ok(generate_result(String::from("mouse_press ok"), 200))
        } else {
            Err(generate_result(String::from("mouse_press error"), 501))
        };
    }
    log::error!("[command]mouse_press: new enigo failed");
    Err(String::from("[command]mouse_press: new enigo failed"))
}

#[tauri::command]
pub async fn mouse_release(button: i32) -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    if let Ok(mut enigo) = enigo {
        let mut is_ok = false;
        if button == 0 {
            let res = enigo.button(Button::Left, Direction::Release);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_release error: {:?}", res);
            }
        } else if button == 1 {
            let res = enigo.button(Button::Middle, Direction::Release);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_release error: {:?}", res);
            }
        } else {
            let res = enigo.button(Button::Right, Direction::Release);
            if res.is_err() {
                is_ok = false;
                log::error!("[command]mouse_release error: {:?}", res);
            }
        }
        return if is_ok {
            Ok(generate_result(String::from("mouse_release ok"), 200))
        } else {
            Err(String::from("[command]mouse_release: new enigo failed"))
        };
    }
    log::error!("[command]mouse_release: new enigo failed");
    Err(String::from("[command]mouse_release: new enigo failed"))
}

#[tauri::command]
pub async fn mouse_drag(
    x: i32,
    y: i32,
    to_x: i32,
    to_y: i32,
    duration: Option<i32>,
) -> Result<String, String> {
    //duration为从x,y到to_x,to_y的时间，单位为ms
    let enigo = Enigo::new(&Settings::default());
    if let Ok(mut enigo) = enigo {
        let mut is_ok = true;
        if x < 0 || y < 0 {
            let r = enigo.location();
            if let Ok((cx, cy)) = r {
                let res = enigo.move_mouse(cx, cy, Coordinate::Abs);
                if res.is_err() {
                    is_ok = false;
                }
            }
        } else {
            let res = enigo.move_mouse(x, y, Coordinate::Abs);
            if res.is_err() {
                is_ok = false;
            }
        }
        let res = enigo.button(Button::Left, Direction::Press);
        if res.is_err() {
            is_ok = false;
        }
        if let Some(duration) = duration {
            let dx = (to_x - x) as f32;
            let dy = (to_y - y) as f32;
            let step = 10;
            let step_x = dx / step as f32;
            let step_y = dy / step as f32;
            for _ in 0..step {
                let res = enigo.move_mouse(step_x as i32, step_y as i32, Coordinate::Rel);
                if res.is_err() {
                    is_ok = false;
                }
                thread::sleep(Duration::from_millis(duration as u64 / step as u64));
            }
        }
        let res = enigo.move_mouse(to_x, to_y, Coordinate::Abs);
        let res2 = enigo.button(Button::Left, Direction::Release);
        if res.is_err() || res2.is_err() {
            is_ok = false;
        }
        return if is_ok {
            Ok(generate_result(String::from("mouse_drag ok"), 200))
        } else {
            Err(String::from(
                "[command]mouse_drag: move_mouse or button failed",
            ))
        };
    }
    log::error!("[command]mouse_drag: new enigo failed");
    Err(String::from("[command]mouse_drag: new enigo failed"))
}

#[tauri::command]
pub async fn mouse_wheel(delta: i32) -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    if let Ok(mut enigo) = enigo {
        let res = enigo.scroll(delta, Axis::Vertical);
        return if res.is_ok() {
            Ok(generate_result(String::from("mouse_wheel ok"), 200))
        } else {
            Err(String::from("[command]mouse_wheel: scroll failed"))
        };
    }
    log::error!("[command]mouse_wheel: new enigo failed");
    Err(String::from("[command]mouse_wheel: new enigo failed"))
}

#[tauri::command]
pub async fn mouse_get_pos() -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    if let Ok(enigo) = enigo {
        let r = enigo.location();
        if let Ok((x, y)) = r {
            let coordinate = mouse_types::Coordinate::new(x, y);
            return Ok(generate_result(coordinate, 200));
        }
        log::error!("[command]mouse_get_pos: get location failed");
        return Err(String::from("[command]mouse_get_pos: get location failed"));
    }
    log::error!("[command]mouse_get_pos: new enigo failed");
    Err(String::from("[command]mouse_get_pos: new enigo failed"))
}
