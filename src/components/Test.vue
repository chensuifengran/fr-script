<script setup lang="ts">
import { invoke } from "@tauri-apps/api/tauri";
const isDark = useDark({});
const toggleDark = useToggle(isDark);
const pos = reactive({
  x: 0,
  y: 0,
});

onMounted(() => {
  setInterval(async () => {
    const position = (await invoke("mouse_get_pos")) as any;
    const { x, y } = JSON.parse(position).message;
    pos.x = x;
    pos.y = y;
  }, 100);
});
const greetMsg = ref("");
const mouseTarget = reactive({ x: 0, y: 0 });

const moveTo = async () => {
  greetMsg.value = await invoke("mouse_move_to", {
    x: +mouseTarget.x,
    y: +mouseTarget.y,
  });
};

const moveClick = async () => {
  greetMsg.value = await invoke("mouse_move_click", {
    x: +mouseTarget.x,
    y: +mouseTarget.y,
    isLeft: true,
  });
};
const anyValue = ref("");
const testInputText = async () => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  greetMsg.value = await invoke("input_text", {
    text: anyValue.value,
  });
};
const testInputKey = async () => {
  try {
    const value: any = await invoke("input_key", {
      key: anyValue.value,
    });
    greetMsg.value = value;
  } catch (e: any) {
    const msg = {
      code: 500,
      message: "error:不支持的按键" + anyValue.value,
    };
    greetMsg.value = JSON.stringify(msg);
  }
};
const keyUp = async () => {
  try {
    greetMsg.value = await invoke("key_up", {
      key: anyValue.value,
    });
  } catch (error) {
    const msg = {
      code: 500,
      message: "error:不支持的按键" + anyValue.value,
    };
    greetMsg.value = JSON.stringify(msg);
  }
};
const keyDown = async () => {
  try {
    greetMsg.value = await invoke("key_down", {
      key: anyValue.value,
    });
  } catch (error) {
    const msg = {
      code: 500,
      message: "error:不支持的按键" + anyValue.value,
    };
    greetMsg.value = JSON.stringify(msg);
  }
};
</script>

<template>
  <div class="test">
    <div>position: {{ pos.x }} ,{{ pos.y }}</div>
    <el-input v-model="anyValue" placeholder="anyValue" />
    <el-input v-model="mouseTarget.x" placeholder="x" />
    <el-input v-model="mouseTarget.y" placeholder="y" />

    <el-button @click="moveTo">moveTo</el-button
    ><el-button @click="moveClick">moveClick</el-button>
    <el-button @click="testInputText">testInputText</el-button>
    <el-button @click="testInputKey">testInputKey</el-button>
    <el-button @click="keyUp">keyUp</el-button>
    <el-button @click="keyDown">keyDown</el-button>
    <p>{{ greetMsg }}</p>
    <el-button @click="toggleDark()">toggleDark:{{ isDark }}</el-button>
  </div>
</template>

<style lang="scss">
.test {
  display: flex;
  flex-direction: column;
  // justify-items: center;
  // align-items: center;
  .el-button + .el-button {
    margin: 1px;
  }
}
</style>
