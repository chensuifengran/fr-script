<template>
  <div
    class="dynamics-input"
    v-if="dynamicDialog.title === name && displayConditionIsOk"
    v-show="
      (!onlyTest || (onlyTest && dynamicDialog.callType === 'test')) &&
      !(noTest && dynamicDialog.callType === 'test')
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
        class="input"
        v-model="argItem.value"
        filterable
        :multiple="argItem.multiple"
        :clearable="argItem.multiple"
        :allow-create="!argItem.notAllowCreate"
        default-first-option
        :placeholder="argItem.placeholder || '请选择'"
      >
        <el-option
          v-for="item in argItem.options"
          :key="item"
          :label="parseOption(item).label"
          :disabled="disabled"
          :value="parseOption(item).value"
        ></el-option>
      </el-select>
    </template>
    <template v-else-if="argItem && argItem.componentType === 'fileInput'">
      <file-input
        v-model="argItem.value"
        :disabled="disabled"
        :label="argItem.label"
        :verify="argItem.verifyPath"
        :multiple="argItem.multiple"
      />
    </template>
    <template v-else-if="argItem && argItem.componentType === 'rectInput'">
      <rect-input
        v-model="argItem.value"
        :disabled="disabled"
        :target-src="targetSrc"
      />
    </template>
    <template v-else-if="argItem && argItem.componentType === 'slider'">
      <slider-input
        v-model="argItem.value"
        :disabled="disabled"
        :max="argItem.range?.max"
        :min="argItem.range?.min"
        :step="argItem.range?.step"
        :label="argItem.label"
        size="small"
      />
    </template>
    <template v-else-if="argItem && argItem.componentType === 'switch'">
      <el-switch
        v-model="argItem.value"
        :disabled="disabled"
        :active-text="argItem.activeText || '是'"
        :inactive-text="argItem.inactiveText || '否'"
        size="small"
      />
    </template>
    <template v-else-if="argItem && argItem.componentType === 'dirInput'">
      <dir-input
        v-model="argItem.value"
        :disabled="disabled"
        :label="argItem.label"
        :suffix="argItem.suffix || ''"
        :verify="argItem.verifyPath"
      />
    </template>
    <template v-else-if="argItem && argItem.componentType === 'numberInput'">
      <el-input-number
        class="input"
        v-model="argItem.value"
        :disabled="disabled"
        :value-on-clear="0"
        size="small"
      />
    </template>
    <template v-else-if="argItem && argItem.componentType === 'input'">
      <el-input v-model="argItem.value" :disabled="disabled" size="small">
        <template #prepend> {{ argItem.label }} </template>
      </el-input>
    </template>
    <template
      v-else-if="argItem && argItem.componentType === 'numberRangeInput'"
    >
      <range-input v-model="argItem.value" :disabled="disabled" />
    </template>
  </div>
</template>
<script lang="ts" setup>
const { dynamicDialog } = useCore();
const listStore = useListStore();
const notShowType = ["input", "fileInput", "dirInput", "slider"];
const notFlexType = ["input", "fileInput", "dirInput", "rectInput"];
const parseOption = (item: string | number) => {
  const separator = (argItem.value as ArgItem<DialogArg.Select>)
    ?.selectOptionSeparator;
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
  disabled: {
    type: Boolean,
    default: false,
  },
});

const argItem = computed(() => {
  const invokeApiTarget = getInvokeApiMethods().find(
    (item) => item.name === props.name
  )?.testModule;
  if (invokeApiTarget) {
    const dialog = invokeApiTarget.dialog;
    dialog.args?.forEach((arg) => {
      if ("options" in arg) {
        if (typeof arg.options === "function") {
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
  if (argItem.value && "targetSrc" in argItem.value) {
    const targetName = argItem.value.targetSrc;
    const invokeApiTarget = getInvokeApiMethods().find(
      (item) => item.name === props.name
    )?.testModule;
    if (invokeApiTarget && targetName) {
      const dialog = invokeApiTarget.dialog;
      const targetArg = dialog.args!.find((item) => item.name === targetName);
      if (targetArg) {
        return targetArg.value as string;
      }
    }
  }
  return "";
});

const displayConditionIsOk = computed(() => {
  const conditionFieldNameArr = argItem.value?.displayCondition;
  if (conditionFieldNameArr?.length) {
    const testModule = getInvokeApiMethods().find(
      (item) => item.name === props.name
    )?.testModule;
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

onMounted(() => {
  const strTypes = ["input", "select", "fileInput", "dirInput"];
  if (argItem.value?.componentType === "numberInput") {
    argItem.value!.value = argItem.value!.value || 0;
  } else if (argItem.value?.componentType === "rectInput") {
    argItem.value!.value = argItem.value!.value || {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  } else if (
    argItem.value?.componentType &&
    strTypes.includes(argItem.value?.componentType)
  ) {
    argItem.value!.value = argItem.value!.value || "";
  }
  const invokeApiTestMethods = getInvokeApiMethods();
  const target = invokeApiTestMethods.find((i) => i.name === props.name);
  if (target) {
    const dialog = target.testModule?.dialog;
    if (dialog) {
      dialog.args?.forEach((arg) => {
        if ("options" in arg) {
          if (typeof arg.options === "function") {
            arg.options = arg.options(listStore);
          }
        }
      });
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
