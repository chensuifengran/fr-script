<script setup lang="ts">
import { invoke } from "@tauri-apps/api/tauri";
const loading = ref(false);
const isDark = inject<globalThis.WritableComputedRef<boolean>>("isDark")!;
const toggleDark = useToggle(isDark);
const pos = reactive({
  x: 0,
  y: 0,
});
const ocrDisable = ref(true);
onMounted(() => {
  ocrDisable.value = false;
  loading.value = true;
  (invoke("init", { gpuMem: 0 }) as Promise<boolean>)
    .then((res: boolean) => {
      if (res) {
        ElMessage({
          message: "初始化成功.",
          type: "success",
        });
        ocrDisable.value = false;
      } else {
        ElMessage({
          message: "初始化失败.",
          type: "error",
        });
        ocrDisable.value = true;
      }
    })
    .catch((e) => {
      console.log(e);
      ElMessage({
        message: "初始化失败.",
        type: "error",
      });
      ocrDisable.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
  setInterval(async () => {
    const position = (await invoke("mouse_get_pos")) as any;
    const { x, y } = JSON.parse(position).message;
    pos.x = x;
    pos.y = y;
  }, 100);
});
const greetMsg = ref("");
const mouseTarget = reactive({ x: 0, y: 0 });
const wh = reactive({ w: 0, h: 0 });

const moveTo = async () => {
  greetMsg.value = await invoke("mouse_move_to", {
    x: +mouseTarget.x,
    y: +mouseTarget.y,
  });
};

const moveRelative = async () => {
  greetMsg.value = await invoke("mouse_move_relative", {
    x: +mouseTarget.x,
    y: +mouseTarget.y,
  });
};
const mouseWheel = async () => {
  greetMsg.value = await invoke("mouse_wheel", {
    delta: +mouseTarget.x,
  });
};
const cropPicture = async () => {
  console.time("crop_picture");
  greetMsg.value = await invoke("crop_picture", {
    path: anyValue.value,
    x: +mouseTarget.x,
    y: +mouseTarget.y,
    width: +wh.w,
    height: +wh.h,
    outPath: "E:\\test_crop.png",
  });
  console.timeEnd("crop_picture");
};

const getImgSize = async () => {
  console.time("get_img_size");
  greetMsg.value = await invoke("get_img_size", {
    path: anyValue.value,
  });
  console.timeEnd("get_img_size");
};

const getSimilarityValue = async () => {
  console.time("get_similarity_value");
  greetMsg.value = await invoke("get_similarity_value", {
    pathA: anyValue.value,
    x: -1,
    y: 0,
    width: 0,
    height: 0,
    pathB: "E:\\temp.png",
  });
  console.timeEnd("get_similarity_value");
};
const matchTemplate = async () => {
  console.time("match_template");
  greetMsg.value = await invoke("match_template", {
    imgPath: anyValue.value,
    tempPath: "E:\\temp.png",
    exactValue: 0,
    scale: 1,
  });
  console.timeEnd("match_template");
};
const getImgRectInfo = async () => {
  console.time("get_img_rect_info");
  if (anyValue.value.trim() === "") {
    const msg = {
      code: 500,
      message: "error:imgPath不能为空",
    };
    greetMsg.value = JSON.stringify(msg);
    return;
  }
  greetMsg.value = await invoke("get_img_rect_info", {
    imgPath: anyValue.value,
  });
  console.timeEnd("get_img_rect_info");
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

const getScreenSize = () => {
  setInterval(async () => {
    console.time("get_screen_size");
    greetMsg.value = await invoke("get_screen_size");
    console.timeEnd("get_screen_size");
  }, 200);
};

const getScreenZoom = async () => {
  console.time("get_screen_zoom");
  greetMsg.value = await invoke("get_screen_zoom");
  console.timeEnd("get_screen_zoom");
};

const screenshot = async () => {
  console.time("screenshot");
  // console.log({
  //   path: anyValue.value,
  //   x: +mouseTarget.x,
  //   y: +mouseTarget.y,
  //   w: +wh.w,
  //   h: +wh.h,
  // });

  greetMsg.value = await invoke("screenshot", {
    path: anyValue.value,
    x: +mouseTarget.x,
    y: +mouseTarget.y,
    w: +wh.w,
    h: +wh.h,
  });
  console.timeEnd("screenshot");
};

const getScreenRectInfo = async () => {
  console.time("get_screen_rect_info");
  greetMsg.value = await invoke("get_screen_rect_info");
  console.timeEnd("get_screen_rect_info");
};

const screenMatchTemplate = async () => {
  console.time("screen_match_template");
  greetMsg.value = await invoke("screen_match_template", {
    x: -1,
    y: 0,
    width: 250,
    height: 150,
    tempPath: "E:\\test.png",
    exactValue: 0,
    scale: 1,
    drive: "E",
  });
  console.timeEnd("screen_match_template");
};

const screenDiffTemplates = async () => {
  console.time("screen_diff_templates");
  greetMsg.value = await invoke("screen_diff_templates", {
    x: -1,
    y: 0,
    width: 250,
    height: 150,
    tempPaths: "E:\\test.png|E:\\test2.png",
    targetIndex: 0,
    drive: "E",
  });
  console.log(JSON.parse(greetMsg.value));

  console.timeEnd("screen_diff_templates");
};

const ocr = async () => {
  console.time("ocr");
  console.log(
    await invoke("ocr", {
      imgPath: "E:\\t3.png",
    })
  );
  console.timeEnd("ocr");
};
//   let num = 0;
//   while (num++ < 100) {
//     // console.log(await invoke("get_dependence_version"));

//   }
// };

const screen_ocr = async () => {
  console.time("screen_ocr");
  greetMsg.value = await invoke("screen_ocr", {
    x: 0,
    y: 0,
    width: 300,
    height: 300,
    // onlyText: true,
  });
  console.timeEnd("screen_ocr");
  // console.log(
  //   await invoke("screen_ocr", {
  //     x: 0,
  //     y: 0,
  //     width: 200,
  //     height: 200,
  //   })
  // );
};

const screen_ocr_contains = async () => {
  const texts = "asndiwhaidnwia";
  console.time("screen_ocr_contains");
  greetMsg.value =
    "" +
    (await invoke("screen_ocr_contains", {
      x: -1,
      y: 0,
      width: 90,
      height: 30,
      texts,
    }));
  console.timeEnd("screen_ocr_contains");
};
</script>

<template>
  <div
    class="test"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="OCR服务初始化中..."
  >
    <el-input v-model="greetMsg" autosize type="textarea" placeholder="输出" />
    <div>position: {{ pos.x }} ,{{ pos.y }}</div>

    <el-button-group>
      <el-button @click="moveTo">moveTo</el-button
      ><el-button @click="moveClick">moveClick</el-button>
      <el-button @click="testInputText">testInputText</el-button>
      <el-button @click="testInputKey">testInputKey</el-button>
      <el-button @click="keyUp">keyUp</el-button>
      <el-button @click="keyDown">keyDown</el-button>
      <el-button @click="toggleDark()">toggleDark:{{ isDark }}</el-button>
    </el-button-group>
    <el-button-group>
      <el-button @click="getScreenSize">getScreenSize</el-button>
      <el-button @click="screenshot">screenshot</el-button>
      <el-button @click="getScreenZoom">getScreenZoom</el-button>
      <el-button @click="getScreenRectInfo">getScreenRectInfo</el-button>
      <el-button @click="screenMatchTemplate">screenMatchTemplate</el-button>
    </el-button-group>
    <el-button-group>
      <el-button @click="screenDiffTemplates">screenDiffTemplates</el-button>
      <el-button @click="cropPicture">cropPicture</el-button>
      <el-button @click="getImgSize">getImgSize</el-button>
      <el-button @click="getSimilarityValue">getSimilarityValue</el-button>
      <el-button @click="matchTemplate">matchTemplate</el-button>
    </el-button-group>
    <el-button-group>
      <el-button @click="getImgRectInfo">getImgRectInfo</el-button>
      <el-button @click="mouseWheel">mouseWheel</el-button>
      <el-button @click="moveRelative">moveRelative</el-button>
      <el-button @click="ocr" :disabled="ocrDisable">ocr</el-button>
      <el-button @click="screen_ocr" :disabled="ocrDisable">screen_ocr</el-button>
      <el-button @click="screen_ocr_contains" :disabled="ocrDisable"
        >screen_ocr_contains</el-button
      >
    </el-button-group>
    <el-input v-model="anyValue" placeholder="anyValue" />
    <el-input v-model="mouseTarget.x" placeholder="x" />
    <el-input v-model="mouseTarget.y" placeholder="y" />
    <el-input v-model="wh.w" placeholder="w" />
    <el-input v-model="wh.h" placeholder="h" />
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
