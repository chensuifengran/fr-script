<template>
  <GeneralDialog v-model="dynamicDialog.show" :title="dynamicDialog.title" :content="dynamicDialog.content"
    :callback="dynamicDialog.callback" :isTestModule="true">
    <template #element>
      <div v-for="m in invokeApiTestModules">
        <DynamicsInput v-for="a in m?.dialog?.args" :key="m!.dialog?.targetMethodName + a.name"
          :name="m!.dialog?.targetMethodName || ''" :argName="a.name" :value="a.value"
          :only-test="a.onlyTest ? true : false" :no-test="a.noTest ? true : false" />
      </div>
    </template>
  </GeneralDialog>
</template>

<script setup lang="ts">
const { dynamicDialog, builtInApiTestModules } = useCore();
const listStore = useListStore();
const invokeApiTestModules = computed(() => {
  const oriModules = builtInApiTestModules.value;
  oriModules.forEach((m) => {
    m?.dialog.args?.forEach((a) => {
      //@ts-ignore
      if (a.options) {
        //@ts-ignore
        if (typeof a.options === "function") {
          //@ts-ignore
          a.options = a.options(listStore);
        }
      }
    });
  });
  return oriModules;
});
</script>

<style lang="scss" scoped></style>
<style lang="scss"></style>
