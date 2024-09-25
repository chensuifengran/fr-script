<template>
  <div class="about-main">
    <!-- <el-button @click="toggleCapture">{{ running ? '停止录制' : '录制操作' }}</el-button> -->
    <el-empty description="开发中..." />
    <!-- <iframe src="http://114.132.79.162/tool/#/index" /> -->
    <!-- <div class="answer">{{ answer }}</div>
    <el-input v-model="q" />
    <el-button @click="send" v-loading="loading">发送</el-button> -->
  </div>
</template>

<script setup lang="ts">
// onMounted(async () => {
//   setTimeout(() => {
//     invokeBaseApi.stopCaptureOperation()
//   }, 3000);
//   const res = await invokeBaseApi.captureOperation();
//   console.log(res);

// });
// const [running, { toggle }] = useBoolean(false);
// const toggleCapture = async () => {
//   toggle();
//   if (!running.value) {
//     invokeBaseApi.stopCaptureOperation()
//   } else {
//     const res = await invokeBaseApi.captureOperation();
//     console.log(res);
//   }
// }
// const q = ref('');
// const send = ()=>{
//   const ctx = '小明的爸爸叫王大明';
//   start(ctx, q.value);
//   q.value = '';
// }
// const [answer, loading, start] = useSpark();
// onMounted(()=>{
//   invokeBaseApi.closeSplashscreen();
// })
</script>

<style lang="scss" scoped>
.about-main {
  width: 100%;
  height: calc(100% - 10px);
  box-sizing: border-box;
  position: relative;
  border-radius: 5px;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    box-sizing: border-box;
  }
}
</style>
