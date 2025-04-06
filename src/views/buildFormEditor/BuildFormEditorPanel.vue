<template>
  <el-drawer
    v-model="visible"
    title="表单编辑器(右键分组或组件增删改,左键长按拖动进行排序)"
    direction="rtl"
    size="70%"
    :before-close="handleClose"
  >
    <async-form-render-editor v-model="formData" />
  </el-drawer>
</template>
<script lang="ts" setup>
import Loading from "../../components/Loading.vue";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
const AsyncFormRenderEditor = defineAsyncComponent({
  loader: () => import("./FormRenderEditor.vue"),
  loadingComponent: Loading,
});
const { formData } = useRenderItemEditForm();
const visible = AutoTipUtils.buildFormEditorVisible;
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("是否应用修改?", {
    confirmButtonText: "应用",
    cancelButtonText: "取消",
  })
    .then(() => {
      const { dynamicDialog } = useCore();
      dynamicDialog.callback();
      done();
    })
    .catch(() => {
      done();
    });
};
watch(
  () => formData.value,
  (newData) => {
    const dialogArg = getInvokeApiMethods().find(
      (item) => item.name === "buildForm"
    )!.testModule!.dialog.args!;
    if (
      dialogArg[0] !== undefined &&
      dialogArg[0].componentType === "buildFormEditor"
    ) {
      dialogArg[0].value = renderForm2buildForm(
        newData.sort((a: any, b: any) => {
          return a.idx - b.idx;
        })
      );
    }
  },
  { deep: true }
);
const getFormData = () => {
  const dialogArg = getInvokeApiMethods().find(
    (item) => item.name === "buildForm"
  )!.testModule!.dialog.args!;
  if (
    dialogArg[0] !== undefined &&
    dialogArg[0].componentType === "buildFormEditor"
  ) {
    const res = buildForm2renderForm(dialogArg[0].value);
    formData.value = res.sort((a: any, b: any) => {
      return a.idx - b.idx;
    });
  }
};
watch(visible, () => {
  if (visible.value) {
    getFormData();
  }
});
</script>

<style lang="scss" scoped></style>
