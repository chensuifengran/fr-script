<template>
  <div>
    <div class="SS-item">
      <div class="al-center">
        <span>{{ props.label }}</span>
        <el-tooltip v-if="props.alert" :content="props.alert" placement="right">
          <el-icon>
            <span i-mdi-help-circle-outline></span>
          </el-icon>
        </el-tooltip>
      </div>
      <slot class="slot-item"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { appAsideBgColor } = useAppTheme();
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  alert: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "220px",
  },
});

</script>

<style lang="scss" scoped>
.SS-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 2px 10px;
  border-radius: 5px;
  background-color: v-bind(appAsideBgColor);
  margin-top: 5px;

  .al-center {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: v-bind(width);
  }

  .slot-item {
    flex: 1;
  }
}
</style>
