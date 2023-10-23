<script setup lang="ts">
import { invoke } from "@tauri-apps/api/tauri";
const isDark = useDark({});
const toggleDark = useToggle(isDark);
const pos = reactive({
  x: 0,
  y: 0,
});
const testInputA = async ()=>{
  greetMsg.value = await invoke("test");
};
onMounted(() => {
  setInterval(async () => {
    const position = (await invoke("get_pos")) as any;
    const { x, y } = JSON.parse(position).message;
    pos.x = x;
    pos.y = y;
  }, 100);
});
const greetMsg = ref("");
const mouseTarget = reactive({ x: 0, y: 0 });

const moveTo = async () => {
  greetMsg.value = await invoke("move_to", {
    x: +mouseTarget.x,
    y: +mouseTarget.y,
  });
};

const moveClick = async () => {
  greetMsg.value = await invoke("move_click", {
    x: +mouseTarget.x,
    y: +mouseTarget.y,
    isLeft: true,
  });
};
</script>

<template>
  <div>position: {{ pos.x }} ,{{ pos.y }}</div>
  <el-input v-model="mouseTarget.x" placeholder="x" />
  <el-input v-model="mouseTarget.y" placeholder="y" />
  <el-button @click="moveTo">moveTo</el-button>
  <el-button @click="moveClick">moveClick</el-button>
  <el-button @click="testInputA">testInputA</el-button>
  <p>{{ greetMsg }}</p>
  <el-button @click="toggleDark()">toggleDark:{{ isDark }}</el-button>
</template>

<style></style>
