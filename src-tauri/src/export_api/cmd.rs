use crate::types::generate_result;
use encoding_rs::GBK;

#[tauri::command]
pub async fn run_cmd(command: String) -> Result<String, ()> {
    let res = std::process::Command::new("cmd")
        .args(&["/c", &command])
        .output()
        .expect("failed to execute process");
    let (stdout, _, _) = GBK.decode(&res.stdout);
    let (stderr, _, _) = GBK.decode(&res.stderr);

    if !res.status.success() {
        println!("执行命令失败：{}", stderr);
        return Ok(generate_result(stderr.to_string(), 501));
    }
    Ok(generate_result(stdout.to_string(), 200))
}