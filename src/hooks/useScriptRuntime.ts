/*
{
      notAllowedFnId:[],
      currentScriptDir:"",
      runningFnId:"",
    };
  }
*/
const notAllowedFnId = ref<string[]>([]);
const currentScriptDir = ref<string>("");
const runningFnId = ref<string>("");
const currentDevice = ref<string>("");
export const useScriptRuntime = ()=>{
  return {
    notAllowedFnId,
    currentScriptDir,
    runningFnId,
    currentDevice
  }
}