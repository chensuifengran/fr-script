use std::{os::windows::process::CommandExt, process::Stdio};

use crate::types::generate_result;
use encoding_rs::GBK;
use winapi::um::winbase::CREATE_NO_WINDOW;

#[tauri::command]
pub async fn run_cmd(command: String) -> Result<String, ()> {
    let res = match std::process::Command::new("cmd")
        .args(&["/c", &command])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .stdin(Stdio::null())
        .creation_flags(CREATE_NO_WINDOW)
        .output()
    {
        Ok(res) => res,
        Err(e) => {
            log::error!("[command]run_cmd :执行命令失败：{:?} [{}]", e, command);
            return Ok(generate_result(e.to_string(), 500));
        }
    };
    let (stdout, _, _) = GBK.decode(&res.stdout);
    let (stderr, _, _) = GBK.decode(&res.stderr);

    if !res.status.success() {
        println!("执行命令失败：{}", stderr);
        return Ok(generate_result(stderr.to_string(), 501));
    }
    Ok(generate_result(stdout.to_string(), 200))
}
