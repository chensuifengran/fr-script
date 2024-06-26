use crate::types::hook_types::{
    CaptureOptions, HookEvent, HookEventType, MouseWhellDirection, POS,
};
use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::mem::{self, transmute};
use std::ptr::null_mut;
use std::sync::atomic::AtomicBool;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
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
        //;:186 OEM1
        KEY_CODE_MAP.insert(186, "OEM1".to_string());
        // /?191 OEM2
        KEY_CODE_MAP.insert(191, "OEM2".to_string());
        // `~192 OEM3
        KEY_CODE_MAP.insert(192, "OEM3".to_string());
        // [{219 OEM4
        KEY_CODE_MAP.insert(219, "OEM4".to_string());
        // \|220 OEM5
        KEY_CODE_MAP.insert(220, "OEM5".to_string());
        // ]}221 OEM6
        KEY_CODE_MAP.insert(221, "OEM6".to_string());
        // '"222 OEM7
        KEY_CODE_MAP.insert(222, "OEM7".to_string());
        // =+187 OEMPlus
        KEY_CODE_MAP.insert(187, "OEMPlus".to_string());
        // ,<188 OEMComma
        KEY_CODE_MAP.insert(188, "OEMComma".to_string());
        // .>190 OEMPeriod
        KEY_CODE_MAP.insert(190, "OEMPeriod".to_string());
        // /111 Divide
        KEY_CODE_MAP.insert(111, "Divide".to_string());
        // *106 Multiply
        KEY_CODE_MAP.insert(106, "Multiply".to_string());
        // .110 Decimal
        KEY_CODE_MAP.insert(110, "Decimal".to_string());
        // +107 Add
        KEY_CODE_MAP.insert(107, "Add".to_string());
        // -109 Subtract
        KEY_CODE_MAP.insert(109, "Subtract".to_string());
        // -_189 OEMMinus
        KEY_CODE_MAP.insert(189, "OEMMinus".to_string());
        /*
            LSHIFT160 Shift
            RSHIFT161 Shift
        */
        KEY_CODE_MAP.insert(160, "LShift".to_string());
        KEY_CODE_MAP.insert(161, "RShift".to_string());
        /*
            LCTRL162 Control
            RCTRL163 Control
        */
        KEY_CODE_MAP.insert(162, "Control".to_string());
        KEY_CODE_MAP.insert(163, "Control".to_string());
        /*
            LALT164 Alt
            RALT165 Alt
        */
        KEY_CODE_MAP.insert(164, "Alt".to_string());
        KEY_CODE_MAP.insert(165, "Alt".to_string());
        /*
            LWINDOWS91 Windows
            RWINDOWS92 Windows
        */
        KEY_CODE_MAP.insert(91, "Windows".to_string());
        KEY_CODE_MAP.insert(92, "Windows".to_string());
        KEY_CODE_MAP.insert(0x08, "Backspace".to_string());
        KEY_CODE_MAP.insert(0x09, "Tab".to_string());
        KEY_CODE_MAP.insert(0x0D, "Enter".to_string());
        KEY_CODE_MAP.insert(0x13, "Pause".to_string());
        KEY_CODE_MAP.insert(0x14, "CapsLock".to_string());
        KEY_CODE_MAP.insert(0x1B, "Escape".to_string());
        KEY_CODE_MAP.insert(0x20, "Space".to_string());
        KEY_CODE_MAP.insert(0x21, "PageUp".to_string());
        KEY_CODE_MAP.insert(0x22, "PageDown".to_string());
        KEY_CODE_MAP.insert(0x23, "End".to_string());
        KEY_CODE_MAP.insert(0x24, "Home".to_string());
        KEY_CODE_MAP.insert(0x25, "LeftArrow".to_string());
        KEY_CODE_MAP.insert(0x26, "UpArrow".to_string());
        KEY_CODE_MAP.insert(0x27, "RightArrow".to_string());
        KEY_CODE_MAP.insert(0x28, "DownArrow".to_string());
        KEY_CODE_MAP.insert(0x2D, "Insert".to_string());
        KEY_CODE_MAP.insert(0x2E, "Delete".to_string());
        KEY_CODE_MAP.insert(0x5D, "ContextMenu".to_string());
        KEY_CODE_MAP.insert(0x90, "NumLock".to_string());
        KEY_CODE_MAP.insert(0x91, "ScrollLock".to_string());
        // 小键盘数字键
        for i in 0..=9 {
            KEY_CODE_MAP.insert(0x60 + i, format!("Numpad{}", i));
        }
        // 数字键
        for i in 0..=9 {
            KEY_CODE_MAP.insert(0x30 + i, format!("Num{}", i));
        }

        // 功能键
        for i in 1..=12 {
            KEY_CODE_MAP.insert(0x70 + i - 1, format!("F{}", i));
        }

        // 字母键
        for i in 65u32..=90 {
            KEY_CODE_MAP.insert(i, char::from_u32(i).unwrap().to_uppercase().to_string());
        }
    }
}
// 定义键盘钩子的回调函数
pub unsafe extern "system" fn keyboard_hook_proc(
    code: i32,
    w_param: usize,
    l_param: isize,
) -> isize {
    if STOP_CAPTURE_FLAG
        .clone()
        .load(std::sync::atomic::Ordering::SeqCst)
    {
        STOP_CAPTURE_FLAG
            .clone()
            .store(false, std::sync::atomic::Ordering::SeqCst);
        PostQuitMessage(0);
        return CallNextHookEx(null_mut(), code, w_param, l_param);
    }
    if code >= 0 {
        let kb_struct = transmute::<isize, *const KBDLLHOOKSTRUCT>(l_param);
        let key_code = (*kb_struct).vkCode;
        let now = SystemTime::now();
        let duration_since_epoch = now
            .duration_since(UNIX_EPOCH)
            .expect("System time before UNIX EPOCH!");
        let timestamp_ms = duration_since_epoch.as_millis();
        let mut event_list = EVENT_LIST.lock().unwrap();
        let key_name = KEY_CODE_MAP.get(&key_code);
        match w_param as u32 {
            WM_KEYDOWN => match key_name {
                Some(name) => {
                    event_list.push(HookEvent {
                        event_type: HookEventType::KeyDown,
                        pos: None,
                        wheel_direction: None,
                        button: Some(String::from(name)),
                        time: timestamp_ms,
                        duration: None,
                        target_pos: None,
                    });
                }
                None => {
                    event_list.push(HookEvent {
                        event_type: HookEventType::KeyDown,
                        pos: None,
                        wheel_direction: None,
                        button: None,
                        time: timestamp_ms,
                        duration: None,
                        target_pos: None,
                    });
                }
            },
            WM_KEYUP => match key_name {
                Some(name) => {
                    event_list.push(HookEvent {
                        event_type: HookEventType::KeyUp,
                        pos: None,
                        wheel_direction: None,
                        button: Some(String::from(name)),
                        time: timestamp_ms,
                        duration: None,
                        target_pos: None,
                    });
                }
                None => {
                    event_list.push(HookEvent {
                        event_type: HookEventType::KeyUp,
                        pos: None,
                        wheel_direction: None,
                        button: None,
                        time: timestamp_ms,
                        duration: None,
                        target_pos: None,
                    });
                }
            },
            _ => (),
        }
    }
    // 调用下一个钩子
    CallNextHookEx(null_mut(), code, w_param, l_param)
}
// 定义鼠标钩子的回调函数
pub unsafe extern "system" fn mouse_hook_proc(code: i32, w_param: usize, l_param: isize) -> isize {
    if STOP_CAPTURE_FLAG
        .clone()
        .load(std::sync::atomic::Ordering::SeqCst)
    {
        STOP_CAPTURE_FLAG
            .clone()
            .store(false, std::sync::atomic::Ordering::SeqCst);
        PostQuitMessage(0);
        return CallNextHookEx(null_mut(), code, w_param, l_param);
    }
    if code >= 0 {
        let mouse_struct = transmute::<isize, *const MSLLHOOKSTRUCT>(l_param);
        let pt: POINT = (*mouse_struct).pt; // 获取鼠标坐标
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
            STOP_CAPTURE_FLAG
                .clone()
                .store(true, std::sync::atomic::Ordering::SeqCst)
        }
    }
    pub fn new(gen_options: Option<CaptureOptions>, generate_comment: Option<bool>) -> Self {
        init_key_map();
        let s = Self {
            keyboard_id: None,
            mouse_id: None,
            gen_options,
            generate_comment: match generate_comment {
                Some(v) => v,
                None => false,
            },
        };
        s
    }
    pub fn preconditioning(&mut self) -> Vec<HookEvent> {
        let event_list = EVENT_LIST.lock().unwrap().clone();
        let options = self.gen_options.clone();
        let mut new_event_list = Vec::new();
        match options {
            Some(op) => {
                if op.merge_key_options.is_none() && op.merge_mouse_options.is_none() {
                    return event_list;
                }
                let mut frist_merge_event: Option<HookEvent> = None;
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
                        //可能需要合并
                        if cur_event.event_type == pre_event.event_type
                            && pre_event.event_type != HookEventType::MouseDown
                            && pre_event.event_type != HookEventType::MouseUp
                        {
                            //重复按键
                            let merge_key_repeat = match op.merge_key_options.clone() {
                                Some(op) => op.merge_repeat,
                                None => false,
                            };
                            if merge_key_repeat {
                                let repeat_max_interval_ms =
                                    op.merge_key_options.clone().unwrap().repeat_max_interval_ms;
                                if frist_merge_event.is_none() {
                                    frist_merge_event = Some(pre_event.clone());
                                    continue;
                                } else {
                                    if let Some(mut frist_event) = frist_merge_event.clone() {
                                        let duration = cur_event.time - pre_event.time;
                                        if duration <= repeat_max_interval_ms {
                                            continue;
                                        } else {
                                            frist_event.duration =
                                                Some(cur_event.time - frist_event.time);
                                            new_event_list.push(frist_event.clone());
                                            frist_merge_event = None;
                                            if index == event_list.len() - 1 {
                                                new_event_list.push(cur_event.clone());
                                            }
                                            continue;
                                        }
                                    }
                                }
                            }
                        } else {
                            if let Some(mut frist_event) = frist_merge_event {
                                frist_event.duration = Some(pre_event.time - frist_event.time);
                                new_event_list.push(frist_event.clone());
                                frist_merge_event = None;
                                if index == event_list.len() - 1 {
                                    new_event_list.push(cur_event.clone());
                                }
                                continue;
                            }
                            if pre_event.event_type == HookEventType::KeyDown
                                || pre_event.event_type == HookEventType::MouseDown
                            {
                                //按键为按下的状态才需要判断是否合并
                                if let Some(mouse_op) = op.merge_mouse_options.clone() {
                                    if pre_event.event_type == HookEventType::MouseDown {
                                        let merge_click = mouse_op.merge;
                                        let merge_drag = mouse_op.merge_drag;
                                        let duration = cur_event.time - pre_event.time;
                                        //合并判断
                                        let (px, py) = match pre_event.pos {
                                            Some(pos) => (pos.x, pos.y),
                                            None => (0, 0),
                                        };
                                        let (cx, cy) = match cur_event.pos {
                                            Some(pos) => (pos.x, pos.y),
                                            None => (0, 0),
                                        };
                                        if px != cx || py != cy {
                                            //按下和释放的坐标不一样，进行拖拽合并
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
                                                match pre_event.duration {
                                                    Some(d) => {
                                                        if d <= mouse_op.max_interval_ms {
                                                            pre_event.event_type =
                                                                HookEventType::MouseClick;
                                                            new_event_list.push(pre_event);
                                                            continue_to_next = true;
                                                            continue;
                                                        }
                                                    }
                                                    None => {
                                                        pre_event.event_type =
                                                            HookEventType::MouseClick;
                                                        new_event_list.push(pre_event);
                                                        continue_to_next = true;
                                                        continue;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if let Some(key_op) = op.merge_key_options.clone() {
                                    if pre_event.event_type == HookEventType::KeyDown {
                                        //合并判断
                                        let merge = key_op.merge_press_release;
                                        let duration = cur_event.time - pre_event.time;
                                        if merge && duration <= key_op.press_release_max_interval_ms
                                        {
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
                    //不同类型、合并的目标类型、上面条件均不符合的情况不需要合并
                    new_event_list.push(pre_event);
                    if index == event_list.len() - 1 {
                        new_event_list.push(cur_event);
                    }
                }
                new_event_list
            }
            None => event_list,
        }
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
            let (x, y) = match event.pos {
                Some(pos) => (pos.x, pos.y),
                None => (0, 0),
            };
            let button = match event.button.clone() {
                Some(button) => {
                    if button == "left" {
                        "".to_string()
                    } else {
                        format!(", \"{}\"", button)
                    }
                }
                None => "".to_string(),
            };
            match event.event_type {
                HookEventType::MouseDrag => {
                    let target_pos = match event.target_pos {
                        Some(pos) => (pos.x, pos.y),
                        None => (0, 0),
                    };
                    let pos = match event.pos {
                        Some(pos) => (pos.x, pos.y),
                        None => (0, 0),
                    };
                    let duration = match event.duration {
                        Some(duration) => duration,
                        None => 0,
                    };
                    if self.generate_comment {
                        res.push(format!(
                            "//{}ms之内，从({},{})拖动到({},{})",
                            duration, pos.0, pos.1, target_pos.0, target_pos.1
                        ))
                    }
                    res.push(format!(
                        "await Mouse.drag({}, {}, {}, {}, {});",
                        pos.0, pos.1, target_pos.0, target_pos.1, duration
                    ))
                }
                HookEventType::MouseDown => {
                    if self.generate_comment {
                        let btn_name = if button.clone() == "right" {
                            "右"
                        } else if button.clone() == "middle" {
                            "中"
                        } else {
                            "左"
                        };
                        res.push(format!("//鼠标移动到({},{})后按下{}键", x, y, btn_name));
                    }
                    res.push(format!("await Mouse.down({}, {}{});", x, y, button));
                }
                HookEventType::MouseUp => {
                    let btn_name = if button.clone() == "right" {
                        "右"
                    } else if button.clone() == "middle" {
                        "中"
                    } else {
                        "左"
                    };
                    if self.generate_comment {
                        res.push(format!("//鼠标移动到({},{})后释放{}键", x, y, btn_name));
                    }
                    res.push(format!("await Mouse.up({}, {}{});", x, y, button))
                }
                HookEventType::MouseClick => {
                    let btn_name = if button.clone() == "right" {
                        "右"
                    } else if button.clone() == "middle" {
                        "中"
                    } else {
                        "左"
                    };
                    if self.generate_comment {
                        res.push(format!("//鼠标移动到({},{})后轻击{}键", x, y, btn_name));
                    }
                    res.push(format!("await Mouse.click({}, {}{});", x, y, button))
                }
                HookEventType::MouseWhell => {
                    let delta = match event.wheel_direction {
                        Some(direction) => match direction {
                            MouseWhellDirection::Up => -1,
                            MouseWhellDirection::Down => 1,
                        },
                        None => {
                            panic!("Invalid wheel direction");
                        }
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
                    let button = match event.button {
                        Some(button) => button,
                        None => {
                            panic!("Invalid button");
                        }
                    };
                    if self.generate_comment {
                        res.push(format!("//按下键盘按键: {}", button));
                    }
                    res.push(format!("await Input.keyDown(\"{}\");", button));
                }
                HookEventType::KeyUp => {
                    let button = match event.button {
                        Some(button) => button,
                        None => {
                            panic!("Invalid button");
                        }
                    };
                    if self.generate_comment {
                        res.push(format!("//释放键盘按键: {}", button));
                    }
                    res.push(format!("await Input.keyUp(\"{}\");", button))
                }
                HookEventType::KeyPress => {
                    let button = match event.button {
                        Some(button) => button,
                        None => {
                            panic!("Invalid button");
                        }
                    };
                    if self.generate_comment {
                        res.push(format!("//按下并释放键盘按键: {}", button));
                    }
                    res.push(format!("await Input.press(\"{}\");", button))
                }
            }
        }
        res
    }
    pub fn stop(&mut self) {
        unsafe {
            match self.keyboard_id {
                Some(keyboard_hook_id) => {
                    UnhookWindowsHookEx(keyboard_hook_id);
                    self.keyboard_id = None;
                    log::debug!("Keyboard hook uninstalled")
                }
                None => (),
            }
            match self.mouse_id {
                Some(mouse_hook_id) => {
                    UnhookWindowsHookEx(mouse_hook_id);
                    self.mouse_id = None;
                    log::debug!("Mouse hook uninstalled")
                }
                None => (),
            }
            STOP_CAPTURE_FLAG
                .clone()
                .store(false, std::sync::atomic::Ordering::SeqCst)
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
        };
        self.stop();
        self.translate_to_api()
    }
}
