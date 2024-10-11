<template>
  <div class="float-window"></div>
</template>
<script lang="ts" setup>
import { UnlistenFn } from "@tauri-apps/api/event";

const { borderRadius, appOpacity } = useAppTheme();
const { notify } = eventUtil;
let unlistenNotify: UnlistenFn;
onMounted(async () => {
  borderRadius.value = "20px";
  unlistenNotify = await notify.listen<{
    type: string;
    payload: {
      name: string;
      message: string;
    };
  }>((data) => {
    const { type, payload } = data.payload;
    if (type === "custom-message") {
      const { name, message } = payload;
      if (name === "borderRadius") {
        borderRadius.value = message;
      } else if (name === 'opacity') {
        appOpacity.value = +message;
      }
    }
  });
});
onUnmounted(() => {
  unlistenNotify();
});
</script>

<style lang="scss" scoped>
.float-window {
  width: 100%;
  height: 100%;
}
</style>
