use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct MoveResult {
    pub source_dir: String,
    pub target_dir: String,
    pub overwrite: bool,
    pub result: bool,
    pub resaon: String,
}
impl MoveResult {
    pub fn new(
        source_dir: String,
        target_dir: String,
        overwrite: bool,
        result: bool,
        resaon: String,
    ) -> Self {
        MoveResult {
            source_dir,
            target_dir,
            overwrite,
            result,
            resaon,
        }
    }
}
