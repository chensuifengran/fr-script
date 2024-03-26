<template>
  <GeneralDialog
    v-model="dynamicDialog.show"
    :title="dynamicDialog.title"
    :content="dynamicDialog.content"
    :callback="dynamicDialog.callback"
    :isTestModule="true"
  >
    <template #element>
      <div v-for="m in invokeApiTestModules">
        <DynamicsInput
          v-for="a in m?.dialog?.args"
          :key="m!.dialog?.targetMethodName + a.name"
          :name="m!.dialog?.targetMethodName || ''"
          :argName="a.name"
          :value="a.value"
          :only-test="a.onlyTest ? true : false"
          :no-test="a.noTest ? true : false"
          type="invokeApi"
        />
      </div>
    </template>
  </GeneralDialog>
</template>

<script setup lang="ts">
const { dynamicDialog, getBuiltInApiTestModules } = useCore();
const listStore = useListStore();
const invokeApiTestModules = computed(() => {
  const oriModules = getBuiltInApiTestModules();
  oriModules.forEach((m) => {
    m?.dialog.args?.forEach((a) => {
      if (a.options) {
        if (typeof a.options === "function") {
          a.options = a.options(listStore);
        }
      }
    });
  });
  return oriModules;
  // return oriModules.map((m) => {
  //   let dialog = m?.dialog;
  //   if (dialog) {
  //     dialog = {
  //       ...dialog,
  //       args: dialog?.args?.map((arg) => {
  //         let opts = arg.options;
  //         if (opts) {
  //           if (typeof opts === "function") {
  //             opts = opts(listStore);
  //           }
  //         }
  //         return {
  //           ...arg,
  //           options: opts,
  //         };
  //       }),
  //     };
  //   }
  //   return {
  //     ...m,
  //     dialog,
  //   };
  // });
});
</script>

<style lang="scss" scoped></style>
<style lang="scss"></style>
