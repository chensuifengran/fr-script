<template>
  <div w-full>
    <div flex flex-row items-center w-full justify-between>
      <div flex flex-row items-center>
        <el-badge :type="onlineState" is-dot>
          <el-avatar :size="30"> {{ showName }} </el-avatar>
        </el-badge>
        <el-text truncated>{{ username }}</el-text>
        <el-tag size="small" type="info" ml-1><el-text truncated>{{ tempDeviceId }}</el-text></el-tag>
      </div>
      <div flex flex-row items-center>
        <el-segmented v-model="wssState" :options="['在线', '离线']" mr-5/>
        <el-button @click="logout" link type="danger">退出登录</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import tempDeviceId from '../hooks/useOsInfo';

const { username, logout } = useAccount();
const { wssState } = useWss();
const showName = computed(() => {
  return username.value[0]?.toUpperCase() || "";
});
const onlineState = computed(() => {
  return wssState.value === "在线" ? "success" : "warning";
});
</script>

<style lang="scss" scoped></style>
