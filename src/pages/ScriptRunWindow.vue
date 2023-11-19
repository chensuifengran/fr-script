<template>
  <div class="message-content" ref="content">
    <!-- <div
      class="header have-mouse-events"
      style="
        -webkit-app-region: drag;
        cursor: move;
        color: #fff;
        -webkit-app-pointer-events: auto;
      "
    >
      <span>脚本输出</span>
      <el-button @click="stop" type="danger"
        >结束<el-tag class="mgl-5" type="info" size="small">Alt+S</el-tag></el-button
      >
    </div> -->
  </div>
</template>
<script lang="ts" setup>
// const content = ref<HTMLElement>();
// const aside_width = inject<Ref<string>>("aside_width");
// // const stop = () => {};
// const pushMessage = (
//   message: string,
//   type: "success" | "info" | "warning" | "error" = "info"
// ) => {
//   // ElNotification.closeAll();
//   //定义一个时分秒的时间格式字符串
//   const title = new Date().toLocaleTimeString();

//   ElNotification[type]({
//     title: title,
//     message: message,
//     position: "top-left",
//     showClose: false,
//     target: content.value,
//   });
// };
// onMounted(async () => {
//   aside_width?.value && (aside_width.value = "0");
//   window.api.scriptRunMessageRegister(pushMessage);
// });
</script>

<style lang="scss" scoped>
.message-content {
  // border-radius: 10px;
  // border: 1px #fff solid;
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  // .header {
  //   display: flex;
  //   flex-direction: row;
  //   justify-content: space-between;
  //   width: 100%;
  // }
}
</style>
