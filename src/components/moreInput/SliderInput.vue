<template>
  <div class="fr-slider">
    <el-text v-if="label && !hideLabel" class="label">{{ label }}</el-text>
    <div class="data-area">
      <el-text class="mgr-10">{{ value }}</el-text>
      <el-slider :style="{
        width: label ? width + 'px' : '100%',
      }" class="slider" v-model="value" :min="min" :max="max" :step="step" :disabled="disabled" />
    </div>
  </div>
</template>
<script lang="ts" setup>
const value = defineModel<number>({
  default: 0,
});
defineProps({
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
  }
});
</script>

<style lang="scss" scoped>
.mgr-10 {
  margin-right: 10px;
}

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
