<template>
  <el-dialog
    v-model="model"
    :title="props.title"
    @close="closeDialog"
    @keyup.enter="props.callback"
    draggable
    top="10vh"
    width="70%"
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
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="props.callback"> 确定 </el-button>
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
  callback: { type: Function as PropType<(e?: any) => Promise<void> | void> },
});
const closeDialog = () => {
  model.value = false;
};
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.general-dialog {
  .el-dialog__body {
    padding-top: 0;
  }
  .fields {
    padding: 5px;
    box-sizing: border-box;
  }
}
</style>
