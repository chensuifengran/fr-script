<template>
  <div>
    <div style="-webkit-app-region: drag; width: 25%; cursor: move">
      <span>调试</span>
    </div>
    <div class="header-r">
      <div style="-webkit-app-region: drag; cursor: move" class="move"></div>
      <el-input
        @input="changeSearchValue(searchValue)"
        class="input"
        v-model="searchValue"
        clearable
        placeholder="可输入API的关键字对API进行筛选"
      >
      </el-input>
      <el-button class="circle-btn" type="info" circle @click="openOutput"
        ><el-icon><IEpNotification /></el-icon
      ></el-button>
      <el-button class="circle-btn" type="info" circle @click="showApiTestButton"
        ><el-icon><IEpSemiSelect /></el-icon
      ></el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchValue = ref("");
defineProps({
  openOutput: {
    type: Function as PropType<() => void>,
    required: true,
  },
  changeSearchValue: {
    type: Function as PropType<(value: string) => void>,
    required: true,
  },
});
const showApiTestButton = () => {
  // window.api.invokeMainHandle("hideApiTestWin");
};
</script>

<style scoped lang="scss">
.header-r {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  max-width: 80%;
  .move {
    flex: 1;
    height: 100%;
  }

  .input {
    width: 300px;
  }
  .circle-btn {
    margin: 0;
    margin-right: 5px;
    // border: 0;
    background-color: #ffffff;
    border: 1px solid #efefef;
    color: var(--el-color-primary);
    &:first-of-type {
      margin-left: 5px;
    }
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
