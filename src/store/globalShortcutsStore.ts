import { defineStore } from "pinia";
export const useGlobalShortcutsStore = defineStore<
  string,
  GlobalShortcutsStore,
  {},
  GlobalShortcutsStoreActions
>("globalShortcuts", {
  state: () => {
    return {
      allShortcuts: [
        {
          shortcuts: "Ctrl+Shift+A",
          onlyDescription: "运行脚本",
        },
        {
          shortcuts: "Ctrl+Shift+D",
          onlyDescription: "重新初始化脚本",
        },
        {
          shortcuts: "Ctrl+Shift+S",
          onlyDescription: "强制停止脚本",
        },
        {
          shortcuts: "Ctrl+Alt+Shift+Home",
          onlyDescription: "强制显示主窗口",
        },
        {
          shortcuts: "Alt+Shift+C",
          onlyDescription: "记录鼠标位置及颜色",
        },
      ],
    };
  },
  getters: {},
  actions: {
    //updateShortcutsByOnlyDescription 通过唯一描述更新快捷键
    updateShortcuts(onlyDescription: string, newShortcuts: string) {
      this.allShortcuts.find(
        (item) => item.onlyDescription === onlyDescription
      )!.shortcuts = newShortcuts;
    },
    //getShortcutsByOnlyDescription 通过唯一描述获取快捷键
    getShortcuts(onlyDescription: string) {
      return this.allShortcuts.find(
        (item) => item.onlyDescription === onlyDescription
      )!.shortcuts;
    },
    exportData() {
      return JSON.stringify(this.allShortcuts);
    },
    importData(cacheData: string) {
      const cacheList = JSON.parse(cacheData);
      if (cacheList instanceof Array) {
        const newList = [...this.allShortcuts];
        for (let index = 0; index < cacheList.length; index++) {
          const element = cacheList[index];
          const target = newList.find(
            (item) => item.onlyDescription === element.onlyDescription
          );
          if (target) {
            target.shortcuts = element.shortcuts;
          }
        }
        this.$patch({ allShortcuts: cacheList });
      }
    },
    init() {
      //开始监听store变化，发送变化则导出state放在localStorage
      this.$subscribe(
        (mutation, _state) => {
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
          if (mutation.storeId === "globalShortcuts") {
            localStorage.setItem("globalShortcuts", this.exportData());
          }
        },
        { detached: false }
      );
      window.localStorage.getItem("globalShortcuts") &&
        this.importData(window.localStorage.getItem("globalShortcuts")!);
    },
  },
});
