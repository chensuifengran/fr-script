<template>
  <div class="account-main">
    <account-title-bar v-if="isLogin" />
    <account-auth v-else />
    <wss-panel v-if="isLogin" class="panel"/>
  </div>
</template>

<script setup lang="ts">
const { appAsideBgColor, appBackground } = useAppTheme();
const { isEditing } = useScriptInfo();
const { isLogin } = useAccount();

const background = computed(() => {
  if (isEditing.value) {
    return appAsideBgColor?.value;
  } else {
    return appBackground?.value;
  }
});
const mainBorderRadius = computed(() => {
  if (isEditing.value) {
    return "0";
  } else {
    return "10px 10px 10px 0";
  }
});

onMounted(() => {
  invokeBaseApi.closeSplashscreen();
});
</script>

<style lang="scss" scoped>
.account-main {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: hidden;
  background: v-bind(background);
  border-radius: v-bind(mainBorderRadius);
  display: flex;
  flex-direction: column;
  align-items: center;
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .panel{
    display: flex;
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
}
</style>
