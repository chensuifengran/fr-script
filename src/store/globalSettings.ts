import { defineStore } from "pinia";
import { getVersion } from "@tauri-apps/api/app";
// 第一个参数是应用程序中 store 的唯一 id
export const useAppGlobalSettings = defineStore<
  string,
  GlobalSettings,
  {},
  ListStoreActions
>("globalSettings", {
  // 其它配置项
  state: () => {
    return {
      isInited: false,
      app: {
        latestVersion: "2.0.0",
        depHaveUpdate: false,
        dependenceState: IS_PLAYGROUND_ENV ? "完整版" : "不可用",
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
        _screenshotDir: "",
        _scriptRootDir: "E:\\test\\root_dir",
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
      const obj: any = {
        version: IS_PLAYGROUND_ENV ? "playground" : await getVersion(),
      };
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
      if (!IS_PLAYGROUND_ENV) {
        obj.envSetting._screenshotDir = await pathUtils.resolve(
          obj.envSetting.screenshotSavePath,
          "../"
        );
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
      const loaclGs = window.localStorage.getItem("globalSettings");
      if (loaclGs) {
        await this.importData(loaclGs);
      } else {
        //设置默认工作目录和截图保存路径
        if (this.envSetting.workDir === "") {
          if (!IS_PLAYGROUND_ENV) {
            const workDir = await pathUtils.getInstallDir();
            this.envSetting.workDir = workDir;
          } else {
            this.envSetting.workDir = "E:\\playground";
          }
        }
        if (this.envSetting.screenshotSavePath) {
          if (!IS_PLAYGROUND_ENV) {
            const screenshotSavePath = await pathUtils.resolve(
              await pathUtils.getInstallDir(),
              "screenshot.png"
            );
            this.envSetting.screenshotSavePath = screenshotSavePath;
            this.envSetting._screenshotDir = await pathUtils.resolve(
              screenshotSavePath,
              "../"
            );
          } else {
            this.envSetting.screenshotSavePath =
              "E:\\playground\\screenshot.png";
            this.envSetting._screenshotDir = "E:\\playground";
          }
        }
      }
      this.isInited = true;
    },
  },
});

export type AppGSStore = ReturnType<typeof useAppGlobalSettings>;
