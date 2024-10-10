<template>
  <div
    ref="header-wrap"
    class="header-wrap"
    w-full
    flex
    flex-row
    items-center
    justify-between
    box-border
    :data-tauri-drag-region="props.allowDrag"
  >
    <div class="content">
      <el-button class="btn-return" link @click="goBack"
        ><return-icon
      /></el-button>
      <div class="line"></div>
      <slot name="before" />
      <el-text truncated>{{ props.title }}</el-text>
      <slot name="after" />
    </div>
    <div id="header-extra" ref="extra">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
const headerWarp = useTemplateRef("header-wrap");
const extraRef = useTemplateRef("extra");
const contentWidth = ref("auto");
const props = defineProps({
  allowDrag: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "",
  },
  height: {
    type: [String, Number],
    default: 40,
  },
});
const warpHeight = computed(() => {
  if (typeof props.height === "string") {
    return props.height;
  } else {
    return props.height + "px";
  }
});
const pointerEvents = computed(() => (props.allowDrag ? "none" : "all"));
const cursor = computed(() => (props.allowDrag ? "move" : "auto"));
const emit = defineEmits(["back"]);
const goBack = () => {
  emit("back");
};
onMounted(() => {
  const ww = headerWarp.value?.offsetWidth || 0;
  const ew = extraRef.value?.offsetWidth || 0;
  contentWidth.value = Math.floor(ww - ew - 10) + "px";
});
</script>

<style lang="scss" scoped>
.header-wrap {
  cursor: v-bind(cursor);
  height: v-bind(warpHeight);
}
.content {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: v-bind(contentWidth);
  pointer-events: v-bind(pointerEvents);
  .btn-return {
    pointer-events: all;
  }
  .line {
    width: 1px;
    height: 20px;
    background: var(--el-color-info-light-7);
    margin: 5px;
  }
}
#header-extra {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  height: 100%;
  cursor: auto;
  .btns {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    margin-right: 10px;
    .dragable {
      flex: 1;
      height: 100%;
      height: 35px;
    }
  }
}
</style>
