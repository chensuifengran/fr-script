<template>
  <div class="console-main">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
const appBackground = inject<globalThis.ComputedRef<"#000" | "#fff">>("appBackground");
</script>

<style lang="scss" scoped>
.console-main {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px;
  padding-bottom: 0;
  padding-top: 5px;
  box-sizing: border-box;
  overflow-x: hidden;
  background: v-bind(appBackground);
}
</style>
