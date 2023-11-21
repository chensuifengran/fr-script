<template>
  <div class="about-main">
    <loading></loading>
    <!-- <el-empty description="开发中..." /> -->
    <!-- <iframe src="http://114.132.79.162/tool/#/index" /> -->
  </div>
</template>

<script setup lang="ts">
// import { useRouter } from "vue-router";
// const menuKey = inject<Ref<number>>("menuKey");
// const active = inject<Ref<string>>("active");
// const router = useRouter();
// onMounted(() => {
//   // 监听来自 iframe 的消息
//   window.addEventListener("message", function (event) {
//     console.log("收到来自 iframe 的消息:", event.data, event.origin);
//     const { type, path, name } = event.data;
//     if (type === "changeRouterPath") {
//       router.push(path);
//       active!.value = name;
//       menuKey!.value = menuKey!.value + 1;
//     }
//   });
// });
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
