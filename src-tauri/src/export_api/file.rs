use std::fs;

use crate::types::generate_result;

/// 获取当前可执行文件的安装目录。
///
/// Returns:
///
/// 当前可执行文件的安装目录。
#[tauri::command]
pub fn get_install_dir() -> String {
    let exe_path = std::env::current_exe().unwrap();
    let install_dir = exe_path.parent().unwrap();
    install_dir.to_str().unwrap().to_string()
}

/// 获取文件的基本信息
///
/// 参数:
///
/// * `file_path`: 文件路径。
///
/// Returns:
///
/// 一个“Result”类型，其中“String”作为成功值，“()”作为错误值。
#[tauri::command]
pub async fn get_file_info(file_path: &str) -> Result<String, ()> {
    let metadata = std::fs::metadata(file_path);
    match metadata {
        Ok(meta) => {
            let file_type = meta.file_type();
            let file_size = meta.len();
            let file_name = std::path::Path::new(file_path)
                .file_name()
                .unwrap()
                .to_str()
                .unwrap();
            let file_info = format!(
                "{{\"fileName\":\"{}\",\"fileSize\":{},\"fileType\":\"{}\"}}",
                file_name,
                file_size,
                if file_type.is_dir() { "dir" } else { "file" }
            );
            Ok(generate_result(file_info, 200))
        }
        Err(err) => Ok(generate_result(err.to_string(), 500)),
    }
}

#[tauri::command]
pub async fn copy_dep_file(
    source_path: String,
    target_path: String,
    del_origin_file: bool,
    overwrite: bool,
) -> Result<String, ()> {
    //将文件复制到指定目录，如果目录不存在则创建
    let target_path = std::path::Path::new(&target_path);
    if !target_path.exists() {
        fs::create_dir_all(target_path).unwrap();
    }
    let target_path = target_path.join(std::path::Path::new(&source_path).file_name().unwrap());
    if target_path.exists() && !overwrite {
        return Ok(generate_result(
            "目标文件已存在，不允许覆盖".to_string(),
            500,
        ));
    }
    let res = fs::copy(&source_path, &target_path);
    match res {
        Ok(_) => {
            if del_origin_file {
                fs::remove_file(&source_path).unwrap();
            }
            Ok(generate_result("文件复制成功".to_string(), 200))
        }
        Err(err) => Ok(generate_result(err.to_string(), 501)),
    }
}

#[tauri::command]
pub async fn decompress_dep_file(
    path: String,
    target_path: String,
    del_origin_file: bool,
) -> Result<String, ()> {
    let target_path = std::path::Path::new(&target_path);
    if !target_path.exists() {
        fs::create_dir_all(target_path).unwrap();
    }
    let res = sevenz_rust::decompress_file(&path, &target_path);
    match res {
        Ok(_) => {
            if del_origin_file {
                fs::remove_file(&path).unwrap();
            }
            Ok(generate_result("文件解压成功".to_string(), 200))
        }
        Err(err) => {
            println!("文件解压失败：{}", err);
            Ok(generate_result(err.to_string(), 501))
        }
    }
}

#[tauri::command]
pub async fn open_file_explorer(path: String) -> Result<(), String> {
    let path = path.replace("/", "\\");
    if let Err(e) = std::process::Command::new("explorer.exe").arg(path).spawn() {
        return Err(format!("Failed to open file explorer: {}", e));
    }
    Ok(())
}

#[tauri::command]
pub async fn read_file(path: String) -> Result<String, String> {
    let path = path.replace("/", "\\");
    let content = match fs::read_to_string(path) {
        Ok(content) => content,
        Err(err) => return Err(err.to_string()),
    };
    Ok(content)
}

#[tauri::command]
pub async fn write_file(path: String, content: String) -> Result<String, String> {
    let path = path.replace("/", "\\");
    match fs::write(path, content) {
        Ok(_) => Ok("文件写入成功".to_string()),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
pub async fn read_dir(path: String) -> Result<String, String> {
    let path = path.replace("/", "\\");
    let dir = match fs::read_dir(path) {
        Ok(dir) => dir,
        Err(err) => return Err(err.to_string()),
    };
    let mut file_list = Vec::new();
    for entry in dir {
        let entry = entry.unwrap();
        let file_type = entry.file_type().unwrap();
        let file_name = entry.file_name();
        let file_info = format!(
            "{{\"fileName\":\"{}\",\"fileType\":\"{}\"}}",
            file_name.to_str().unwrap(),
            if file_type.is_dir() { "dir" } else { "file" }
        );
        file_list.push(file_info);
    }
    Ok(format!("[{}]", file_list.join(",")))
}