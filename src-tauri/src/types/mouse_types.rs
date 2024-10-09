use serde::Serialize;

#[derive(Serialize)]
pub struct MouseResult<T: Serialize> {
    code: u32,
    message: T,
}
impl<T: Serialize> MouseResult<T> {
    pub fn new(code: u32, message: T) -> Self {
        Self { code, message }
    }
}

#[derive(Serialize)]
pub struct Coordinate {
    x: i32,
    y: i32,
}
impl Coordinate {
    pub fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }
}
