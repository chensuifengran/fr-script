<template>
  <GeneralDialog
    v-model="dialogModule.show"
    :title="dialogModule.title"
    :content="dialogModule.content"
    :callback="dialogModule.callback"
    :isTestModule="true"
  >
    <template #element>
      <div v-for="m in invokeApiTestModules">
        <DynamicsInput
          v-for="a in m?.dialog.args"
          :key="m!.dialog.targetMethodName + a.name"
          :name="m!.dialog.targetMethodName"
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
const {
  getInvokeApiDialogModule,
  getInvokeApiTestModules,
} = useInvokeApiMethodsRegister();

const dialogModule = computed(() => getInvokeApiDialogModule());

const invokeApiTestModules = computed(() => getInvokeApiTestModules());
</script>

<style lang="scss" scoped></style>
<style lang="scss"></style>
