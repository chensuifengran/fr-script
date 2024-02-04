//查看是否连接设备
const DEVICE_STATE = "get-state";
//查看设备
const SHOW_DEVICES = "devices";
//连接 后面需要拼上设备HOST[:port]
const CONNECT_PREVAL = "connect ";
//取消连接 后面需要拼上设备HOST[:port]
const DISCONNECT_PREVAL = "disconnect ";
//截图 后面需拼接路径以及图片命名
const SCREEN_SHOT_PREVAL = "exec-out screencap -p > ";
//点击 后面需要拼接上xy坐标
const CLICK_PREVAL = "shell input tap ";
//滑动 后面需要拼接上起点xy坐标和终点xy坐标以及滑动时长(ms)
const SLIDE_PREVAL = "shell input swipe ";
//返回键
const KEY_RETURN = "shell input keyevent 4";
//HOME键
const KEY_HOME = "shell input keyevent 3";
export const adbCommands = {
  DEVICE_STATE,
  SHOW_DEVICES,
  CONNECT_PREVAL,
  DISCONNECT_PREVAL,
  SCREEN_SHOT_PREVAL,
  CLICK_PREVAL,
  SLIDE_PREVAL,
  KEY_RETURN,
  KEY_HOME,
  emptyCommand: "",
};
