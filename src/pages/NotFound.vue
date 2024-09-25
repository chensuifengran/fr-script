<template>
  <div w-full h-full flex justify-center items-center flex-col>
    <h1>404</h1>
    <p>Page not found</p>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';

onMounted(()=>{
  //跳转到首页
  ElNotification({
    title: '404',
    message: '页面不存在, 3秒后跳转到首页',
    type: 'error'
  })
  setTimeout(()=>{
    const appGSStore = useAppGlobalSettings();
    const { app } = storeToRefs(appGSStore);
    router.replace('/script/list')
    useAppLayout().menuKey.value++;
    useAutoTitleBar().info.showContentType = "script";
    app.value.state.aside.currentItem = "script"
  },3000)
})
</script>

<style lang="scss" scoped>

</style>