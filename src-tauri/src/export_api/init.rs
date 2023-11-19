use crate::{
    c_api::ppocr::PPOCR,
    global::{GPU_MEM, TEMP_DRIVE},
};

use super::tools::{auto_select_drive, test_drive};

///初始化DLL设置
///
/// 参数
///
/// * `use_gpu` - 是否使用GPU 默认使用
/// * `gpu_mem` - GPU内存占用，单位MB 默认1000
///
/// 返回
///
/// {bool} 初始化是否成功
#[tauri::command]
pub async fn init(gpu_mem: Option<i32>, temp_drive: Option<&str>) -> Result<bool, ()> {
    let ppocr: PPOCR = PPOCR::new();
    let gpu_mem: i32 = match gpu_mem {
        Some(gpu_mem) => gpu_mem,
        None => 1000,
    };
    let res = ppocr.init(gpu_mem);
    if res {
        unsafe {
            GPU_MEM = gpu_mem;
        }
    }
    let temp_drive = match temp_drive {
        Some(d) => d.chars().next().unwrap_or('D'),
        None => auto_select_drive().unwrap_or('D'),
    };
    println!("gpu_mem:{}, drive:{}",gpu_mem, temp_drive);
    if res && test_drive(&temp_drive) {
        unsafe {
            TEMP_DRIVE = temp_drive;
        }
        Ok(res)
    } else {
        println!("初始化失败，临时文件存储盘符{}不可用", temp_drive);
        Err(())
    }
}
