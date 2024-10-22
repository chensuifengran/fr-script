<template>
  <div class="wss-panel">
    <div v-if="wssState === '在线'">
      <el-card shadow="hover">
        <div flex flex-row items-center w-full>
          <el-text h4 mr-3
            ><el-icon><span i-mdi-lock></span></el-icon>远程控制访问码</el-text
          >
          <el-tooltip effect="dark" content="刷新访问码" placement="top">
            <el-button link @click="refreshCode" size="large">
              <el-icon size="large"><span i-mdi-shield-sync></span></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="修改访问码" placement="top">
            <el-button link @click="updateCode" size="large">
              <el-icon size="large"><span i-mdi-shield-edit></span></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        <div flex flex-row items-center mt-4>
          <el-tag v-for="(code, index) in codes" :key="index" mr-2>
            {{ code }}
          </el-tag>
          <el-button type="primary" link @click="copy">复制</el-button>
        </div>
        <div flex flex-row items-center justify-between w-full mt-4>
          <el-text>自动上线</el-text>
          <el-switch v-model="autoOnline" />
        </div>
        <div flex flex-row items-center justify-between w-full>
          <el-text>无访问码时询问</el-text>
          <el-switch v-model="autoAsk" />
        </div>
      </el-card>
    </div>
    <el-empty
      v-else
      description="当前处于离线状态，如想开启远程被控功能，请切换至在线状态"
    />
  </div>
</template>
<script lang="ts" setup>
const { wssState, onMsg, responseReq } = useWss();
const {
  controlDeviceInfo,
  autoOnline,
  autoAsk,
  controlCode,
  refreshCode,
  updateCode,
} = useControl();
onMsg((msg) => {
  if (msg.type === "LINK_REQ") {
    if (controlDeviceInfo.id === msg.deviceId) {
      responseReq(true);
      ElMessage.warning("已有设备正在控制中");
      return;
    }
    controlDeviceInfo.accessToken = msg.accessToken;
    if (!msg.code || msg.code === "") {
      if (autoAsk.value) {
        ElMessageBox.confirm(
          `是否允许${msg.deviceId}远程控制`,
          "远程控制请求",
          {
            confirmButtonText: "允许",
            cancelButtonText: "拒绝",
            type: "warning",
          }
        )
          .then(() => {
            responseReq(true);
            controlDeviceInfo.id = msg.deviceId;
          })
          .catch(() => {
            responseReq(false, "用户拒绝连接");
          });
        return;
      } else {
        responseReq(false, "不接受无访问码请求");
        return;
      }
    }
    if (controlCode.value === msg.code) {
      controlDeviceInfo.id = msg.deviceId;
      responseReq(true);
    } else {
      controlDeviceInfo.id = "";
      responseReq(false, "访问码错误");
      return;
    }
  }
});
const codes = computed(() => {
  return controlCode.value.split("").filter((_, index) => index < 4);
});
const copy = () => {
  const code = controlCode.value;
  execCopy(code);
  ElMessage.success("复制成功");
};
onMounted(() => {
  if (autoOnline.value) {
    wssState.value = "在线";
  }
});
</script>

<style lang="scss" scoped></style>
