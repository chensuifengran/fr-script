use crate::types::{fs_types::MoveResult, generate_result};
use futures::future::BoxFuture;
use std::fs;
use std::path::Path;

/// 获取当前可执行文件的安装目录。
///
/// Returns:
///
/// 当前可执行文件的安装目录。
#[tauri::command]
pub fn get_install_dir() -> String {
    let exe_path = match std::env::current_exe() {
        Ok(path) => path,
        Err(e) => {
            log::error!(
                "[command]get_install_dir :无法获得本程序可执行文件路径: {}",
                e
            );
            return String::new();
        }
    };

    let install_dir = match exe_path.parent() {
        Some(dir) => dir,
        None => {
            log::error!("[command]get_install_dir :无法获得本程序所在目录");
            return String::new();
        }
    };

    let install_dir_str = match install_dir.to_str() {
        Some(s) => s,
        None => {
            log::error!("[command]get_install_dir :无法转换本程序所在目录为字符串");
            return String::new();
        }
    };
    install_dir_str.to_string()
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
    let exists = std::path::Path::new(&path).exists();
    if !exists {
        return Err("文件不存在".to_string());
    }
    let content = match fs::read_to_string(path) {
        Ok(content) => content,
        Err(err) => return Err(err.to_string()),
    };
    Ok(content)
}

#[tauri::command]
pub async fn write_file(path: String, content: String) -> Result<String, String> {
    let path = path.replace("/", "\\");
    //判断文件所在目录是否存在，不存在则创建
    let parent_dir = std::path::Path::new(&path).parent().unwrap();
    if !parent_dir.exists() {
        fs::create_dir_all(parent_dir).unwrap();
    }
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

#[tauri::command]
pub async fn delete_file(path: String) -> Result<String, String> {
    let path = path.replace("/", "\\");
    match fs::remove_file(path) {
        Ok(_) => Ok("文件删除成功".to_string()),
        Err(err) => Err(err.to_string()),
    }
}
#[tauri::command]
pub async fn delete_dir(path: String, force: bool) -> Result<String, String> {
    let path = path.replace("/", "\\");
    if force {
        match fs::remove_dir_all(path) {
            Ok(_) => Ok("文件夹删除成功".to_string()),
            Err(err) => Err(err.to_string()),
        }
    } else {
        match fs::remove_dir(path) {
            Ok(_) => Ok("文件夹删除成功".to_string()),
            Err(err) => Err(err.to_string()),
        }
    }
}

// 将一个文件夹下的所有文件(夹)移动到另一个文件夹
#[tauri::command]
pub async fn move_child_to_new_dir(
    source_dir: String,
    target_dir: String,
    overwrite: bool,
    remove_source_dir: bool,
) -> Result<String, ()> {
    let res =
        move_child_to_new_dir_inner(source_dir, target_dir, overwrite, remove_source_dir).await;
    match res {
        Ok(fail_res) => {
            if fail_res.is_empty() {
                return Ok(generate_result("移动文件成功".to_string(), 200));
            }
            Ok(generate_result(fail_res, 500))
        }
        Err(_) => Ok(generate_result("移动文件失败".to_string(), 501)),
    }
}

fn move_child_to_new_dir_inner(
    source_dir: String,
    target_dir: String,
    overwrite: bool,
    remove_source_dir: bool,
) -> BoxFuture<'static, Result<Vec<MoveResult>, ()>> {
    Box::pin(async move {
        let mut fail_res: Vec<MoveResult> = vec![];
        let source_dir = source_dir.replace("/", "\\");
        let target_dir = target_dir.replace("/", "\\");
        let source_dir = Path::new(&source_dir);
        let target_dir = Path::new(&target_dir);
        if !source_dir.exists() {
            fail_res.push(MoveResult::new(
                source_dir.to_str().unwrap().to_string(),
                target_dir.to_str().unwrap().to_string(),
                overwrite,
                false,
                "源文件夹不存在".to_string(),
            ));
            return Ok(fail_res.clone());
        }
        if !target_dir.exists() {
            fs::create_dir_all(target_dir).unwrap();
        }
        let dir = match fs::read_dir(source_dir) {
            Ok(dir) => dir,
            Err(err) => {
                fail_res.push(MoveResult::new(
                    source_dir.to_str().unwrap().to_string(),
                    target_dir.to_str().unwrap().to_string(),
                    overwrite,
                    false,
                    err.to_string(),
                ));
                return Ok(fail_res.clone());
            }
        };
        for entry in dir {
            let entry = entry.unwrap();
            let file_type = entry.file_type().unwrap();
            let file_name = entry.file_name();
            let target_path = target_dir.join(&file_name);
            if target_path.exists() && !overwrite {
                fail_res.push(MoveResult::new(
                    entry.path().to_str().unwrap().to_string(),
                    target_path.to_str().unwrap().to_string(),
                    overwrite,
                    false,
                    "目标文件已存在，不允许覆盖".to_string(),
                ));
                continue;
            }
            if file_type.is_dir() {
                let child_source_dir = entry.path().to_str().unwrap().to_string();
                let child_target_dir = target_dir
                    .join(file_name.clone())
                    .to_str()
                    .unwrap()
                    .to_string();
                let child_res = move_child_to_new_dir_inner(
                    child_source_dir,
                    child_target_dir,
                    overwrite,
                    remove_source_dir,
                )
                .await;
                match child_res.clone() {
                    Ok(res) => {
                        if !res.is_empty() {
                            fail_res.extend(res);
                        } else {
                            let exists = match fs::metadata(entry.path()) {
                                Ok(meta) => meta.is_dir(),
                                Err(_) => false,
                            };
                            if remove_source_dir && exists {
                                fs::remove_dir(entry.path()).unwrap_or(());
                            }
                        }
                    }
                    Err(_) => {
                        fail_res.push(MoveResult::new(
                            entry.path().to_str().unwrap().to_string(),
                            target_path.to_str().unwrap().to_string(),
                            overwrite,
                            false,
                            "移动文件夹失败".to_string(),
                        ));
                    }
                }
            } else {
                let res = fs::copy(entry.path(), target_path.clone());
                match res {
                    Ok(_) => {
                        fs::remove_file(entry.path()).unwrap();
                    }
                    Err(err) => {
                        fail_res.push(MoveResult::new(
                            entry.path().to_str().unwrap().to_string(),
                            target_path.to_str().unwrap().to_string(),
                            overwrite,
                            false,
                            err.to_string(),
                        ));
                    }
                }
            }
        }
        let exists = match fs::metadata(source_dir) {
            Ok(meta) => meta.is_dir(),
            Err(_) => false,
        };
        if fail_res.is_empty() && remove_source_dir && exists {
            fs::remove_dir(source_dir).unwrap_or(());
        }
        Ok(fail_res)
    })
}
