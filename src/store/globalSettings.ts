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
        value: "GPU",
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
    // /**
    //  * 连接到设备时调用，保存设备信息和连接状态
    //  * @param device '127.0.0.1:21503'
    //  */
    // connected(device: string) {
    //   //要使用this则不用箭头函数
    //   this.adb.curDevice = device;
    //   const args = device.split(":");
    //   this.adb.host = args[0];
    //   this.adb.port = args[1];
    //   this.adb.state = "已连接";
    //   //把该设备从disDevices中移除(若有)
    //   this.adb.disDevices.splice(
    //     0,
    //     this.adb.disDevices.length,
    //     ...this.adb.disDevices.filter((i: string) => i !== device)
    //   );
    //   //更新devices列表
    //   this.adb.devices.splice(
    //     0,
    //     this.adb.devices.length,
    //     ...new Set([...this.adb.devices, device])
    //   );
    // },
    // /**
    //  * 取消连接时调用，清空设备信息，将设备push进disDevices
    //  */
    // disConnected() {
    //   //要使用this则不用箭头函数，箭头函数没有this
    //   const oldDevice = this.adb.curDevice;
    //   this.adb.host = "未知";
    //   this.adb.port = "未知";
    //   this.adb.curDevice = "";
    //   this.adb.state = "未连接";
    //   const disLength = this.adb.disDevices.length;
    //   if (oldDevice === "未知:未知") return;
    //   //oldDevice不在disDevices则加入
    //   if (disLength > 0) {
    //     if (!(this.adb.disDevices as string[]).includes(oldDevice))
    //       this.adb.disDevices[disLength] = oldDevice;
    //   } else {
    //     this.adb.disDevices[0] = oldDevice;
    //   }
    // },
    // /**
    //  * @param newDir 新的工作目录路径
    //  */
    // changeWorkDir(newDir: string) {
    //   this.workDir = newDir;
    // },
    // /**
    //  * @param newDir 新的截图保存路径
    //  */
    // changeScreenShotPath(newDir: string) {
    //   this.adb.screenShotSavePath = newDir;
    // },
    // /**
    //  * @param newDir 新的ADB路径
    //  */
    // changeAdbDir(newAdbDir: string) {
    //   const p = newAdbDir.includes("adb.exe")
    //     ? newAdbDir.replace("adb.exe", "")
    //     : newAdbDir;
    //   this.adb.installPath = p;
    // },
    // /**
    //  * 导出state数据
    //  */
    // exportData() {
    //   return JSON.stringify(<AppOption>{
    //     adb: this.adb,
    //     workDir: this.workDir,
    //     version: this.version,
    //     dependenceList: this.dependenceList,
    //   });
    // },

    // /**
    //  * 导入state数据
    //  */
    // importData(data: object) {
    //   Object.assign(this, data);
    //   this.$patch(data);
    // },
    // updateDevices(devices: string[]) {
    //   if (!devices.length || (devices.length === 1 && devices[0] === ""))
    //     this.adb.devices.splice(0, this.adb.devices.length);
    //   else this.adb.devices.splice(0, this.adb.devices.length, ...devices);
    // },
  },
});

export type AppGSStore = ReturnType<typeof useAppGlobalSettings>;
