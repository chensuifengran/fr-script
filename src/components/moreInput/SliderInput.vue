<template>
  <div class="fr-slider">
    <el-text v-if="label && !hideLabel" class="label">{{ label }}</el-text>
    <div class="data-area">
      <el-text mr-10px>{{ value }}</el-text>
      <el-button
        link
        size="small"
        v-if="controls"
        :disabled="value <= min"
        @click="reduce"
        type="danger"
      >
        <el-icon><span i-mdi-minus></span></el-icon>
      </el-button>
      <el-slider
        :style="{
          width: label ? width + 'px' : '100%',
        }"
        v-model="value"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
      />
      <el-button
        link
        size="small"
        v-if="controls"
        :disabled="value >= max"
        @click="add"
        type="primary"
      >
        <el-icon><span i-mdi-plus></span></el-icon>
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
const value = defineModel<number>({
  default: 0,
});
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  width: {
    type: Number,
    default: 100,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideLabel: {
    type: Boolean,
    default: false,
  },
  controls: {
    type: Boolean,
    default: true,
  },
});
const decimalPlaces = (num: number) => {
  const match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) {
    return 0;
  }
  return Math.max(
    0,
    (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
  );
};
const add = () => {
  const factor =
    10 ** Math.max(decimalPlaces(value.value), decimalPlaces(props.step));
  value.value =
    (Math.round(value.value * factor) + Math.round(props.step * factor)) /
    factor;
};

const reduce = () => {
  const factor =
    10 ** Math.max(decimalPlaces(value.value), decimalPlaces(props.step));
  value.value =
    (Math.round(value.value * factor) - Math.round(props.step * factor)) /
    factor;
};
</script>

<style lang="scss" scoped>
.fr-slider {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 5px;

  .label {
    flex: 1;
    margin-right: 100px;
  }

  .data-area {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
<style lang="scss">
.fr-slider {
  .el-slider {
    position: relative;
    height: 16px;

    .el-slider__runway {
      border-radius: 8px;
      overflow: hidden;
      height: 100%;
      cursor: e-resize;

      .el-slider__bar {
        height: 100%;
      }

      .el-slider__button-wrapper {
        // display: none;
        height: 100%;
        top: 0;
        visibility: hidden;
      }
    }
  }
}
</style>
