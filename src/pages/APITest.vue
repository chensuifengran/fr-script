<template>
  <!-- <div class="remd">
    <ATHeader
      class="alone-page-header"
      v-if="isAlone"
      :openOutput="() => (openOutput = true)"
      :changeSearchValue="(value) => (searchValue = value)"
    />
    <div class="search-header" v-else>
      <el-input
        v-model="searchValue"
        clearable
        placeholder="可输入API的关键字对API进行筛选"
      >
      </el-input>
      <el-button class="btn" @click="openOutput = true"
        ><el-icon><IEpNotification /></el-icon
      ></el-button>
    </div>
    <div
      class="page-content"
      ref="pageContentRef"
      v-infinite-scroll="load"
      :infinite-scroll-distance="40"
      :infinite-scroll-immediate="false"
    >
      <AsyncApiDocumentItem
        v-for="m in allDocumentItems"
        :key="m?.dialog?.targetMethodName || m?.dialog?.title"
        :model="m!"
        :type="m?.itemType"
      />
      <div class="end" v-if="isEnd">------到底了，没有更多数据了------</div>
      <div class="loading-box" v-show="mainLoading"><Loading />加载中...</div>
    </div>
  </div>

  <el-drawer v-model="openOutput" title="" direction="btt" :size="drawerSize">
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">API测试-输出结果</h4>
      <el-select
        v-model="drawerSize"
        placeholder="大小"
        size="small"
        class="options select"
      >
        <el-option
          v-for="n in 8"
          :key="n"
          :label="20 + n * 10 + '%'"
          :value="20 + n * 10 + '%'"
        />
      </el-select>
      <el-switch
        class="options"
        v-model="autoOpenOutput"
        inline-prompt
        style="--el-switch-on-color: #00843b; --el-switch-off-color: #ccc"
        active-text="自动显示"
        inactive-text="手动显示"
      />
      <el-button class="options" size="small" @click="output = ''">
        <el-icon><IEpDeleteFilled /></el-icon>清空输出
      </el-button>
    </template>
    <el-input
      v-model="output"
      type="textarea"
      placeholder="API测试的输出结果"
      :autosize="textareaOptions"
      spellcheck="false"
    />
  </el-drawer> -->
</template>
<script lang="ts" setup>
// import { useRoute } from "vue-router";

// import Loading from "@renderer/components/Loading.vue";

// import { useDllMethodsRegister } from "@renderer/hook/useDllMethodsRegister";
// import { useADBMethodsRegister } from "@renderer/hook/useADBMethodsRegister";
// import { useUtilMethodsRegister } from "@renderer/hook/useUtilMethodsRegister";
// import { TestModuleType } from "@renderer/types/methodRegister/TestModuleType";

// const AsyncApiDocumentItem = defineAsyncComponent({
//   loader: async () => import("@renderer/components/apiTest/ApiDocumentItem.vue"),
//   loadingComponent: Loading,
// });
// const pageContentRef = ref<HTMLElement>();
// const { getTestModule, setTestModuleCtx } = useDllMethodsRegister();
// const { getUtilTestModules } = useUtilMethodsRegister();
// const {
//   getAdbTestModules,
//   setTestModuleCtx: setAdbTestModuleCtx,
// } = useADBMethodsRegister();
// const drawerSize = ref("30%");
// const mainLoading = ref(true);
// const isEnd = ref(false);
// const isAlone = ref(false);
// const pagePadding = ref("20px");
// const searchValue = ref("");
// const antiShakeValue = ref("");
// let needChange = true;
// const isResize = ref(false);
// const needCheckUpdate = inject<Ref<boolean>>("needCheckUpdate");
// window.onresize = () => {
//   isResize.value = true;
// };
// const textareaOptions = computed(() => {
//   if (isResize.value) {
//     isResize.value = false;
//   }
//   if (!needChange) {
//     const p = pageContentRef.value!.offsetHeight / 591;
//     needChange = true;
//     return {
//       minRows: Math.ceil((5 + (+drawerSize.value.replace("%", "") / 10 - 3) * 3) * p),
//       maxRows: Math.ceil((5 + (+drawerSize.value.replace("%", "") / 10 - 3) * 3) * p),
//     };
//   }
//   const p = pageContentRef.value!.offsetHeight / 591;
//   const defualt = {
//     minRows: Math.ceil((5 + (+drawerSize.value.replace("%", "") / 10 - 3) * 3) * p),
//     maxRows: Math.ceil((5 + (+drawerSize.value.replace("%", "") / 10 - 3) * 3) * p),
//   };
//   output.value += " ";
//   nextTick(() => {
//     needChange = false;
//     output.value = output.value.slice(0, -1);
//   });
//   return defualt;
// });
// let timer: NodeJS.Timeout | null = null;
// watchEffect(() => {
//   const value = searchValue.value;
//   timer && clearTimeout(timer);
//   timer = setTimeout(() => {
//     if (antiShakeValue.value === value) {
//       return;
//     }
//     antiShakeValue.value = value;
//   }, 500);
// });

// const loadCount = ref(0);
// let tatalCount = 0;
// onMounted(() => {
//   const pageContent = pageContentRef.value!;
//   loadCount.value = Math.ceil(pageContent.offsetHeight / 43) + 1;
//   const t = setTimeout(() => {
//     mainLoading.value = false;
//     clearTimeout(t);
//   }, 500);
// });
// const load = async () => {
//   if (loadCount.value < tatalCount) {
//     loadCount.value = Math.min(loadCount.value + 5, tatalCount);
//   } else if (loadCount.value === tatalCount) {
//     isEnd.value = true;
//   }
// };
// const allDocumentItems = computed<TestModuleType[]>(() => {
//   const allList = [
//     ...(getTestModule()
//       .filter((d) => {
//         if (antiShakeValue.value) {
//           return (
//             d!.dialog.targetMethodName?.includes(antiShakeValue.value) ||
//             d!.dialog.title?.includes(antiShakeValue.value) ||
//             d!.dialog.content?.includes(antiShakeValue.value) ||
//             d!.document!.howToUse?.includes(antiShakeValue.value) ||
//             d!.document!.searchKeys?.some((key) => key.includes(antiShakeValue.value))
//           );
//         }
//         return true;
//       })
//       .map((d) => {
//         return { ...d, itemType: "dll" };
//       }) as TestModuleType[]),
//     ...(getAdbTestModules()
//       .filter((d) => {
//         if (antiShakeValue.value) {
//           return (
//             d!.dialog.targetMethodName?.includes(antiShakeValue.value) ||
//             d!.dialog.title?.includes(antiShakeValue.value) ||
//             d!.dialog.content?.includes(antiShakeValue.value) ||
//             d!.document!.howToUse?.includes(antiShakeValue.value) ||
//             d!.document!.searchKeys?.some((key) => key.includes(antiShakeValue.value))
//           );
//         }
//         return true;
//       })
//       .map((d) => {
//         return { ...d, itemType: "adb" };
//       }) as TestModuleType[]),
//     ...(getUtilTestModules()!
//       .filter((d) => {
//         if (antiShakeValue.value) {
//           return (
//             d!.dialog.targetMethodName?.includes(antiShakeValue.value) ||
//             d!.dialog.title?.includes(antiShakeValue.value) ||
//             d!.dialog.content?.includes(antiShakeValue.value) ||
//             d!.document!.howToUse?.includes(antiShakeValue.value) ||
//             d!.document!.searchKeys?.some((key) => key.includes(antiShakeValue.value))
//           );
//         }
//         return true;
//       })
//       .map((d) => {
//         return { ...d, itemType: "util" };
//       }) as TestModuleType[]),
//   ].sort((a, b) => {
//     return b!.weight! - a!.weight!;
//   });
//   tatalCount = allList.length;

//   return allList.slice(0, loadCount.value);
// });

// const openOutput = ref(false);
// const autoOpenOutput = ref(true);
// const checkDU = inject("checkDU") as (isAuto?: boolean) => Promise<void>;
// const route = useRoute();
// const aside_width = inject<Ref<string>>("aside_width");
// onBeforeMount(async () => {
//   isAlone.value = route.query.showSlide === "false";
//   if (route.query?.showSlide === "false") {
//     aside_width!.value = "0";
//     pagePadding.value = "0";
//     needCheckUpdate!.value = false;
//   }
//   await checkDU();
// });

// const output = ref("");

// const showDetails = (text: string | undefined, preStr = "") => {
//   if (autoOpenOutput.value) {
//     openOutput.value = true;
//   }

//   //获取时分秒,不足两位补0
//   const date = new Date();
//   const h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
//   const m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
//   const s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
//   const time = `[${h}:${m}:${s}] `;
//   output.value = time + preStr + "：\t" + text + "\n" + output.value;
// };

// setTestModuleCtx({ showDetails });
// setAdbTestModuleCtx({ showDetails });

// const contentColor = computed(() => {
//   return isAlone.value ? "#00000010" : "#ffffff";
// });
</script>

<style lang="scss" scoped>
.options {
  margin-right: 5px;
}
.select {
  width: 100px;
}
.remd {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // padding: v-bind(pagePadding);
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 5px;
  position: relative;
  .alone-page-header {
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    color: var(--el-color-primary);
    padding-left: 5px;
  }
  .search-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .btn {
      margin-left: 5px;
    }
  }

  .page-content {
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 5px;
    position: relative;
    // background-color: v-bind(contentColor);
    .loading-box {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .end {
      text-align: center;
      color: #ccc;
      margin-top: 5px;
    }
  }
}
</style>
<style lang="scss">
.el-button-group {
  margin: 5px;
}
</style>
