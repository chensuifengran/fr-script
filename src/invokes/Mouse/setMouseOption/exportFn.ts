export const setMouseOptionFn = (
  option: MouseOption,
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return;
  }
  try {
    if(window[CORE_NAMESPACES]?.Mouse?.__NS_DATA__){
      window[CORE_NAMESPACES].Mouse.__NS_DATA__ = option;
    }else{
      console.error("setMouseOptionFnError:","Mouse未被初始化");
    }
  } catch (error) {
    console.error("setMouseOptionFnError:", error);
  }
};
