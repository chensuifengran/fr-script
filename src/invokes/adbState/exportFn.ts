import { disConnectToFn } from "../disConnectTo/exportFn";

export const adbStateFn = async (taskId?: string) => {
  const { notAllowedFnId,currentDevice }  = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  let res: string | undefined;
  try {
    res = await execCommand.adb(adbCommands.DEVICE_STATE) || '';
  } catch (e) {
    console.error(e);
    return "出现异常";
  }
  if (res!.includes("error: more than one device/emulator")) {
    //多台设备在连接
    //尝试连接当前连接设备
    let res: string | undefined;
    try {
      res = await execCommand.adb(adbCommands.CONNECT_PREVAL + currentDevice.value);
    } catch (e) {
      console.error(e);
      return "出现异常";
    }
    if (res!.includes("already connected to")) {
      // 已经连接该设备
      return "device";
    } else if (res!.includes("connected to")) {
      disConnectToFn(currentDevice.value);
      return "unLink";
    }
  } else if (res!.includes("error: no devices/emulators found")) {
    currentDevice.value = "";
    return "unLink";
  }
  if (!res!.includes("device")) {
    // 未连接则清空store的adb连接信息
    currentDevice.value = "";
    return "unLink";
  }
  return res;
};
