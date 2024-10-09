use crate::{
    export_api::mouse::Clicker,
    libs::{ppocr::PPOCR, util::Util},
};
use std::sync::Arc;
pub mod constant;
pub mod event;
pub mod export_api;
pub mod global;
pub mod libs;
pub mod types;
use std::sync::Mutex;
#[macro_use]
extern crate lazy_static;
lazy_static! {
    pub static ref UTIL_INSTANCE: Arc<Util> = Arc::new(Util::new());
    pub static ref PPOCR_INSTANCE: Arc<PPOCR> = Arc::new(PPOCR::new());
    pub static ref CLICKER: Mutex<Clicker> = Mutex::new(Clicker::new());
}
