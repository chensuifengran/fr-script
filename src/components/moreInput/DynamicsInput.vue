<template>
  <div class="dynamics-input" v-if="
    dynamicDialog.title === name &&
    displayConditionIsOk
  " v-show="(!onlyTest || (onlyTest && dynamicDialog.callType === 'test')) &&
    !(noTest && dynamicDialog.callType === 'test')
    ">
    <span class="label" v-if="argItem?.label && !notShowType.includes(argItem.componentType)">
      {{ argItem.label }}
    </span>
    <template v-if="argItem && argItem.componentType === 'select'">
      <el-select class="input" v-model="model" filterable :multiple="argItem.multiple" :clearable="argItem.multiple"
        :allow-create="!argItem.notAllowCreate" default-first-option :placeholder="argItem.placeholder || '请选择'">
        <el-option v-for="item in (argItem as ArgItem<DialogArg.Select>).options" :key="item"
          :label="parseOption(item).label" :disabled="disabled" :value="parseOption(item).value"></el-option>
      </el-select>
    </template>
    <template v-else-if="
      argItem &&
      argItem.componentType === 'FileInput' &&
      (typeof model === 'string' || Array.isArray(model))
    ">
      <FileInput v-model="model" :disabled="disabled" :label="argItem.label" :verify="argItem.verifyPath"
        :multiple="argItem.multiple" />
    </template>
    <template v-else-if="
      argItem && argItem.componentType === 'RectInput' && typeof model === 'object'
    ">
      <RectInput v-model="model" :disabled="disabled" :target-src="targetSrc" />
    </template>
    <template v-else-if="
      argItem && argItem.componentType === 'slider' && typeof model === 'number'
    ">
      <SliderInput v-model="model" :disabled="disabled" :max="argItem.range?.max" :min="argItem.range?.min"
        :step="argItem.range?.step" :label="argItem.label" size="small" />
    </template>
    <template v-else-if="
      argItem && argItem.componentType === 'switch' && typeof model === 'boolean'
    ">
      <el-switch v-model="model" :disabled="disabled" :active-text="argItem.activeText || '是'"
        :inactive-text="argItem.inactiveText || '否'" size="small" />
    </template>
    <template v-else-if="
      argItem && argItem.componentType === 'DirInput' && typeof model === 'string'
    ">
      <DirInput v-model="model" :disabled="disabled" :label="argItem.label" :suffix="argItem.suffix || ''"
        :verify="argItem.verifyPath" />
    </template>
    <template v-else-if="
      argItem && argItem.componentType === 'numberInput' && typeof model === 'number'
    ">
      <el-input-number class="input" v-model="model" :disabled="disabled" :value-on-clear="0" size="small" />
    </template>
    <template v-else-if="
      argItem && argItem.componentType === 'input' && typeof model === 'string'
    ">
      <el-input v-model="model" :disabled="disabled" size="small">
        <template #prepend> {{ argItem.label }} </template>
      </el-input>
    </template>
    <template v-else-if="
      argItem &&
      argItem.componentType === 'numberRangeInput' &&
      typeof model === 'object'
    ">
      <RangeInput v-model="model" :disabled="disabled" />
    </template>
  </div>
</template>
<script lang="ts" setup>
const { dynamicDialog } = useCore();
const listStore = useListStore();
const notShowType = ["input", "FileInput", "DirInput", "slider"];
const notFlexType = ["input", "FileInput", "DirInput", "RectInput"];
const parseOption = (item: string | number) => {
  const separator = (argItem.value as ArgItem<DialogArg.Select>)?.selectOptionSeparator;
  if (typeof item === "number" || !separator) {
    return {
      label: item,
      value: item,
    };
  }
  const arr = item.split(separator);
  return {
    label: arr[0],
    value: arr[1] || arr[0],
  };
};

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
    type: [String, Number, Boolean, Object, Array<number>],
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});


const argItem = computed(() => {
  const invokeApiTarget = getInvokeApiMethods().find((item) => item.name === props.name)
    ?.testModule;
  if (invokeApiTarget) {
    const dialog = invokeApiTarget.dialog;
    dialog.args?.forEach((arg) => {
      //@ts-ignore
      if (arg?.options) {
        //@ts-ignore
        if (typeof arg.options === "function") {
          //@ts-ignore
          arg.options = arg.options(listStore);
        }
      }
    });
    return dialog.args!.find((item) => item.name === props.argName);
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
  //@ts-ignore
  const targetName = argItem.value?.targetSrc;
  const invokeApiTarget = getInvokeApiMethods().find((item) => item.name === props.name)
    ?.testModule;
  if (invokeApiTarget && targetName) {
    const dialog = invokeApiTarget.dialog;
    const targetArg = dialog.args!.find(
      (item) => item.name === targetName
    );
    if (targetArg) {
      return targetArg.value as string;
    }
  }
  return "";
});

const displayConditionIsOk = computed(() => {
  const conditionFieldNameArr = argItem.value?.displayCondition;
  if (conditionFieldNameArr?.length) {
    const testModule = getInvokeApiMethods().find((item) => item.name === props.name)
      ?.testModule;
    if (testModule) {
      const dialog = testModule.dialog;
      for (let conditionFieldName of conditionFieldNameArr) {
        const fieldValue = dialog.args!.find(
          (item) => item.name === conditionFieldName
        )?.value;
        if (fieldValue === undefined || !Boolean(fieldValue)) {
          return false;
        }
      }
      return true;
    }
    console.error(`未找到${props.name}的测试模块`);
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
  const invokeApiTestMethods = getInvokeApiMethods();
  const t = invokeApiTestMethods.find((i) => i.name === props.name);
  t && (target = t);
  if (target) {
    const dialog = target.testModule?.dialog;
    if (dialog) {
      dialog.args?.forEach((arg) => {
        //@ts-ignore
        if (arg.options) {
          //@ts-ignore
          if (typeof arg.options === "function") {
            //@ts-ignore
            arg.options = arg.options(listStore);
          }
        }
      });
    }
    const arg = dialog?.args!.find(
      (item) => item.name === props.argName
    );
    if (arg) {
      arg.value = val as any;
    }
  }
});
const { appBackground } = useAppTheme();
</script>

<style lang="scss" scoped>
.dynamics-input {
  margin-bottom: 5px;
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

  .input {
    max-width: 150px;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>
