import { defineStore } from "pinia";
import { getVersion } from "@tauri-apps/api/app";
// 第一个参数是应用程序中 store 的唯一 id
export const useAppGlobalSettings = defineStore("globalSettings", {
  // 其它配置项
  state: () => {
    return <GlobalSettings>{
      isInited: false,
      app: {
        latestVersion: "0.0.3",
        depHaveUpdate: false,
        dependenceState: "不可用",
        state: {
          aside: {
            collapsed: false,
            currentItem: "script",
          },
        },
        modulesSetting: {
          autoOpenOutput: true,
          drawerSize: "30%",
        },
      },
      envSetting: {
        workDir: "",
        screenshotSavePath: "",
      },
      ocr: {
        value: "CPU",
        options: ["GPU", "CPU"],
        gpuMemory: 1000,
      },
      view: {
        showUpdateInTitleBar: true,
      },
      editor: {
        theme: {
          value: "跟随全局主题",
          options: ["跟随全局主题", "明亮", "暗黑"],
        },
        runAutoSave: true,
      },
    };
  },
  getters: {},
  actions: {
    async exportData() {
      const obj: any = { version: await getVersion() };
      Object.assign(obj, this.$state);
      delete obj.ocr.inited;
      return JSON.stringify(obj);
    },
    async importData(data: string) {
      const obj = JSON.parse(data);
      delete obj.version;
      Object.assign(this.$state, obj);
      const ocrValue = await libUtil.syncOcrValue();
      if (ocrValue) {
        obj.ocr.value = ocrValue;
      }
      this.$patch(obj);
    },
    async init() {
      //开始监听store变化，发送变化则导出state放在localStorage
      this.$subscribe(
        async (mutation, _state) => {
          /*
          * mutation主要包含三个属性值：
          *   events：当前state改变的具体数据，包括改变前的值和改变后的值等等数据
          *   storeId：是当前store的id
          *   type：用于记录这次数据变化是通过什么途径，主要有三个分别是
          *         “direct” ：通过 action 变化的
                    ”patch object“ ：通过 $patch 传递对象的方式改变的
                    “patch function” ：通过 $patch 传递函数的方式改变的
          *
          * */
          if (mutation.storeId === "globalSettings") {
            // console.log(mutation.events)
            localStorage.setItem("globalSettings", await this.exportData());
          }
        },
        { detached: false }
      );
      window.localStorage.getItem("globalSettings") &&
        (await this.importData(window.localStorage.getItem("globalSettings")!));
      this.isInited = true;
    },
  },
});

export type AppGSStore = ReturnType<typeof useAppGlobalSettings>;
