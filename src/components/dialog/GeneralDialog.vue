<template>
  <el-dialog
    v-model="model"
    :title="props.title"
    @close="closeHandle"
    @keyup.enter="props.callback"
    :draggable="draggable"
    :top="top"
    :width="width"
    class="general-dialog"
  >
    <div v-if="props.content">
      <span v-if="!props.isTestModule">{{ props.content }}</span
      ><el-alert
        v-else
        :title="props.content"
        :closable="false"
        type="info"
        show-icon
      />
    </div>
    <div class="fields">
      <slot name="element" />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeHandle">{{ cancelText }}</el-button>
        <el-button type="primary" @click="props.callback">{{
          confirmText
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({
  default: false,
});

const props = defineProps({
  isTestModule: {
    type: Boolean,
    default: false,
  },
  title: { type: String },
  content: { type: String },
  callback: {
    type: Function as PropType<(e?: MouseEvent) => Promise<void> | void>,
  },
  cancel: {
    type: Function as PropType<(e?: MouseEvent) => Promise<void> | void>,
  },
  cancelText: {
    type: String,
    default: "取消",
  },
  confirmText: {
    type: String,
    default: "确定",
  },
  width: {
    type: String,
    default: "70%",
  },
  minWidth:{
    type: String,
    default: "700px"
  },
  top: {
    type: String,
    default: "10vh",
  },
  draggable: {
    type: Boolean,
    default: true,
  },
});

const closeHandle = (e: MouseEvent) => {
  if (!props.cancel) {
    model.value = false;
  } else {
    props.cancel(e);
  }
};

const width = computed(()=>{
  if(IS_PLAYGROUND_ENV){
    return '45vw'
  }
  return props.width
})

const minWidth = computed(()=>props.minWidth)
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.general-dialog {
  min-width: v-bind(minWidth);
  .el-dialog__body {
    padding-top: 0;
  }
  .fields {
    padding: 5px;
    box-sizing: border-box;
  }
}
</style>
