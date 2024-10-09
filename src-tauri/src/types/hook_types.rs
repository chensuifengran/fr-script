use serde::Deserialize;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum HookEventType {
    MouseDown,
    MouseUp,
    MouseClick,
    MouseDrag,
    MouseWhell,
    KeyDown,
    KeyUp,
    KeyPress,
}
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum MouseWhellDirection {
    Up,
    Down,
}

#[derive(Debug, Clone, Copy)]
pub struct POS {
    pub x: u32,
    pub y: u32,
}

#[derive(Debug, Clone)]
pub struct HookEvent {
    pub event_type: HookEventType,
    pub pos: Option<POS>,
    pub target_pos: Option<POS>,
    pub wheel_direction: Option<MouseWhellDirection>,
    pub button: Option<String>,
    pub time: u128,
    pub duration: Option<u128>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct MergeKeyOptions {
    //合并重复按键
    pub merge_repeat: bool,
    //需要合并的重复按键按下时间最大间隔，超过该值则不进行合并
    pub repeat_max_interval_ms: u128,
    //合并按键按下和释放
    pub merge_press_release: bool,
    //需要合并的按下释放间隔，超过该值则不进行合并
    pub press_release_max_interval_ms: u128,
}
impl Default for MergeKeyOptions {
    fn default() -> Self {
        MergeKeyOptions {
            merge_repeat: true,
            repeat_max_interval_ms: 50,
            merge_press_release: true,
            press_release_max_interval_ms: 200,
        }
    }
}
impl MergeKeyOptions {
    pub fn new() -> Self {
        MergeKeyOptions::default()
    }
}
#[derive(Debug, Clone, Deserialize)]
pub struct MergeMouseOptions {
    //合并鼠标按下和释放
    pub merge: bool,
    //需要合并的按下释放间隔，超过该值则不进行合并
    pub max_interval_ms: u128,
    //按下释放坐标不一样则进行拖拽合并
    pub merge_drag: bool,
}
impl Default for MergeMouseOptions {
    fn default() -> Self {
        MergeMouseOptions {
            merge: true,
            max_interval_ms: 300,
            merge_drag: true,
        }
    }
}
impl MergeMouseOptions {
    pub fn new() -> Self {
        MergeMouseOptions::default()
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct CaptureOptions {
    pub merge_key_options: Option<MergeKeyOptions>,
    pub merge_mouse_options: Option<MergeMouseOptions>,
}

impl Default for CaptureOptions {
    fn default() -> Self {
        CaptureOptions {
            merge_key_options: Some(MergeKeyOptions::default()),
            merge_mouse_options: Some(MergeMouseOptions::default()),
        }
    }
}
