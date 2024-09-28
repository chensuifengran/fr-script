export const clickReturnKeyFn = async (taskId?: string) => {
  if (IS_PLAYGROUND_ENV) {
    return "OK";
  }
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return "";
  }
  try {
    await execCommand.adb(adbCommands.KEY_RETURN);
    return "OK";
  } catch (e) {
    console.error(e);
    if ((e as string).includes("no devices")) {
      return e as string;
    }
    return "";
  }
};
