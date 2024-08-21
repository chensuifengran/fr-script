use libloading::Library;
use std::ffi::{c_char, CStr, CString};
use std::sync::Arc;

pub struct Util {
    lib: Arc<Library>,
}

impl Util {
    pub fn new() -> Util {
        Util {
            lib: Arc::new(unsafe {
                match Library::new("screenOperation.dll") {
                    Ok(lib) => lib,
                    Err(e) => {
                        log::error!("[FFI][Util::new()]: 加载dll失败: {:?}", e);
                        panic!("{:?}", e);
                    }
                }
            }),
        }
    }

    /// 获取依赖版本
    ///
    /// 示例：
    ///
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String = util.get_version().unwrap_or(format!("{}",ERROR_VERSION));
    /// ```
    ///
    /// 返回：
    ///
    /// {const char*} 版本号
    pub fn get_version(&self) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let version: libloading::Symbol<unsafe extern "C" fn() -> *const c_char> =
                match self.lib.get(b"getVersion") {
                    Ok(func) => func,
                    Err(e) => {
                        log::error!("[FFI][Util::get_version()]dll中未发现getVersion方法");
                        return Err(Box::new(e));
                    }
                };
            let result_c: *const c_char = (*version)();
            let c_str: &CStr = CStr::from_ptr(result_c);
            let str_slice: &str = match c_str.to_str() {
                Ok(s) => s,
                Err(e) => {
                    log::error!("[FFI][Util::get_version()][result]CStr类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok(str_slice.to_owned())
        }
    }

    /// 捕获屏幕截图
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: i32 =
    ///     util.screenshot("E:\\test.png", 0, 0, 100, 100).unwrap_or(-1);
    /// ```
    ///
    /// 参数:
    ///
    /// * `path`: `path` 参数是一个字符串，表示保存屏幕截图的文件路径。
    /// * `x`: “x”参数表示屏幕截图起点的 x 坐标。它决定了屏幕截图区域的最左边位置。
    /// * `y`: “y”参数表示屏幕截图起点的 y 坐标。它确定屏幕截图开始捕获屏幕的垂直位置。
    /// * `w`: “w”参数表示屏幕截图区域的宽度。
    /// * `h`: “h”参数表示屏幕截图区域的高度。
    /// * “x” “y” “w” “h”中的任何一个值为-1，表示全屏截图。
    ///
    /// 返回:
    ///
    /// Result 类型，该类型可以是包含“i32”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值解释：1为成功，0为截图输出写入失败，-1为内部异常
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
            > = match self.lib.get(b"screenshot") {
                Ok(f) => f,
                Err(e) => {
                    log::error!("[FFI][Util::screenshot()]dll中未发现screenshot方法");
                    return Err(Box::new(e));
                }
            };
            // 创建一个CString类型的C字符串
            let c_path: CString = match CString::new(path) {
                Ok(p) => p,
                Err(e) => {
                    log::error!("[FFI][Util::screenshot()]CString类型转换失败");
                    return Err(Box::new(e));
                }
            };
            // 调用dll中的函数，并传入c_char指针和其他参数
            Ok((*func)(c_path.as_ptr(), x, y, w, h))
        }
    }

    /// 函数“get_screen_size”获得屏幕的宽高。
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String =
    ///     util.get_screen_size().unwrap_or(format!("{}", ERROR_WIDTH_HEIGHT));
    /// ```
    ///
    /// 返回:
    ///
    /// Result 类型，该类型可以是包含“String”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值示例："{\"width\":1920,\"height\":1080}"
    pub fn get_screen_size(&self) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<unsafe extern "C" fn() -> *const c_char> =
                match self.lib.get(b"getScreenSize") {
                    Ok(f) => f,
                    Err(e) => {
                        log::error!("[FFI][Util::get_screen_size()]dll中未发现getScreenSize方法");
                        return Err(Box::new(e));
                    }
                };
            let c_str: *const c_char = (*func)();
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = match c_str.to_str() {
                Ok(s) => s,
                Err(e) => {
                    log::error!("[FFI][Util::get_screen_size()][result]CStr类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok(str_slice.to_owned())
        }
    }

    /// 获取屏幕缩放
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String =
    ///     util.get_screen_zoom().unwrap_or(-1.0);
    /// ```
    ///
    /// Returns:
    ///
    /// Result 类型，该类型可以是包含“f64”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值示例：1
    pub fn get_screen_zoom(&self) -> Result<f64, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<unsafe extern "C" fn() -> f64> =
                match self.lib.get(b"getScreenZoom") {
                    Ok(f) => f,
                    Err(e) => {
                        log::error!("[FFI][Util::get_screen_zoom()]dll中未发现getScreenZoom方法");
                        return Err(Box::new(e));
                    }
                };
            Ok((*func)())
        }
    }

    /// 图片裁剪
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String =
    ///     util.crop_picture("E:\\t1.png", 0, 0, 100, 100, "E:\\t1_crop.png").unwrap_or(-1);
    /// ```
    ///
    /// 参数:
    ///
    /// * `path`: `path` 裁剪的图片路径。
    /// * `x`: ‘x’参数表示截取起点x坐标。
    /// * `y`: “y”参数表示截取起点y坐标。
    /// * `width`: “width”参数表示从起点开始的截取宽度。
    /// * `height`: “height”参数表示从起点开始的截取高度。
    /// * `out_path`: `out_path` 参数表示截取后的图片输出路径。
    ///
    /// 返回:
    ///
    /// Result 类型，该类型可以是包含“i32”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值解释：1为成功，0为裁剪后图片输出写入失败，-1为内部异常
    pub fn crop_picture(
        &self,
        path: &str,
        x: i32,
        y: i32,
        w: i32,
        h: i32,
        out_path: &str,
    ) -> Result<i32, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<
                unsafe extern "C" fn(*const c_char, i32, i32, i32, i32, *const c_char) -> i32,
            > = match self.lib.get(b"cropPicture") {
                Ok(f) => f,
                Err(e) => {
                    log::error!("[FFI][Util::crop_picture()]dll中未发现cropPicture方法");
                    return Err(Box::new(e));
                }
            };
            let c_path: CString = match CString::new(path) {
                Ok(p) => p,
                Err(e) => {
                    log::error!("[FFI][Util::crop_picture()][path]CString类型转换失败");
                    return Err(Box::new(e));
                }
            };
            let c_out_path: CString = match CString::new(out_path) {
                Ok(p) => p,
                Err(e) => {
                    log::error!("[FFI][Util::crop_picture()][out_path]CString类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok((*func)(c_path.as_ptr(), x, y, w, h, c_out_path.as_ptr()))
        }
    }

    /// 获得当前屏幕所选矩形区域的矩形信息。
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String =
    ///     util.get_screen_rect_info()
    ///         .unwrap_or(format!("{}", ERROR_RECT_INFO));
    /// ```
    ///
    /// 返回:
    ///
    /// Result 类型，该类型可以是包含“String”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值示例："{\"startX\":0,\"startY\":0,\"width\":1920,\"height\":1080}"
    pub fn get_screen_rect_info(&self) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<unsafe extern "C" fn() -> *const c_char> =
                match self.lib.get(b"getScreenRectInfo") {
                    Ok(f) => f,
                    Err(e) => {
                        log::error!(
                            "[FFI][Util::get_screen_rect_info()]dll中未发现getScreenRectInfo方法"
                        );
                        return Err(Box::new(e));
                    }
                };
            let c_str: *const c_char = (*func)();
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = match c_str.to_str() {
                Ok(s) => s,
                Err(e) => {
                    log::error!("[FFI][Util::get_screen_rect_info()][result]CStr类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok(str_slice.to_owned())
        }
    }

    /// 获取在指定图片标注矩形的起始点以及宽高
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String =
    ///     util.get_img_rect_info("E:\\test.png")
    ///         .unwrap_or(format!("{}", ERROR_RECT_INFO));
    /// ```
    ///
    /// 参数:
    ///
    /// * `img_path`: `img_path` 参数表示图片路径。
    ///
    /// 返回:
    ///
    /// Result 类型，该类型可以是包含“String”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值示例："{\"startX\":0,\"startY\":0,\"width\":1920,\"height\":1080}"
    pub fn get_img_rect_info(&self, img_path: &str) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<unsafe extern "C" fn(*const c_char) -> *const c_char> =
                match self.lib.get(b"getImgRectInfo") {
                    Ok(f) => f,
                    Err(e) => {
                        log::error!(
                            "[FFI][Util::get_img_rect_info()]dll中未发现getImgRectInfo方法"
                        );
                        return Err(Box::new(e));
                    }
                };
            let c_img_path: CString = match CString::new(img_path) {
                Ok(p) => p,
                Err(e) => {
                    log::error!("[FFI][Util::get_img_rect_info()][img_path]CString类型转换失败");
                    return Err(Box::new(e));
                }
            };
            let c_str: *const c_char = (*func)(c_img_path.as_ptr());
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = match c_str.to_str() {
                Ok(s) => s,
                Err(e) => {
                    log::error!("[FFI][Util::get_img_rect_info()][result]CStr类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok(str_slice.to_owned())
        }
    }

    /// 图片模板匹配
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String =
    ///     util.match_template("E:\\test.png", "E:\\temp.png", 0.0, 1.0)
    ///         .unwrap_or(format!("{}", ERROR_COORDINATE));
    /// ```
    ///
    /// 参数:
    ///
    /// * `img_path`: `img_path` 参数表示原图路径。
    /// * `temp_path`: `temp_path` 参数表示模板图路径。
    /// * `exact_value`: “exact_value”它确定模板需要与图像匹配到何种程度才能被视为匹配。值越高，匹配需要越精确。<=0直接返回匹配结果，否则只返回大于等于精确值的匹配结果。
    /// * `scale`: “scale”参数是一个浮点数，表示模板图像与屏幕区域匹配的缩放比例。值越高，越精确但是速度越慢。
    ///
    /// 返回:
    ///
    /// Result 类型，该类型可以是包含“String”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值示例："{\"x\":100,\"y\":200}"
    pub fn match_template(
        &self,
        img_path: &str,
        temp_path: &str,
        exact_value: f64,
        scale: f64,
    ) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<
                unsafe extern "C" fn(*const c_char, *const c_char, f64, f64) -> *const c_char,
            > = match self.lib.get(b"openCVMatchTemplate") {
                Ok(f) => f,
                Err(e) => {
                    log::error!("[FFI][Util::match_template()]dll中未发现openCVMatchTemplate方法");
                    return Err(Box::new(e));
                }
            };
            let c_img_path: CString = match CString::new(img_path) {
                Ok(p) => p,
                Err(e) => {
                    log::error!("[FFI][Util::match_template()][img_path]CString类型转换失败");
                    return Err(Box::new(e));
                }
            };
            let c_temp_path: CString = match CString::new(temp_path) {
                Ok(p) => p,
                Err(e) => {
                    log::error!("[FFI][Util::match_template()][temp_path]CString类型转换失败");
                    return Err(Box::new(e));
                }
            };
            let c_str: *const c_char = (*func)(
                c_img_path.as_ptr(),
                c_temp_path.as_ptr(),
                exact_value,
                scale,
            );
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = match c_str.to_str() {
                Ok(s) => s,
                Err(e) => {
                    log::error!("[FFI][Util::match_template()][result]CStr类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok(str_slice.to_owned())
        }
    }

    /// 直方图比对检测相似度
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res:f64 =
    ///     util.get_similarity_value("E:\\a.png",-1,-1,-1,-1,"E:\\b.png")
    ///         .unwrap_or(0.0);
    /// ```
    ///
    /// 参数:
    ///
    /// * `path_a`: `path_a` 待对比图片路径。
    /// * `x`: 截取起点 x 坐标。
    /// * `y`: 截取起点 y 坐标。
    /// * `width`: 截取宽度。
    /// * `height`: 截取高度。
    /// * `path_b`: `path_b` 待对比图片路径。
    ///
    /// “x”、“y”、“width”、“height” 任意值为-1表示path_a原图与path_b进行对比
    ///
    /// 返回:
    ///
    /// Result 类型，该类型可以是包含“f64”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值示例：0.9
    pub fn get_similarity_value(
        &self,
        path_a: &str,
        x: i32,
        y: i32,
        width: i32,
        height: i32,
        path_b: &str,
    ) -> Result<f64, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<
                unsafe extern "C" fn(*const c_char, i32, i32, i32, i32, *const c_char) -> f64,
            > = match self.lib.get(b"getSimilarityValue") {
                Ok(f) => f,
                Err(e) => {
                    log::error!(
                        "[FFI][Util::get_similarity_value()]dll中未发现getSimilarityValue方法"
                    );
                    return Err(Box::new(e));
                }
            };
            let c_path_a: CString = match CString::new(path_a) {
                Ok(p) => p,
                Err(e) => {
                    log::error!("[FFI][Util::get_similarity_value()][path_a]CString类型转换失败");
                    return Err(Box::new(e));
                }
            };
            let c_path_b: CString = match CString::new(path_b) {
                Ok(p) => p,
                Err(e) => {
                    log::error!("[FFI][Util::get_similarity_value()][path_b]CString类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok((*func)(
                c_path_a.as_ptr(),
                x,
                y,
                width,
                height,
                c_path_b.as_ptr(),
            ))
        }
    }

    /// 获取图片宽高
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String =
    ///    util.get_image_size("E:\\test.png").unwrap_or(format!("{}", ERROR_WIDTH_HEIGHT));
    /// ```
    ///
    /// 参数:
    ///
    /// * `img_path`: 图片路径。
    ///
    /// 返回:
    ///
    /// Result 类型，该类型可以是包含“String”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值示例："{\"width\":1920,\"height\":1080}"
    pub fn get_image_size(&self, img_path: &str) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<unsafe extern "C" fn(*const c_char) -> *const c_char> =
                match self.lib.get(b"getImageSize") {
                    Ok(f) => f,
                    Err(e) => {
                        log::error!("[FFI][Util::get_image_size()]dll中未发现getImageSize方法");
                        return Err(Box::new(e));
                    }
                };
            let c_img_path: CString = match CString::new(img_path) {
                Ok(p) => p,
                Err(e) => {
                    log::error!("[FFI][Util::get_image_size()][img_path]CString类型转换失败");
                    return Err(Box::new(e));
                }
            };
            let c_str: *const c_char = (*func)(c_img_path.as_ptr());
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = match c_str.to_str() {
                Ok(s) => s,
                Err(e) => {
                    log::error!("[FFI][Util::get_image_size()][result]CStr类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok(str_slice.to_owned())
        }
    }

    /// 捕获屏幕截图并与模板图像进行匹配
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String =
    ///   util.screen_match_template(0, 0, 100, 100, "E:\\temp.png", 0.0, 1.0)
    ///     .unwrap_or(format!("{}", ERROR_COORDINATE));
    /// ```
    ///
    /// 参数:
    ///
    /// * `x`: 截图起点x坐标。
    /// * `y`: 截图起点y坐标。
    /// * `width`: 截图宽度。
    /// * `height`: 截图高度。
    /// * `temp_path`: 模板图片路径。
    /// * `exact_value`: 确定模板图像需要与屏幕区域匹配的紧密程度才能被视为匹配。值越高，匹配需要越精确。<=0直接返回匹配结果，否则只返回大于等于精确值的匹配结果
    /// * `scale`: 缩放倍数，0为默认缩放倍数。有效值：0~1的浮点数。
    /// “x”、“y”、“width”、“height” 任意值为-1表示全屏截图进行匹配（不推荐）。
    ///
    /// 返回:
    ///
    /// Result 类型，该类型可以是包含“String”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值示例："{\"x\":100,\"y\":200}"
    pub fn screen_match_template(
        &self,
        x: i32,
        y: i32,
        width: i32,
        height: i32,
        temp_path: &str,
        exact_value: f64,
        scale: f64,
    ) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<
                unsafe extern "C" fn(
                    i32,
                    i32,
                    i32,
                    i32,
                    *const c_char,
                    f64,
                    f64,
                ) -> *const c_char,
            > = match self.lib.get(b"screenMatchTemplate") {
                Ok(f) => f,
                Err(e) => {
                    log::error!(
                        "[FFI][Util::screen_match_template()]dll中未发现screenMatchTemplate方法"
                    );
                    return Err(Box::new(e));
                }
            };
            let c_temp_path: CString = match CString::new(temp_path) {
                Ok(p) => p,
                Err(e) => {
                    log::error!(
                        "[FFI][Util::screen_match_template()][temp_path]CString类型转换失败"
                    );
                    return Err(Box::new(e));
                }
            };
            let c_str: *const c_char = (*func)(
                x,
                y,
                width,
                height,
                c_temp_path.as_ptr(),
                exact_value,
                scale,
            );
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = match c_str.to_str() {
                Ok(s) => s,
                Err(e) => {
                    log::error!("[FFI][Util::screen_match_template()][result]CStr类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok(str_slice.to_owned())
        }
    }

    /// 捕获屏幕截图并与多模板图像匹配，进行差异比较
    ///
    /// 示例：
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String =
    ///  util.screen_diff_templates(
    ///     0, 0, 100, 100,
    ///     "E:\\a.png | E:\\b.png",
    ///     0
    ///  ).unwrap_or(format!("{}", ERROR_MSG_DATA));
    /// ```
    ///
    /// 参数:
    ///
    /// * `x`: 截图起点x坐标。
    /// * `y`: 截图起点y坐标。
    /// * `width`: 截图宽度。
    /// * `height`: 截图高度。
    /// * `temp_paths`: 模板图像的路径，多路径使用“|”分割。
    /// * `target_index`: 主模板索引，其余模板会携带与主模板的位置偏移量。
    ///
    /// 返回:
    ///
    /// 一个“Result”类型，其中“String”作为成功值，“Box<dyn std::error::Error>”作为错误值。
    ///
    /// 返回值类型描述：本方法返回一个对象(字符串)，每个对象包含：
    /// * `message` 字符串，是否成功匹配。
    ///
    /// * `data` 对象数组，每个对象的属性有：
    ///
    /// `x`、`y`、`width`、`height`、
    ///
    /// `centerX` 图像中心X坐标、
    ///
    /// `centerY` 图像中心Y坐标、
    ///
    /// `targetOffsetX` 中心坐标与主模板的中心坐标的X轴偏移量、
    ///
    /// `targetOffsetY` 中心坐标与主模板的中心坐标的Y轴偏移量
    pub fn screen_diff_templates(
        &self,
        x: i32,
        y: i32,
        width: i32,
        height: i32,
        temp_paths: &str,
        target_index: i32,
    ) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<
                unsafe extern "C" fn(
                    i32,
                    i32,
                    i32,
                    i32,
                    *const c_char,
                    i32,
                ) -> *const c_char,
            > = match self.lib.get(b"screenDiffTemplates") {
                Ok(f) => f,
                Err(e) => {
                    log::error!(
                        "[FFI][Util::screen_diff_templates()]dll中未发现screenDiffTemplates方法"
                    );
                    return Err(Box::new(e));
                }
            };
            let c_temp_paths: CString = match CString::new(temp_paths) {
                Ok(p) => p,
                Err(e) => {
                    log::error!(
                        "[FFI][Util::screen_diff_templates()][temp_paths]CString类型转换失败"
                    );
                    return Err(Box::new(e));
                }
            };
            let c_str: *const c_char = (*func)(
                x,
                y,
                width,
                height,
                c_temp_paths.as_ptr(),
                target_index,
            );
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = match c_str.to_str() {
                Ok(s) => s,
                Err(e) => {
                    log::error!("[FFI][Util::screen_diff_templates()][result]CStr类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok(str_slice.to_owned())
        }
    }

    /// 获取屏幕颜色
    ///
    /// 示例：
    ///
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String = util.get_screen_color(0,0).unwrap_or(format!("{}", ERROR_COLOR));
    /// ```
    ///
    /// 参数：
    ///
    /// * `x`：x坐标
    /// * `y`：y坐标
    ///
    /// 返回：
    ///
    /// Result 类型，该类型可以是包含“String”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值示例："{\"message\":\"success\",\"data\":\[0,0,0\]}"
    pub fn get_screen_color(&self, x: i32, y: i32) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<unsafe extern "C" fn(i32, i32) -> *const c_char> =
                match self.lib.get(b"getScreenColor") {
                    Ok(f) => f,
                    Err(e) => {
                        log::error!("[FFI][Util::get_screen_color()]dll中未发现getScreenColor方法");
                        return Err(Box::new(e));
                    }
                };
            let c_str: *const c_char = (*func)(x, y);
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = match c_str.to_str() {
                Ok(s) => s,
                Err(e) => {
                    log::error!("[FFI][Util::get_screen_color()][result]CStr类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok(str_slice.to_owned())
        }
    }

    /// 获取图片指定位置颜色
    ///
    /// 示例：
    ///
    /// ```
    /// let util: Arc<Util> = UTIL_INSTANCE.clone();
    /// let res: String = util.get_image_color(0,0,"E:\\test.png").unwrap_or(format!("{}", ERROR_COLOR));
    /// ```
    ///
    /// 参数：
    ///
    /// * `x`：x坐标
    /// * `y`：y坐标
    /// * `path`：图片路径
    ///
    /// 返回：
    ///
    /// Result 类型，该类型可以是包含“String”值的“Ok”变体，也可以是包含“Box<dyn std::error::Error>”值的“Err”变体。
    ///
    /// 返回值示例："{\"message\":\"success\",\"data\":\[0,0,0\]}"
    pub fn get_image_color(
        &self,
        x: i32,
        y: i32,
        path: &str,
    ) -> Result<String, Box<dyn std::error::Error>> {
        unsafe {
            let func: libloading::Symbol<
                unsafe extern "C" fn(*const c_char, i32, i32) -> *const c_char,
            > = match self.lib.get(b"getImageColor"){
                Ok(f) => f,
                Err(e) => {
                    log::error!("[FFI][Util::get_image_color()]dll中未发现getImageColor方法");
                    return Err(Box::new(e));
                }
            };
            let c_path: CString = match CString::new(path){
                Ok(p) => p,
                Err(e) => {
                    log::error!("[FFI][Util::get_image_color()][path]CString类型转换失败");
                    return Err(Box::new(e));
                }
            };
            let c_str: *const c_char = (*func)(c_path.as_ptr(), x, y);
            let c_str: &CStr = CStr::from_ptr(c_str);
            let str_slice: &str = match c_str.to_str(){
                Ok(s) => s,
                Err(e) => {
                    log::error!("[FFI][Util::get_image_color()][result]CStr类型转换失败");
                    return Err(Box::new(e));
                }
            };
            Ok(str_slice.to_owned())
        }
    }
}
