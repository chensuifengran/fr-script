use crate::types::hook_types::{
    CaptureOptions, HookEvent, HookEventType, MouseWhellDirection, POS,
};
use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::ptr::null_mut;
use std::sync::atomic::AtomicBool;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use std::{mem, ptr};
use winapi::shared::windef::{self, POINT};
use winapi::um::libloaderapi::GetModuleHandleA;
use winapi::um::winuser::{
    CallNextHookEx, GetMessageW, PostQuitMessage, SetWindowsHookExA, UnhookWindowsHookEx,
    KBDLLHOOKSTRUCT, MSLLHOOKSTRUCT, WH_KEYBOARD_LL, WH_MOUSE_LL, WM_KEYDOWN, WM_KEYUP,
    WM_LBUTTONDOWN, WM_LBUTTONUP, WM_MBUTTONDOWN, WM_MBUTTONUP, WM_MOUSEWHEEL, WM_RBUTTONDOWN,
    WM_RBUTTONUP,
};
static EVENT_LIST: Lazy<Arc<Mutex<Vec<HookEvent>>>> =
    Lazy::new(|| Arc::new(Mutex::new(Vec::new())));
static mut KEY_CODE_MAP: Lazy<HashMap<u32, String>> = Lazy::new(|| HashMap::new());
static mut STOP_CAPTURE_FLAG: Lazy<Arc<AtomicBool>> =
    Lazy::new(|| Arc::new(AtomicBool::new(false)));
fn init_key_map() {
    unsafe {
        KEY_CODE_MAP.clear();
        let key_mappings = [
            (186, "OEM1"),
            (191, "OEM2"),
            (192, "OEM3"),
            (219, "OEM4"),
            (220, "OEM5"),
            (221, "OEM6"),
            (222, "OEM7"),
            (187, "OEMPlus"),
            (188, "OEMComma"),
            (190, "OEMPeriod"),
            (111, "Divide"),
            (106, "Multiply"),
            (110, "Decimal"),
            (107, "Add"),
            (109, "Subtract"),
            (189, "OEMMinus"),
            (160, "LShift"),
            (161, "RShift"),
            (162, "Control"),
            (163, "Control"),
            (164, "Alt"),
            (165, "Alt"),
            (91, "Windows"),
            (92, "Windows"),
            (0x08, "Backspace"),
            (0x09, "Tab"),
            (0x0D, "Return"),
            (0x13, "Pause"),
            (0x14, "CapsLock"),
            (0x1B, "Escape"),
            (0x20, "Space"),
            (0x21, "PageUp"),
            (0x22, "PageDown"),
            (0x23, "End"),
            (0x24, "Home"),
            (0x25, "LeftArrow"),
            (0x26, "UpArrow"),
            (0x27, "RightArrow"),
            (0x28, "DownArrow"),
            (0x2D, "Insert"),
            (0x2E, "Delete"),
            (0x5D, "ContextMenu"),
            (0x90, "NumLock"),
            (0x91, "ScrollLock"),
        ];
        for &(code, name) in &key_mappings {
            KEY_CODE_MAP.insert(code, name.to_string());
        }
        for i in 0..=9 {
            KEY_CODE_MAP.insert(0x60 + i, format!("Numpad{}", i));
            KEY_CODE_MAP.insert(0x30 + i, format!("Num{}", i));
        }
        for i in 1..=12 {
            KEY_CODE_MAP.insert(0x70 + i - 1, format!("F{}", i));
        }
        for i in 65u32..=90 {
            KEY_CODE_MAP.insert(i, char::from_u32(i).unwrap().to_uppercase().to_string());
        }
    }
}
pub unsafe extern "system" fn keyboard_hook_proc(
    code: i32,
    w_param: usize,
    l_param: isize,
) -> isize {
    if STOP_CAPTURE_FLAG.load(std::sync::atomic::Ordering::SeqCst) {
        STOP_CAPTURE_FLAG.store(false, std::sync::atomic::Ordering::SeqCst);
        PostQuitMessage(0);
        return CallNextHookEx(null_mut(), code, w_param, l_param);
    }
    if code >= 0 {
        let kb_struct = &*(l_param as *const KBDLLHOOKSTRUCT);
        let key_code = ptr::read(&(*kb_struct).vkCode);
        let now = SystemTime::now();
        let duration_since_epoch = now
            .duration_since(UNIX_EPOCH)
            .expect("System time before UNIX EPOCH!");
        let timestamp_ms = duration_since_epoch.as_millis();
        let mut event_list = EVENT_LIST.lock().unwrap();
        let key_name = KEY_CODE_MAP.get(&key_code);
        let event_type = match w_param as u32 {
            WM_KEYDOWN => HookEventType::KeyDown,
            WM_KEYUP => HookEventType::KeyUp,
            _ => return CallNextHookEx(null_mut(), code, w_param, l_param),
        };
        event_list.push(HookEvent {
            event_type,
            pos: None,
            wheel_direction: None,
            button: key_name.cloned(),
            time: timestamp_ms,
            duration: None,
            target_pos: None,
        });
    }
    CallNextHookEx(null_mut(), code, w_param, l_param)
}
pub unsafe extern "system" fn mouse_hook_proc(code: i32, w_param: usize, l_param: isize) -> isize {
    if STOP_CAPTURE_FLAG.load(std::sync::atomic::Ordering::SeqCst) {
        STOP_CAPTURE_FLAG.store(false, std::sync::atomic::Ordering::SeqCst);
        PostQuitMessage(0);
        return CallNextHookEx(null_mut(), code, w_param, l_param);
    }
    if code >= 0 {
        let mouse_struct = &*(l_param as *const MSLLHOOKSTRUCT);
        let pt: POINT = ptr::read(&(*mouse_struct).pt); // 获取鼠标坐标
        let point = POS {
            x: pt.x as u32,
            y: pt.y as u32,
        };
        let now = SystemTime::now();
        let duration_since_epoch = now
            .duration_since(UNIX_EPOCH)
            .expect("System time before UNIX EPOCH!");
        let timestamp_ms = duration_since_epoch.as_millis();
        let mut event_list = EVENT_LIST.lock().unwrap();
        match w_param as u32 {
            WM_LBUTTONDOWN => {
                event_list.push(HookEvent {
                    event_type: HookEventType::MouseDown,
                    pos: Some(point),
                    wheel_direction: None,
                    button: Some("left".to_string()),
                    time: timestamp_ms,
                    duration: None,
                    target_pos: None,
                });
            }
            WM_LBUTTONUP => {
                event_list.push(HookEvent {
                    event_type: HookEventType::MouseUp,
                    pos: Some(point),
                    wheel_direction: None,
                    button: Some("left".to_string()),
                    time: timestamp_ms,
                    duration: None,
                    target_pos: None,
                });
            }
            WM_RBUTTONDOWN => {
                event_list.push(HookEvent {
                    event_type: HookEventType::MouseDown,
                    pos: Some(point),
                    wheel_direction: None,
                    button: Some("right".to_string()),
                    time: timestamp_ms,
                    duration: None,
                    target_pos: None,
                });
            }
            WM_RBUTTONUP => {
                event_list.push(HookEvent {
                    event_type: HookEventType::MouseUp,
                    pos: Some(point),
                    wheel_direction: None,
                    button: Some("right".to_string()),
                    time: timestamp_ms,
                    duration: None,
                    target_pos: None,
                });
            }
            WM_MBUTTONDOWN => {
                event_list.push(HookEvent {
                    event_type: HookEventType::MouseDown,
                    pos: Some(point),
                    wheel_direction: None,
                    button: Some("middle".to_string()),
                    time: timestamp_ms,
                    duration: None,
                    target_pos: None,
                });
            }
            WM_MBUTTONUP => {
                event_list.push(HookEvent {
                    event_type: HookEventType::MouseUp,
                    pos: Some(point),
                    wheel_direction: None,
                    button: Some("middle".to_string()),
                    time: timestamp_ms,
                    duration: None,
                    target_pos: None,
                });
            }
            WM_MOUSEWHEEL => {
                let delta = (*mouse_struct).mouseData >> 16;
                let direction = if delta < 1000 {
                    MouseWhellDirection::Up
                } else {
                    MouseWhellDirection::Down
                };
                event_list.push(HookEvent {
                    event_type: HookEventType::MouseWhell,
                    pos: Some(point),
                    wheel_direction: Some(direction),
                    button: None,
                    time: timestamp_ms,
                    duration: None,
                    target_pos: None,
                });
            }
            // WM_MOUSEMOVE => {
            //     // println!("unhandled message: {}", w_param);
            // }
            _ => (),
        }
    }
    // 调用下一个钩子
    CallNextHookEx(null_mut(), code, w_param, l_param)
}
pub struct CaptureHook {
    keyboard_id: Option<*mut windef::HHOOK__>,
    mouse_id: Option<*mut windef::HHOOK__>,
    gen_options: Option<CaptureOptions>,
    generate_comment: bool,
}
impl CaptureHook {
    pub fn quit() {
        unsafe {
            STOP_CAPTURE_FLAG.store(true, std::sync::atomic::Ordering::SeqCst);
        }
    }

    pub fn new(gen_options: Option<CaptureOptions>, generate_comment: Option<bool>) -> Self {
        init_key_map();
        Self {
            keyboard_id: None,
            mouse_id: None,
            gen_options,
            generate_comment: generate_comment.unwrap_or(false),
        }
    }

    pub fn preconditioning(&mut self) -> Vec<HookEvent> {
        let event_list = EVENT_LIST.lock().unwrap().clone();
        let options = self.gen_options.clone();
        let mut new_event_list = Vec::new();

        if let Some(op) = options {
            if op.merge_key_options.is_none() && op.merge_mouse_options.is_none() {
                return event_list;
            }

            let mut first_merge_event: Option<HookEvent> = None;
            let mut continue_to_next = false;

            for index in 1..event_list.len() {
                if continue_to_next {
                    continue_to_next = false;
                    continue;
                }

                let mut pre_event = event_list[index - 1].clone();
                let cur_event = event_list[index].clone();

                if cur_event.button == pre_event.button
                    && (((pre_event.event_type == HookEventType::KeyDown
                        || pre_event.event_type == HookEventType::KeyUp)
                        && (cur_event.event_type == HookEventType::KeyDown
                            || cur_event.event_type == HookEventType::KeyUp))
                        || ((pre_event.event_type == HookEventType::MouseDown
                            || pre_event.event_type == HookEventType::MouseUp)
                            && (cur_event.event_type == HookEventType::MouseDown
                                || cur_event.event_type == HookEventType::MouseUp)))
                {
                    if cur_event.event_type == pre_event.event_type
                        && pre_event.event_type != HookEventType::MouseDown
                        && pre_event.event_type != HookEventType::MouseUp
                    {
                        if let Some(merge_key_options) = &op.merge_key_options {
                            if merge_key_options.merge_repeat {
                                let repeat_max_interval_ms =
                                    merge_key_options.repeat_max_interval_ms;
                                if first_merge_event.is_none() {
                                    first_merge_event = Some(pre_event.clone());
                                    continue;
                                } else if let Some(mut first_event) = first_merge_event.clone() {
                                    let duration = cur_event.time - pre_event.time;
                                    if duration <= repeat_max_interval_ms {
                                        continue;
                                    } else {
                                        first_event.duration =
                                            Some(cur_event.time - first_event.time);
                                        new_event_list.push(first_event);
                                        first_merge_event = None;
                                        if index == event_list.len() - 1 {
                                            new_event_list.push(cur_event);
                                        }
                                        continue;
                                    }
                                }
                            }
                        }
                    } else {
                        if let Some(mut first_event) = first_merge_event.take() {
                            first_event.duration = Some(pre_event.time - first_event.time);
                            new_event_list.push(first_event);
                            if index == event_list.len() - 1 {
                                new_event_list.push(cur_event);
                            }
                            continue;
                        }

                        if pre_event.event_type == HookEventType::KeyDown
                            || pre_event.event_type == HookEventType::MouseDown
                        {
                            if let Some(mouse_op) = &op.merge_mouse_options {
                                if pre_event.event_type == HookEventType::MouseDown {
                                    let merge_click = mouse_op.merge;
                                    let merge_drag = mouse_op.merge_drag;
                                    let duration = cur_event.time - pre_event.time;
                                    let pp = pre_event.pos.unwrap_or(POS { x: 0, y: 0 });
                                    let cp = cur_event.pos.unwrap_or(POS { x: 0, y: 0 });

                                    if pp.x != cp.x || pp.y != cp.y {
                                        if merge_drag {
                                            pre_event.event_type = HookEventType::MouseDrag;
                                            pre_event.target_pos = cur_event.pos;
                                            pre_event.duration = Some(duration);
                                            new_event_list.push(pre_event);
                                            continue_to_next = true;
                                            continue;
                                        }
                                    } else if duration <= mouse_op.max_interval_ms {
                                        if merge_click {
                                            pre_event.event_type = HookEventType::MouseClick;
                                            new_event_list.push(pre_event);
                                            continue_to_next = true;
                                            continue;
                                        }
                                    }
                                }
                            }

                            if let Some(key_op) = &op.merge_key_options {
                                if pre_event.event_type == HookEventType::KeyDown {
                                    let merge = key_op.merge_press_release;
                                    let duration = cur_event.time - pre_event.time;
                                    if merge && duration <= key_op.press_release_max_interval_ms {
                                        pre_event.event_type = HookEventType::KeyPress;
                                        new_event_list.push(pre_event);
                                        continue_to_next = true;
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                }

                new_event_list.push(pre_event);
                if index == event_list.len() - 1 {
                    new_event_list.push(cur_event);
                }
            }
        } else {
            new_event_list = event_list;
        }

        new_event_list
    }

    fn translate_to_api(&mut self) -> Vec<String> {
        let event_list: Vec<HookEvent> = self.preconditioning();
        EVENT_LIST.lock().unwrap().clear();
        let mut res: Vec<String> = Vec::new();
        let mut last_time = 0;

        for event in event_list {
            if last_time == 0 {
                last_time = event.time;
            } else {
                let sleep_ms = event.time - last_time;
                if sleep_ms > 0 {
                    if self.generate_comment {
                        res.push(format!("//休眠{}ms", sleep_ms));
                    }
                    res.push(format!("await sleep({});", sleep_ms));
                }
                last_time = event.time;
            }

            let pos = event.pos.unwrap_or(POS { x: 0, y: 0 });
            let button = event.button.clone().unwrap_or_default();

            match event.event_type {
                HookEventType::MouseDrag => {
                    let target_pos = event.target_pos.unwrap_or(POS { x: 0, y: 0 });
                    let duration = event.duration.unwrap_or(0);
                    if self.generate_comment {
                        res.push(format!(
                            "//{}ms之内，从({},{})拖动到({},{})",
                            duration, pos.x, pos.y, target_pos.x, target_pos.y
                        ));
                    }
                    res.push(format!(
                        "await Mouse.drag({}, {}, {}, {}, {});",
                        pos.x, pos.y, target_pos.x, target_pos.y, duration
                    ));
                }
                HookEventType::MouseDown => {
                    if self.generate_comment {
                        let btn_name = match button.as_str() {
                            "right" => "右",
                            "middle" => "中",
                            _ => "左",
                        };
                        res.push(format!(
                            "//鼠标移动到({},{})后按下{}键",
                            pos.x, pos.y, btn_name
                        ));
                    }
                    let button = if button == "left" {
                        "".to_string()
                    } else {
                        format!(", \"{}\"", button)
                    };
                    res.push(format!("await Mouse.down({}, {}{});", pos.x, pos.y, button));
                }
                HookEventType::MouseUp => {
                    if self.generate_comment {
                        let btn_name = match button.as_str() {
                            "right" => "右",
                            "middle" => "中",
                            _ => "左",
                        };
                        res.push(format!(
                            "//鼠标移动到({},{})后释放{}键",
                            pos.x, pos.y, btn_name
                        ));
                    }
                    let button = if button == "left" {
                        "".to_string()
                    } else {
                        format!(", \"{}\"", button)
                    };
                    res.push(format!("await Mouse.up({}, {}{});", pos.x, pos.y, button));
                }
                HookEventType::MouseClick => {
                    if self.generate_comment {
                        let btn_name = match button.as_str() {
                            "right" => "右",
                            "middle" => "中",
                            _ => "左",
                        };
                        res.push(format!(
                            "//鼠标移动到({},{})后轻击{}键",
                            pos.x, pos.y, btn_name
                        ));
                    }
                    let button = if button == "left" {
                        "".to_string()
                    } else {
                        format!(", \"{}\"", button)
                    };
                    res.push(format!(
                        "await Mouse.click({}, {}{});",
                        pos.x, pos.y, button
                    ));
                }
                HookEventType::MouseWhell => {
                    let delta = match event.wheel_direction {
                        Some(MouseWhellDirection::Up) => -1,
                        Some(MouseWhellDirection::Down) => 1,
                        None => panic!("Invalid wheel direction"),
                    };
                    if self.generate_comment {
                        let ud = if delta < 0 { "上" } else { "下" };
                        let revers_ud = if delta < 0 { "下" } else { "上" };
                        res.push(format!(
                            "//鼠标滚轮往{}滚动{}长度单位(内容往{}滚动)",
                            ud, delta, revers_ud
                        ));
                    }
                    res.push(format!("await Mouse.wheel({});", delta));
                }
                HookEventType::KeyDown => {
                    if self.generate_comment {
                        res.push(format!("//按下键盘按键: {}", button));
                    }
                    res.push(format!("await Input.keyDown(\"{}\");", button));
                }
                HookEventType::KeyUp => {
                    if self.generate_comment {
                        res.push(format!("//释放键盘按键: {}", button));
                    }
                    res.push(format!("await Input.keyUp(\"{}\");", button));
                }
                HookEventType::KeyPress => {
                    if self.generate_comment {
                        res.push(format!("//按下并释放键盘按键: {}", button));
                    }
                    res.push(format!("await Input.press(\"{}\");", button));
                }
            }
        }

        res
    }

    pub fn stop(&mut self) {
        unsafe {
            if let Some(keyboard_hook_id) = self.keyboard_id {
                UnhookWindowsHookEx(keyboard_hook_id);
                self.keyboard_id = None;
                log::debug!("Keyboard hook uninstalled");
            }
            if let Some(mouse_hook_id) = self.mouse_id {
                UnhookWindowsHookEx(mouse_hook_id);
                self.mouse_id = None;
                log::debug!("Mouse hook uninstalled");
            }
            STOP_CAPTURE_FLAG.store(false, std::sync::atomic::Ordering::SeqCst);
        }
    }

    pub fn capture(&mut self) -> Vec<String> {
        EVENT_LIST.lock().unwrap().clear();
        if self.keyboard_id.is_none() {
            let k_id = unsafe {
                SetWindowsHookExA(
                    WH_KEYBOARD_LL,
                    Some(self::keyboard_hook_proc),
                    GetModuleHandleA(null_mut()),
                    0,
                )
            };
            if k_id.is_null() {
                log::error!("Failed to install keyboard hook");
            } else {
                log::debug!("Keyboard hook installed");
                self.keyboard_id = Some(k_id);
            }
        }
        if self.mouse_id.is_none() {
            let m_id = unsafe {
                SetWindowsHookExA(
                    WH_MOUSE_LL,
                    Some(mouse_hook_proc),
                    GetModuleHandleA(null_mut()),
                    0,
                )
            };
            if m_id.is_null() {
                log::error!("Failed to install mouse hook");
            } else {
                log::debug!("Mouse hook installed");
                self.mouse_id = Some(m_id);
            }
        }
        unsafe {
            let mut msg = mem::zeroed();
            GetMessageW(&mut msg, null_mut(), 0, 0);
        }
        self.stop();
        self.translate_to_api()
    }
}
