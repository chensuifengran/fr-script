<template>
  <div :class="itemClass(argItem.componentType)">
    <div v-if="edit" class="mask-box">
      <div flex flex-row flex-items-center>
        <el-tag type="primary" size="small">{{ argItem.componentType }}</el-tag>
        <el-text class="info">{{ argItem.name }}</el-text>
      </div>
      <el-button-group>
        <el-button
          @click="emitEdit(argItem.id!)"
          link
          class="btn"
          type="primary"
        >
          <el-icon class="btn"
            ><span i-mdi-playlist-edit class="btn"></span
          ></el-icon>
        </el-button>
        <el-button
          type="danger"
          @click="emitDelete(argItem.id!)"
          link
          class="btn"
        >
          <el-icon class="btn"
            ><span i-mdi-delete-outline class="btn"></span
          ></el-icon>
        </el-button>
      </el-button-group>
    </div>
    <div v-else class="mask-box show-mask"></div>
    <span
      class="label"
      v-if="
        argItem?.label !== undefined &&
        !notShowType.includes(argItem.componentType) &&
        edit
      "
    >
      {{ argItem.label }}
    </span>
    <div v-if="!edit" flex flex-row flex-items-center>
      <el-tag type="primary" size="small">{{ argItem.componentType }}</el-tag
      ><el-text>{{ argItem.label }}</el-text>
    </div>
    <template v-else>
      <template v-if="argItem && argItem.componentType === 'select'">
        <el-select
          v-model="argItem.value"
          filterable
          :multiple="argItem.multiple"
          :clearable="argItem.multiple"
          :allow-create="!argItem.notAllowCreate"
          default-first-option
          :placeholder="argItem.placeholder || '请选择'"
        >
        </el-select>
      </template>
      <template v-else-if="argItem && argItem.componentType === 'FileInput'">
        <FileInput
          v-model="argItem.value"
          :label="argItem.label"
          :verify="argItem.verifyPath"
          :multiple="argItem.multiple"
        />
      </template>
      <template v-else-if="argItem && argItem.componentType === 'RectInput'">
        <RectInput v-model="argItem.value" />
      </template>
      <template v-else-if="argItem && argItem.componentType === 'slider'">
        <SliderInput
          v-model="argItem.value"
          :max="argItem.range?.max"
          :min="argItem.range?.min"
          :step="argItem.range?.step"
          :label="argItem.label"
          size="small"
          :width="100"
        />
      </template>
      <template v-else-if="argItem && argItem.componentType === 'switch'">
        <el-switch
          v-model="argItem.value"
          :active-text="argItem.activeText || '是'"
          :inactive-text="argItem.inactiveText || '否'"
          size="small"
        />
      </template>
      <template v-else-if="argItem && argItem.componentType === 'DirInput'">
        <DirInput
          v-model="argItem.value"
          :label="argItem.label"
          :suffix="argItem.suffix || ''"
          :verify="argItem.verifyPath"
        />
      </template>
      <template v-else-if="argItem && argItem.componentType === 'numberInput'">
        <el-input-number
          v-model="argItem.value"
          :value-on-clear="0"
          size="small"
        />
      </template>
      <template v-else-if="argItem && argItem.componentType === 'input'">
        <el-input v-model="argItem.value" size="small">
          <template #prepend> {{ argItem.label }} </template>
        </el-input>
      </template>
      <template
        v-else-if="argItem && argItem.componentType === 'numberRangeInput'"
      >
        <RangeInput v-model="argItem.value" />
      </template>
    </template>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  argItem: {
    type: Object as PropType<DialogDynamicArgItem>,
    required: true,
  },
  edit: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  onEdit: [id: string];
  onDelete: [id: string];
}>();
const itemClass = (componentType: string) => {
  const rowType = ["switch", "numberInput", "numberRangeInput"];
  if (rowType.includes(componentType)) {
    return "row-item arg-item";
  } else {
    return "arg-item";
  }
};
const notShowType = ["input", "FileInput", "DirInput", "slider"];
const { appAsideBgColor } = useAppTheme();
const maskBg = computed(() => {
  const appAsideBgColorReverse =
    appAsideBgColor.value === "#272727" ? "#f6f6f6" : "#272727";
  return appAsideBgColorReverse + "B0";
});
const emitEdit = (id: string) => {
  emit("onEdit", id);
};
const emitDelete = (id: string) => {
  emit("onDelete", id);
};
</script>

<style lang="scss" scoped>
.row-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.arg-item {
  border-radius: 10px;
  padding: 8px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  background: v-bind(appAsideBgColor);
  margin-bottom: 1px;

  .mask-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: v-bind(maskBg);
    z-index: 100;
    display: none;
    align-items: center;
    justify-content: space-between;
    cursor: move;
    padding: 5px;
    box-sizing: border-box;
    backdrop-filter: blur(2px);

    .info {
      color: var(--el-bg-color-overlay);
    }

    .btn {
      width: 1.5em;
      height: 1.5em;
    }
  }

  .show-mask {
    background: transparent;
    display: block;
    backdrop-filter: blur(0);
  }

  &::after {
    content: "";
    width: 4px;
    position: absolute;
    left: 0;
    top: 0;
    height: 0;
    background-color: var(--el-color-primary);
    transition: all 0.5s;
  }

  &:hover {
    &::after {
      height: 100%;
    }

    & .mask-box {
      display: flex;
    }
  }
}
</style>
