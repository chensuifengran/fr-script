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
export const useScriptRuntime = ()=>{
  return {
    notAllowedFnId,
    currentScriptDir,
    runningFnId,
  }
}