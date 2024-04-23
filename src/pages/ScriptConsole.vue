<template>
  <div class="console-main">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
const { appAsideBgColor, appBackground } = useAppTheme();
const { isEditing } = useScriptInfo();
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
</script>

<style lang="scss" scoped>
.console-main {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  background: v-bind(background);
  border-radius: v-bind(mainBorderRadius);
}
</style>
