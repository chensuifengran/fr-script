import { WebviewWindow } from "@tauri-apps/api/window"

export type GlobalWindowInfo = {
  windows:{
    label: string,
    window:WebviewWindow
  }[]
}