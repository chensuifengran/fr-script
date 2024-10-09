use log::error;
use serde::Serialize;

use self::mouse_types::MouseResult;

pub mod fs_types;
pub mod hook_types;
pub mod mouse_types;

pub fn generate_result<T: Serialize>(msg: T, code: u32) -> String {
    let mouse_result: MouseResult<T> = MouseResult::new(code, msg);
    match serde_json::to_string(&mouse_result) {
        Ok(result) => result,
        Err(e) => {
            error!("generate_result :{:?}", e);
            String::from("")
        }
    }
}
