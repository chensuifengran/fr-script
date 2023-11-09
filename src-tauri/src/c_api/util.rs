use std::ffi::{c_char, CStr, CString};

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
    屏幕截图
    @param char* 截图保存路径
    @param int 截图起始x坐标
    @param int 截图起始y坐标
    @param int 截图宽度
    @param int 截图高度
    @return {int} 1为成功，0为截图输出写入失败，-1为内部异常
    __declspec(dllexport) int screenshot(char* path, int x, int y, int w, int h);
    */
    /// “screenshot”函数接收文件路径、起始坐标、宽度和高度，并捕获屏幕上指定区域的屏幕截图。
    ///
    /// Arguments:
    ///
    /// * `path`: 屏幕截图的保存路径。
    /// * `x`: 屏幕截图起点的 x 坐标。
    /// * `y`: 参数“y”表示屏幕截图的起始 y 坐标。它确定屏幕截图开始捕获屏幕的垂直位置。
    /// * `w`: 参数“w”表示屏幕截图的宽度。它指定将在屏幕截图中捕获的水平像素数。
    /// * `h`: 参数“h”表示要截取的屏幕截图的高度。它指定屏幕截图从顶部到底部的像素数。
    ///
    /// Returns:
    ///
    /// 函数“screenshot”返回“Result”类型，该类型可以是包含“i32”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
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

    /**
     * 获得屏幕宽高，返回JSON字符串
     * _declspec(dllexport) const char* getScreenSize();
     */
    /// 函数“get_screen_size”获得屏幕的宽高。
    ///
    /// Returns:
    ///
    /// 一个“Result”类型，其中“String”作为成功值，“Box<dyn std::error::Error>”作为错误值。
    pub fn get_screen_size(&self) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<unsafe extern "C" fn() -> *const c_char> =
                self.lib.get(b"getScreenSize")?;
            let c_str: *const c_char = (*func)();
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = c_str.to_str()?;
            Ok(str_slice.to_owned())
        }
    }
    /**
	* 获取屏幕缩放
	* @return {double} 返回屏幕缩放值
    * __declspec(dllexport) double getScreenZoom();
	*/
    pub fn get_screen_zoom(&self) -> Result<f64, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<unsafe extern "C" fn() -> f64> =
                self.lib.get(b"getScreenZoom")?;
            Ok((*func)())
        }
    }
	

    /**
     * 图片裁剪
     * @param char* 截图保存路径
     * @param int 起始x坐标
     * @param int 起始y坐标
     * @param int 宽度
     * @param int 高度
     * @param char* 输出路径
     * @return {int} 1为成功，0为裁剪后图片输出写入失败，-1为内部异常
     * __declspec(dllexport) int cropPicture(const char* path, int x, int y, int w, int h,const char* outPath);
     */
    pub fn crop_picture(
        &self,
        path: &str,
        x: i32,
        y: i32,
        w: i32,
        h: i32,
    ) -> Result<i32, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<
                unsafe extern "C" fn(*const c_char, i32, i32, i32, i32, *const c_char) -> i32,
            > = self.lib.get(b"cropPicture")?;
            let c_path: CString = CString::new(path).unwrap();
            let c_out_path: CString = CString::new("").unwrap();
            Ok((*func)(c_path.as_ptr(), x, y, w, h, c_out_path.as_ptr()))
        }
    }

    /**
	* 获取当前桌面截图标注矩形的起始点以及宽高
	* @return {char*} 返回图片宽高，格式为json字符串。
    * __declspec(dllexport) const char* getScreenRectInfo();
	*/
    pub fn get_screen_rect_info(&self) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<unsafe extern "C" fn() -> *const c_char> =
                self.lib.get(b"getScreenRectInfo")?;
            let c_str: *const c_char = (*func)();
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = c_str.to_str()?;
            Ok(str_slice.to_owned())
        }
    }	


}
