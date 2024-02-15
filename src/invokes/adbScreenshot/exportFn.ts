import { disConnectToFn } from "../disConnectTo/exportFn";
import { connectToFn } from "../connectTo/exportFn";

export const adbScreenshot = async (
  reCount: number = 0,
  taskId?: string
): Promise<string> => {
  const { notAllowedFnId, currentDevice } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return "";
  }
  const AppGSStore = useAppGlobalSettings();
  try {
    console.log('adbScreenshot',adbCommands.SCREEN_SHOT_PREVAL + AppGSStore.envSetting.screenshotSavePath);
    const res = await execCommand.adb(
      adbCommands.SCREEN_SHOT_PREVAL + AppGSStore.envSetting.screenshotSavePath || "screenshot.png"
    );
    
    
    const listStore = useListStore();
    //res为空字符串说明成功截图
    if (res !== "") {
      console.error(res, "截图失败，尝试重新连接设备后截图...");
      //如果截图失败，尝试重新连接设备后截图

      const disDevice = listStore.deviceList.filter(
        (i) => i !== currentDevice.value
      );
      for (let i = 0; i < disDevice.length; i++) {
        console.log("尝试断开连接设备：", disDevice[i]);
        await disConnectToFn(disDevice[i], taskId);
      }
      console.log("尝试连接设备：", currentDevice.value);
      await connectToFn(currentDevice.value, taskId);
      await execCommand.adb(
        adbCommands.SCREEN_SHOT_PREVAL +
          AppGSStore.envSetting.screenshotSavePath
      );
    }
    //检测图片大小，如果为0则重新截图
    const size =
      (await fsUtils.getFileInfo(AppGSStore.envSetting.screenshotSavePath))
        ?.fileSize || 0;
    if (size === 0) {
      console.error("截图失败，尝试重新连接设备后截图...");
      const disDevice = listStore.deviceList.filter(
        (i) => i !== currentDevice.value
      );
      for (let i = 0; i < disDevice.length; i++) {
        console.log("尝试断开连接设备：", disDevice[i]);
        await disConnectToFn(disDevice[i], taskId);
      }
      console.log("尝试连接设备：", currentDevice.value);
      await connectToFn(currentDevice.value, taskId);
      if (reCount > 3) {
        console.error("连续截图失败，退出截图");
        return "连续截图失败，退出截图";
      }
      return await adbScreenshot(reCount + 1, taskId);
    }
    if(res){
      return "截图完成"
    }
    return res;
  } catch (e) {
    console.error(e);
    return JSON.stringify(e);
  }
};

export type AdbScreenshotFnType = typeof adbScreenshot;
