import { defineStore } from "pinia";
import { getVersion } from "@tauri-apps/api/app";
// 第一个参数是应用程序中 store 的唯一 id
export const useListStore = defineStore<
  string,
  ListState,
  {},
  ListStoreActions
>("listStore", {
  // 其它配置项
  state: () => {
    return {
      renderList: [],
      scriptList: [],
      projectList: [],
      deviceList: [],
      codeSnippets: [],
    };
  },
  getters: {},
  actions: {
    async exportData() {
      const obj: any = {
        version: IS_PLAYGROUND_ENV ? "playground" : await getVersion(),
      };
      Object.assign(obj, this.$state);
      return JSON.stringify(obj);
    },
    async importData(data: string) {
      const obj = JSON.parse(data);
      delete obj.version;
      Object.assign(this.$state, obj);
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
          if (mutation.storeId === "listStore") {
            localStorage.setItem("listStore", await this.exportData());
          }
        },
        { detached: false }
      );
      const localData = window.localStorage.getItem("listStore");
      if (localData) {
        await this.importData(localData);
      }
    },
  },
});

export type ListStore = ReturnType<typeof useListStore>;
