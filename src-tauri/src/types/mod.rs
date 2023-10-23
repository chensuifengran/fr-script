use serde::Serialize;

use self::mouse_types::MouseResult;

pub mod mouse_types;

pub fn generate_result<T: Serialize>(msg: T, code: u32) -> String {
    let mouse_result: MouseResult<T> = MouseResult::new(code, msg);
    serde_json::to_string(&mouse_result).unwrap()
}