<template>
  <!-- 单输入框dialog -->
  <el-dialog
    v-model="visibleValue"
    :title="title"
    @close="closeDialog"
    @keyup.enter="callback"
    draggable
    top="10vh"
    width="70%"
    class="general-dialog"
  >
    <div v-if="content">
      <span v-if="!isTestModule">{{ content }}</span
      ><el-alert v-else :title="content" :closable="false" type="info" show-icon />
    </div>
    <div class="fields">
      <slot name="element" />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="callback"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { PropType } from "vue";
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: "",
  },
  isTestModule: {
    type: Boolean,
    default: false,
  },
  title: { type: String },
  content: { type: String },
  callback: { type: Function as PropType<(e?: any) => Promise<void> | void> },
});
const visibleValue = ref(props.modelValue);
watchEffect(() => {
  visibleValue.value = props.modelValue;
});
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
const closeDialog = () => {
  visibleValue.value = false;
  emit("update:modelValue", false);
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
