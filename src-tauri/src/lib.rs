use std::sync::Arc;
use crate::c_api::{util::Util, ppocr::PPOCR};
pub mod export_api;
pub mod types;
pub mod c_api;
pub mod global;
# [macro_use] extern crate lazy_static;
lazy_static! {
    pub static ref UTIL_INSTANCE: Arc<Util> = Arc::new(Util::new());
    pub static ref PPOCR_INSTANCE: Arc<PPOCR> = Arc::new(PPOCR::new());
}