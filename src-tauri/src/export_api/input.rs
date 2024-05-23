use enigo::*;

use crate::types::generate_result;

#[tauri::command]
pub async fn input_text(text: &str) -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    match enigo {
        Ok(mut enigo) => {
            let res = enigo.text(text);
            match res {
                Ok(_) => Ok(generate_result(String::from("input_text ok"), 200)),
                Err(e) => match e {
                    InputError::Mapping(s) => Err(generate_result(s, 501)),
                    InputError::Unmapping(s) => Err(generate_result(s, 502)),
                    InputError::NoEmptyKeycodes => {
                        Err(generate_result(String::from("NoEmptyKeycodes"), 503))
                    }
                    InputError::Simulate(s) => Err(generate_result(s, 504)),
                    InputError::InvalidInput(s) => Err(generate_result(s, 505)),
                },
            }
        }
        Err(e) => match e {
            NewConError::EstablishCon(s) => Err(generate_result(s, 506)),
            NewConError::Reply => Err(generate_result(
                String::from("Error when receiving a reply"),
                507,
            )),
            NewConError::NoEmptyKeycodes => Err(generate_result(
                String::from(
                    "The keymap is full, so there was no space to map any keycodes to keysyms",
                ),
                508,
            )),
        },
    }
}

#[tauri::command]
pub async fn press_key(key: Key) -> Result<String, String> {
    let enigo: Result<Enigo, NewConError> = Enigo::new(&Settings::default());
    match enigo {
        Ok(mut enigo) => {
            let res: Result<(), InputError> = enigo.key(key, Direction::Click);
            match res {
                Ok(_) => Ok(generate_result(String::from("input_text ok"), 200)),
                Err(e) => match e {
                    InputError::Mapping(s) => Err(generate_result(s, 501)),
                    InputError::Unmapping(s) => Err(generate_result(s, 502)),
                    InputError::NoEmptyKeycodes => {
                        Err(generate_result(String::from("NoEmptyKeycodes"), 503))
                    }
                    InputError::Simulate(s) => Err(generate_result(s, 504)),
                    InputError::InvalidInput(s) => Err(generate_result(s, 505)),
                },
            }
        }
        Err(e) => match e {
            NewConError::EstablishCon(s) => Err(generate_result(s, 506)),
            NewConError::Reply => Err(generate_result(
                String::from("Error when receiving a reply"),
                507,
            )),
            NewConError::NoEmptyKeycodes => Err(generate_result(
                String::from(
                    "The keymap is full, so there was no space to map any keycodes to keysyms",
                ),
                508,
            )),
        },
    }
}

#[tauri::command]
pub async fn press_keys(keys: Vec<Key>) -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    match enigo {
        Ok(mut enigo) => {
            let mut error_keys: bool = false;
            for key in &keys {
                match enigo.key(*key, Direction::Press) {
                    Ok(_) => {}
                    Err(e) => {
                        log::error!("press_key error: {:?}", e);
                        error_keys = true;
                    }
                }
            }
            for key in keys.into_iter().rev() {
                match enigo.key(key, Direction::Release) {
                    Ok(_) => {}
                    Err(e) => {
                        log::error!("Release_key error: {:?}", e);
                        error_keys = true;
                    }
                }
            }
            if error_keys {
                return Err(generate_result(
                    String::from("存在按键按下或释放时异常"),
                    500,
                ));
            }
            Ok(generate_result(String::from("ok"), 200))
        }
        Err(e) => match e {
            NewConError::EstablishCon(s) => Err(generate_result(s, 506)),
            NewConError::Reply => Err(generate_result(
                String::from("Error when receiving a reply"),
                507,
            )),
            NewConError::NoEmptyKeycodes => Err(generate_result(
                String::from(
                    "The keymap is full, so there was no space to map any keycodes to keysyms",
                ),
                508,
            )),
        },
    }
}

#[tauri::command]
pub async fn key_down(key: Key) -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    match enigo {
        Ok(mut enigo) => {
            let res = enigo.key(key, Direction::Press);
            match res {
                Ok(_) => Ok(generate_result(String::from("key_down ok"), 200)),
                Err(e) => match e {
                    InputError::Mapping(s) => Err(generate_result(s, 501)),
                    InputError::Unmapping(s) => Err(generate_result(s, 502)),
                    InputError::NoEmptyKeycodes => {
                        Err(generate_result(String::from("NoEmptyKeycodes"), 503))
                    }
                    InputError::Simulate(s) => Err(generate_result(s, 504)),
                    InputError::InvalidInput(s) => Err(generate_result(s, 505)),
                },
            }
        }
        Err(e) => match e {
            NewConError::EstablishCon(s) => Err(generate_result(s, 506)),
            NewConError::Reply => Err(generate_result(
                String::from("Error when receiving a reply"),
                507,
            )),
            NewConError::NoEmptyKeycodes => Err(generate_result(
                String::from(
                    "The keymap is full, so there was no space to map any keycodes to keysyms",
                ),
                508,
            )),
        },
    }
}

#[tauri::command]
pub async fn key_up(key: Key) -> Result<String, String> {
    let enigo = Enigo::new(&Settings::default());
    match enigo {
        Ok(mut enigo) => {
            let res = enigo.key(key, Direction::Release);
            match res {
                Ok(_) => Ok(generate_result(String::from("key_up ok"), 200)),
                Err(e) => match e {
                    InputError::Mapping(s) => Err(generate_result(s, 501)),
                    InputError::Unmapping(s) => Err(generate_result(s, 502)),
                    InputError::NoEmptyKeycodes => {
                        Err(generate_result(String::from("NoEmptyKeycodes"), 503))
                    }
                    InputError::Simulate(s) => Err(generate_result(s, 504)),
                    InputError::InvalidInput(s) => Err(generate_result(s, 505)),
                },
            }
        }
        Err(e) => match e {
            NewConError::EstablishCon(s) => Err(generate_result(s, 506)),
            NewConError::Reply => Err(generate_result(
                String::from("Error when receiving a reply"),
                507,
            )),
            NewConError::NoEmptyKeycodes => Err(generate_result(
                String::from(
                    "The keymap is full, so there was no space to map any keycodes to keysyms",
                ),
                508,
            )),
        },
    }
}
