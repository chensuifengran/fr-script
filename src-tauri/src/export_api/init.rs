use crate::{global::GPU_MEM, PPOCR_INSTANCE};
///初始化DLL设置
///
/// 参数
///
/// * `gpu_mem` - GPU内存占用，单位MB 默认1000 0表示不使用GPU
///
/// 返回
///
/// {bool} 初始化是否成功
#[tauri::command]
pub async fn init(gpu_mem: Option<i32>) -> Result<bool, ()> {
    let ppocr = PPOCR_INSTANCE.clone();
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
    Ok(res)
}
