<template>
  <div class="console-main">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
const appAsideBgColor = inject<globalThis.ComputedRef<"#272727" | "#f6f6f6">>(
  "appAsideBgColor"
);
const appBackground = inject<globalThis.ComputedRef<"#000" | "#fff">>("appBackground");
const { isEditing } = useScriptInfo();
const background = computed(() => {
  if (isEditing.value) {
    return appAsideBgColor?.value;
  } else {
    return appBackground?.value;
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
  border-radius: 10px 10px 10px 0;
}
</style>
