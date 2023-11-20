<template>
  <div
    class="dynamics-input"
    v-if="
      (type === 'invokeApi' ? invokeApiDialogModule.title === name : false) &&
      displayConditionIsOk
    "
    v-show="
      (!onlyTest || (onlyTest && invokeApiDialogModule.callType === 'test')) &&
      !(noTest && invokeApiDialogModule.callType === 'test')
    "
  >
    <span
      class="label"
      v-if="argItem?.label && !notShowType.includes(argItem.componentType)"
    >
      {{ argItem.label }}
    </span>
    <template v-if="argItem && argItem.componentType === 'select'">
      <el-select
        v-model="model"
        filterable
        allow-create
        default-first-option
        :placeholder="argItem.placeholder || '请选择'"
      >
        <el-option
          v-for="item in argItem.options"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </template>
    <template
      v-else-if="
        argItem && argItem.componentType === 'FileInput' && typeof model === 'string'
      "
    >
      <FileInput v-model="model" :label="argItem.label" :dis-check="true" />
    </template>
    <template
      v-else-if="
        argItem && argItem.componentType === 'RectInput' && typeof model === 'object'
      "
    >
      <RectInput v-model="model" :target-src="targetSrc" />
    </template>
    <template
      v-else-if="
        argItem && argItem.componentType === 'slider' && typeof model === 'number'
      "
    >
      <el-slider
        v-model="model"
        :max="argItem.range?.max"
        :min="argItem.range?.min"
        :step="argItem.range?.step"
        size="small"
      />
    </template>
    <template
      v-else-if="
        argItem && argItem.componentType === 'switch' && typeof model === 'boolean'
      "
    >
      <el-switch
        v-model="model"
        :active-text="argItem.activeText || '是'"
        :inactive-text="argItem.inactiveText || '否'"
      />
    </template>
    <template
      v-else-if="
        argItem && argItem.componentType === 'DirInput' && typeof model === 'string'
      "
    >
      <DirInput
        v-model="model"
        :label="argItem.label"
        :suffix="argItem.suffix || ''"
        :mountedValue="argItem.mountedValue || ''"
      />
    </template>
    <template
      v-else-if="
        argItem && argItem.componentType === 'numberInput' && typeof model === 'number'
      "
    >
      <el-input-number v-model="model" :value-on-clear="0" />
    </template>
    <template
      v-else-if="
        argItem && argItem.componentType === 'input' && typeof model === 'string'
      "
    >
      <el-input v-model="model">
        <template #prepend> {{ argItem.label }} </template>
      </el-input>
    </template>
    <template
      v-else-if="
        argItem &&
        argItem.componentType === 'numberRangeInput' &&
        typeof model === 'object'
      "
    >
      <RangeInput v-model="model" />
    </template>
  </div>
</template>
<script lang="ts" setup>
const { getInvokeApiMethods, getInvokeApiDialogModule } = useInvokeApiMethodsRegister();

const notShowType = ["input", "FileInput", "DirInput"];
const notFlexType = ["input", "FileInput", "DirInput", "slider", "RectInput"];

const invokeApiDialogModule = getInvokeApiDialogModule();
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  argName: {
    type: String,
    required: true,
  },
  onlyTest: {
    type: Boolean,
    default: false,
  },
  noTest: {
    type: Boolean,
    default: false,
  },
  value: {
    type: [String, Number, Boolean, Object],
    required: true,
  },
  type: {
    type: String as PropType<"invokeApi" | "util">,
    default: "invokeApi",
  },
});
onMounted(() => {
  console.log(
    "DynamicsInput",
    argItem.value,
    argItem.value?.componentType === "numberInput",
    typeof model.value
  );
});
const name = computed(() => {
  if (props.type === "invokeApi") {
    return (
      getInvokeApiMethods().find((i) => i.name === props.name)?.exportFn?.alias ||
      props.name
    );
  } else {
    // return (
    //   getUtilMethods().find((item) => item.name === props.name)?.exportFn?.alias ||
    //   props.name
    // );
  }
});

const argItem = computed(() => {
  const invokeApiTarget = getInvokeApiMethods().find((item) => item.name === props.name)
    ?.testModule;
  if (props.type === "invokeApi" && invokeApiTarget) {
    return invokeApiTarget.dialog.args!.find((item) => item.name === props.argName);
  }
  return undefined;
});
const display = computed(() => {
  const item = argItem.value;
  if (item && notFlexType.includes(item.componentType)) {
    return "block";
  } else {
    return "flex";
  }
});
const targetSrc = computed(() => {
  const targetName = argItem.value?.targetSrc;
  const invokeApiTarget = getInvokeApiMethods().find((item) => item.name === props.name)
    ?.testModule;
  if (invokeApiTarget && targetName) {
    const targetArg = invokeApiTarget.dialog.args!.find(
      (item) => item.name === targetName
    );
    if (targetArg) {
      return targetArg.value;
    }
  }
  return "";
});

const displayConditionIsOk = computed(() => {
  const conditionFieldName = argItem.value?.displayCondition;
  if (conditionFieldName) {
    const testModule = getInvokeApiMethods().find((item) => item.name === props.name)
      ?.testModule;
    if (testModule) {
      let fieldValue = (testModule.dialog as any)[conditionFieldName];
      if (fieldValue === undefined) {
        fieldValue = testModule.dialog.args!.find(
          (item) => item.name === conditionFieldName
        )?.value;
      }
      if (fieldValue !== undefined) {
        return Boolean(fieldValue) || false;
      }
    } else {
      console.error(`未找到${props.name}的测试模块`);
    }
    return false;
  } else {
    return true;
  }
});

const model = ref(props.value);
watch(
  () => props.value,
  (val) => {
    model.value = val;
  }
);
watch(model, (val, oldValue) => {
  if (val === 0 && oldValue === null) {
    return;
  }
  //如果val是null，则根据组件类型设置默认值(省略一些不可能为null的组件类型)
  const strTypes = ["input", "select", "FileInput", "DirInput"];
  const aType = argItem.value?.componentType;
  if (val === null) {
    if (argItem.value?.componentType === "numberInput") {
      val = 0;
      model.value = 0;
    } else if (aType && strTypes.includes(aType)) {
      val = "";
      model.value = "";
    } else if (argItem.value?.componentType === "RectInput") {
      val = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
      model.value = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }
  }
  let target: InvokeApiMethodType | undefined;
  if (props.type === "invokeApi") {
    const invokeApiTestMethods = getInvokeApiMethods();
    const t = invokeApiTestMethods.find((i) => i.name === props.name);
    t && (target = t);
  }

  if (target) {
    const arg = target.testModule?.dialog.args!.find(
      (item) => item.name === props.argName
    );
    if (arg) {
      arg.value = val;
    }
  }
});
const appBackground = inject<globalThis.ComputedRef<"#000" | "#fff">>("appBackground");
</script>

<style lang="scss" scoped>
.dynamics-input {
  margin-bottom: 10px;
  padding: 5px;
  box-sizing: border-box;
  background: v-bind(appBackground);
  border-radius: 5px;
  display: v-bind(display);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .label {
    width: 200px;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>
