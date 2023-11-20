import { defineStore } from "pinia";
// 第一个参数是应用程序中 store 的唯一 id
export const useRuntime = defineStore("runtime", {
  // 其它配置项
  state: () => {
    return <Runtime>{
      notAllowedFnId:[],
      currentScriptDir:"",
      runningFnId:"",
    };
  },
  getters: {},
  actions: {
  },
});

export type AppGSStore = ReturnType<typeof useRuntime>;
