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
  if (
    (_step > tourInfo[currentTourName.value].step &&
      tourInfo[currentTourName.value].preventNext) ||
    (_step < tourInfo[currentTourName.value].step &&
      tourInfo[currentTourName.value].preventPrevious)
  ) {
    if (!tourInfo[currentTourName.value].doneSteps.includes(step.value)) {
      ElMessage.warning("请先完成当前步骤");
      nextTick(() => {
        step.value--;
      });
      return;
    }
  }
  tourInfo[currentTourName.value].step = _step;
  tourInfo[currentTourName.value].preventNext =
    tourInfo[currentTourName.value].steps[_step]?.preventNext || false;
  tourInfo[currentTourName.value].preventPrevious =
    tourInfo[currentTourName.value].steps[_step]?.preventPrevious || false;
};
const finishHandler = () => {
  tourInfo[currentTourName.value].touring = false;
  tourInfo[currentTourName.value].step = 0;
  tourInfo[currentTourName.value].doneSteps.splice(0);
  if (!IS_PLAYGROUND_ENV) {
    const sl = useListStore().scriptList;
    const demoIndex = sl.findIndex((item) => item.id === DEMO_SCRIPT_ID);
    if (demoIndex !== -1) {
      ElMessage.info("引导完成,自动删除引导创建的脚本");
      sl.splice(demoIndex, 1);
    }
  }
};
watchEffect(() => {
  const s = tourInfo[currentTourName.value]?.step;
  if(s){
    nextTick(() => (step.value = s));
  }
});
onMounted(() => {
  tourInfo[currentTourName.value].preventNext =
    tourInfo[currentTourName.value].steps[0]?.preventNext || false;
});
</script>

<style lang="scss" scoped></style>
