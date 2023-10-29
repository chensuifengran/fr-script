use std::ffi::{CString, c_char};

use libloading::Library;

pub struct Util {
    lib: Library,
}

impl Util {
    pub fn new() -> Util {
        Util {
            lib: unsafe { Library::new("screenOperation.dll").unwrap() },
        }
    }

    /**
    *
    屏幕截图
    @param char* 截图保存路径
    @param int 截图起始x坐标
    @param int 截图起始y坐标
    @param int 截图宽度
    @param int 截图高度
    __declspec(dllexport) int screenshot(char* path, int x, int y, int w, int h);
    */
    pub fn screenshot(
        &self,
        path: &str,
        x: i32,
        y: i32,
        w: i32,
        h: i32,
    ) -> Result<i32, Box<dyn std::error::Error>> {
        unsafe {
            // 获取dll中的函数指针
            let func: libloading::Symbol<
                unsafe extern "C" fn(*const c_char, i32, i32, i32, i32) -> i32,
            > = self.lib.get(b"screenshot")?;
            // 创建一个CString类型的C字符串
            let c_path: CString = CString::new(path).unwrap();
            // 调用dll中的函数，并传入c_char指针和其他参数
            Ok((*func)(c_path.as_ptr(), x, y, w, h))
        }
    }
}
