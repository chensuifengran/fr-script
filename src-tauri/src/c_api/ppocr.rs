use libloading::Library;
use std::ffi::{c_char, CStr, CString};

use crate::global::{GPU_MEM, TEMP_DRIVE};
pub struct PPOCR {
    lib: Library,
}
/*
pub struct PPOCR {
    lib: Option<Library>,
}
impl Drop for PPOCR {
    fn drop(&mut self) {
        match &self.lib {
            Some(lib) => unsafe {
                lib.close();
            },
            None => {}
        }
    }
}

impl PPOCR {
    pub fn new() -> PPOCR {
        PPOCR {
            lib: unsafe { Some(Library::new("ppocr.dll").unwrap()) },
        }
    }

    /// 获取依赖版本
    ///
    /// 示例：
    ///
    /// ```
    /// let ppocr: Arc<PPOCR> = PPOCR_INSTANCE.clone();
    /// let res: String = ppocr.get_version().unwrap_or(format!("{}",ERROR_VERSION));
    /// ```
    ///
    /// 返回：
    ///
    /// {const char*} 版本号
    pub fn get_version(&self) -> Result<String, Box<dyn std::error::Error>> {
        match &self.lib {
            Some(lib) => unsafe {
                let get_version: libloading::Symbol<unsafe extern "C" fn() -> *const c_char> =
                    lib.get(b"getVersion").expect("dll中未发现getVersion方法");
                let result_c: *const c_char = (*get_version)();
                let c_str: &CStr = CStr::from_ptr(result_c);
                let str_slice: &str = c_str.to_str().expect("CStr类型转换失败");
                Ok(str_slice.to_owned())
            },
            None => Ok(format!("{}", ERROR_VERSION)),
        }
    }
}
*/
impl PPOCR {
    pub fn new() -> PPOCR {
        PPOCR {
            lib: unsafe { Library::new("ppocr.dll").expect("ppocr.dll加载失败！") },
        }
    }

    /// 获取依赖版本
    ///
    /// 示例：
    ///
    /// ```
    /// let ppocr: Arc<PPOCR> = PPOCR_INSTANCE.clone();
    /// let res: String = ppocr.get_version().unwrap_or(format!("{}",ERROR_VERSION));
    /// ```
    ///
    /// 返回：
    ///
    /// {const char*} 版本号
    pub fn get_version(&self) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let get_version: libloading::Symbol<unsafe extern "C" fn() -> *const c_char> = self
                .lib
                .get(b"getVersion")
                .expect("dll中未发现getVersion方法");
            let result_c: *const c_char = (*get_version)();
            let c_str: &CStr = CStr::from_ptr(result_c);
            let str_slice: &str = c_str.to_str().expect("CStr类型转换失败");
            Ok(str_slice.to_owned())
        }
    }

    ///初始化dll设置
    ///
    /// 示例：
    ///
    /// ```
    /// let ppocr: Arc<PPOCR> = PPOCR_INSTANCE.clone();
    /// let res: bool = ppocr.init();
    /// ```
    ///
    /// 参数：
    ///
    /// * `gpu_mem` - GPU内存占用，单位MB 0为使用CPU推理
    ///
    /// 返回：
    ///
    ///  {int} 0：初始化成功，-1：初始化失败
    pub fn init(&self, gpu_mem: i32) -> bool {
        unsafe {
            let init: libloading::Symbol<unsafe extern "C" fn(i32) -> i32> =
                self.lib.get(b"tryInit").expect("dll中未发现tryInit方法");
            let result: i32 = (*init)(gpu_mem);
            if result == 0 {
                false
            } else {
                true
            }
        }
    }

    /// 识别指定路径图片指定范围的文字信息
    ///
    /// 示例：
    ///
    /// ```
    /// let ppocr: Arc<PPOCR> = PPOCR_INSTANCE.clone();
    /// let res: String =
    ///     ppocr.ocr_rect("E:\\test.png", 0, 0, 100, 100)
    ///         .unwrap_or(format!("{}",ERROR_OCR_RESULT));
    /// ```
    ///
    /// 参数：
    ///
    /// * `path` - 图片路径
    /// * `x` - 截取起点x坐标
    /// * `y` - 截取起点y坐标
    /// * `width` - 截取宽度
    /// * `height` - 截取高度
    ///
    /// 返回：
    ///
    /// {const char*} 识别结果, JSON对象，
    /// 		包含code和result两个字段，
    /// code为识别状态1为成功，其它为失败，
    /// result为识别结果，
    /// 	成功时为对象数组，对象中包含识别到的文字及其位置信息，
    /// 	失败时为字符串，包含错误信息
    pub fn ocr_rect(
        &self,
        path: &str,
        x: i32,
        y: i32,
        width: i32,
        height: i32,
    ) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let ppocr: libloading::Symbol<
                unsafe extern "C" fn(*const c_char, i32, i32, i32, i32, i32) -> *const c_char,
            > = self.lib.get(b"ppocr").expect("dll中未发现ppocr方法");
            let path_c = CString::new(path).expect("CString类型转换失败");
            let result_c: *const c_char = (*ppocr)(path_c.as_ptr(), x, y, width, height, GPU_MEM);
            let c_str: &CStr = CStr::from_ptr(result_c);
            let str_slice: &str = c_str.to_str().expect("CStr类型转换失败");
            Ok(str_slice.to_owned())
        }
    }

    /// 整图识别
    ///
    /// 示例：
    ///
    /// ```
    /// let ppocr: Arc<PPOCR> = PPOCR_INSTANCE.clone();
    /// let res: String =
    ///     ppocr.ocr("E:\\test.png").unwrap_or(format!("{}",ERROR_OCR_RESULT));
    /// ```
    ///
    ///
    /// 参数：
    ///
    /// * `img_path` - 图片路径
    ///
    /// 返回：
    ///
    /// Result 类型，该类型可以是包含“String”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值解释：
    /// 返回一个JSON对象字符串，包含code和result两个字段，
    ///
    ///     code为识别状态1为成功，其它为失败，
    ///     result为识别结果，
    /// 	    成功时为对象数组，对象中包含识别到的文字及其位置信息，
    /// 	    失败时为字符串，包含错误信息
    pub fn ocr(&self, img_path: &str) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let ppocr: libloading::Symbol<
                unsafe extern "C" fn(*const c_char, i32) -> *const c_char,
            > = self.lib.get(b"imageProcess").expect("dll中未发现imageProcess方法");
            let img_path_c = CString::new(img_path).expect("CString类型转换失败");
            let result_c: *const c_char = (*ppocr)(img_path_c.as_ptr(), GPU_MEM);
            let c_str: &CStr = CStr::from_ptr(result_c);
            let str_slice: &str = c_str.to_str().expect("CStr类型转换失败");
            Ok(str_slice.to_owned())
        }
    }

    /// 识别屏幕指定范围的文字信息
    ///
    /// 示例：
    ///
    /// ```
    /// let ppocr: Arc<PPOCR> = PPOCR_INSTANCE.clone();
    /// let res: String =
    ///    ppocr.screen_ocr(0, 0, 100, 100, "D")
    ///       .unwrap_or(format!("{}",ERROR_OCR_RESULT));
    /// ```
    ///
    /// 参数：
    ///
    /// * `x` - 截取起点x坐标
    /// * `y` - 截取起点y坐标
    /// * `width` - 截取宽度
    /// * `height` - 截取高度
    ///
    /// 返回：
    ///
    /// {const char*} 识别结果, JSON对象，
    ///         包含code和result两个字段，
    /// code为识别状态1为成功，其它为失败，
    /// result为识别结果，
    ///    成功时为对象数组，对象中包含识别到的文字及其位置信息，
    ///   失败时为字符串，包含错误信息
    pub fn screen_ocr(
        &self,
        x: i32,
        y: i32,
        width: i32,
        height: i32,
    ) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let screen_ocr: libloading::Symbol<
                unsafe extern "C" fn(i32, i32, i32, i32, c_char, i32) -> *const c_char,
            > = self
                .lib
                .get(b"screenOcr")
                .expect("dll中未发现screenOcr方法");
            let c_temp_drive = *CStr::from_ptr(std::mem::transmute(&TEMP_DRIVE)).as_ptr();
            let result_c: *const c_char = (*screen_ocr)(x, y, width, height, c_temp_drive, GPU_MEM);
            let c_str: &CStr = CStr::from_ptr(result_c);
            let str_slice: &str = c_str.to_str().expect("CStr类型转换失败");
            Ok(str_slice.to_owned())
        }
    }

    /// 识别屏幕指定范围的文字（不含位置信息）
    ///
    /// 示例：
    ///
    /// ```
    /// let ppocr: Arc<PPOCR> = PPOCR_INSTANCE.clone();
    /// let res: String =
    ///   ppocr.screen_ocr_only_texts(0, 0, 100, 100, "D")
    ///    .unwrap_or(format!("{}",ERROR_OCR_RESULT));
    /// ```
    ///
    /// 参数：
    ///
    /// * `x` - 截取起点x坐标
    /// * `y` - 截取起点y坐标
    /// * `width` - 截取宽度
    /// * `height` - 截取高度
    ///
    /// 返回：
    ///
    /// {const char*} 识别结果, JSON对象，
    ///        包含code和result两个字段，
    /// code为识别状态1为成功，其它为失败，
    /// result为识别结果，
    ///     成功时为字符串数组，包含识别到的文字，
    ///     失败时为字符串，包含错误信息
    pub fn screen_ocr_only_texts(
        &self,
        x: i32,
        y: i32,
        width: i32,
        height: i32,
    ) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let screen_ocr_only_texts: libloading::Symbol<
                unsafe extern "C" fn(i32, i32, i32, i32, c_char, i32) -> *const c_char,
            > = self
                .lib
                .get(b"screenOcrOnlyTexts")
                .expect("dll中未发现screenOcrOnlyTexts方法");
            let c_temp_drive = *CStr::from_ptr(std::mem::transmute(&TEMP_DRIVE)).as_ptr();
            let result_c: *const c_char =
                (*screen_ocr_only_texts)(x, y, width, height, c_temp_drive, GPU_MEM);
            let c_str: &CStr = CStr::from_ptr(result_c);
            let str_slice: &str = c_str.to_str().expect("CStr类型转换失败");
            Ok(str_slice.to_owned())
        }
    }

    /// 识别屏幕指定位置是否存在指定文字
    ///
    /// 示例：
    ///
    /// ```
    /// let ppocr: Arc<PPOCR> = PPOCR_INSTANCE.clone();
    /// let res: i32 =
    ///  ppocr.screen_ocr_find_texts(0, 0, 100, 100, "文字1|文字2", "D")
    ///  .unwrap_or(-1);
    /// ```
    ///
    /// 参数：
    ///
    /// * `x` - 截取起点x坐标
    /// * `y` - 截取起点y坐标
    /// * `width` - 截取宽度
    /// * `height` - 截取高度
    /// * `includes_texts` - 需要识别的文字，多个文字用英文竖线(|)隔开
    ///
    /// 返回：
    ///
    /// {int} 0：不包含指定文字，1：包含指定文字，-1：识别出错, -2: 图片读取失败
    pub fn screen_ocr_find_texts(
        &self,
        x: i32,
        y: i32,
        width: i32,
        height: i32,
        includes_texts: &str,
    ) -> Result<i32, Box<dyn std::error::Error>> {
        unsafe {
            let screen_ocr_find_texts: libloading::Symbol<
                unsafe extern "C" fn(i32, i32, i32, i32, *const c_char, c_char, i32) -> i32,
            > = self
                .lib
                .get(b"screenOcrFindTexts")
                .expect("dll中未发现screenOcrFindTexts方法");
            let includes_texts_c = CString::new(includes_texts).expect("CString类型转换失败");
            let c_temp_drive = *CStr::from_ptr(std::mem::transmute(&TEMP_DRIVE)).as_ptr();
            let result: i32 = (*screen_ocr_find_texts)(
                x,
                y,
                width,
                height,
                includes_texts_c.as_ptr(),
                c_temp_drive,
                GPU_MEM,
            );
            Ok(result)
        }
    }
}
