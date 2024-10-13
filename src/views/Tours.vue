<template>
  <div>
    <el-tour
      v-for="(tour, index) in tours"
      :key="index"
      v-model="tour.touring"
      v-model:current="step"
      @finish="finishHandler"
      @close="finishHandler"
      @change="stepChangeHandler"
    >
      <el-tour-step
        v-for="(step, index) in tour.steps"
        :key="index"
        :target="step.target"
        :title="step.title"
        :description="step.description"
      />
    </el-tour>
  </div>
</template>
<script lang="ts" setup>
import { TourStepNames } from "../hooks/useTour";

const { tourInfo, currentTourName } = useTour();
const step = ref(0);
const stepKeys = computed(() => Object.keys(tourInfo) as TourStepNames[]);
const tours = computed(() => {
  return stepKeys.value.map((key) => {
    return tourInfo[key];
  });
});
const stepChangeHandler = (_step: number) => {
  const targetInfo = tourInfo[currentTourName.value];
  if (
    (_step > targetInfo.step && targetInfo.preventNext) ||
    (_step < targetInfo.step && targetInfo.preventPrevious)
  ) {
    if (!targetInfo.doneSteps.includes(step.value)) {
      ElMessage.warning("请先完成当前步骤");
      nextTick(() => {
        step.value--;
      });
      return;
    }
  }
  const onShow = targetInfo.steps[_step]?.onShow;
  if (onShow) {
    onShow();
  }
  targetInfo.step = _step;
  targetInfo.preventNext = targetInfo.steps[_step]?.preventNext || false;
  targetInfo.preventPrevious =
    targetInfo.steps[_step]?.preventPrevious || false;
};
const finishHandler = () => {
  const target = tourInfo[currentTourName.value];
  target.touring = false;
  target.step = 0;
  target.doneSteps.splice(0);
  if (!IS_PLAYGROUND_ENV) {
    const sl = useListStore().scriptList;
    const demoIndex = sl.findIndex((item) => item.id === DEMO_SCRIPT_ID);
    if (demoIndex !== -1) {
      ElMessage.info("引导完成,自动删除引导创建的脚本");
      sl.splice(demoIndex, 1);
    }
  }
};
watch(
  () => tourInfo[currentTourName.value]?.step,
  () => {
    const s = tourInfo[currentTourName.value]?.step;
    if (s) {
      nextTick(() => (step.value = s));
    }
  }
);
onMounted(() => {
  tourInfo[currentTourName.value].preventNext =
    tourInfo[currentTourName.value].steps[0]?.preventNext || false;
});
</script>

<style lang="scss" scoped></style>
