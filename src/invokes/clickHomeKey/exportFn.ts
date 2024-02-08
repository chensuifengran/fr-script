// 定义一个函数，返回一个函数
export const clickHomeKeyFn = async (taskId?: string) => {
  const { notAllowedFnId }  = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return"";
  }
  try {
    // 调用 execCommandFn 函数，并传入 KEY_HOME 参数
    await execCommand.adb(adbCommands.KEY_HOME);
  } catch (e) {
    console.error(e);
    if((e as string).includes('no devices')){
      return (e as string);
    }
    // 如果出现异常，则返回一个 rejected 状态的 Promise
    return "";
  }
};

// 定义一个类型，表示 clickHomeKeyFn 函数的返回值类型
export type ClickHomeKeyFnType = typeof clickHomeKeyFn;
