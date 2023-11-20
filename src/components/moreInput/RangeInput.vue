<template>
  <div>
    <el-tooltip class="box-item" effect="dark" content="最小值" placement="right">
      <el-input-number
        v-model="model![0]"
        :min="limit ? limit[0] : undefined"
        :max="lowMax"
        size="small"
        controls-position="right"
        @change="handleChange()"
      />
    </el-tooltip>
    ~
    <el-tooltip class="box-item" effect="dark" content="最大值" placement="right">
      <el-input-number
        v-model="model![1]"
        :min="min"
        :max="limit ? limit[1] : undefined"
        size="small"
        controls-position="right"
        @change="handleChange()"
      />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
const min = ref<number | undefined>();
const lowMax = ref<number | undefined>();
const model = defineModel<[number, number]>({
  required: true,
  default: [0, 0],
});
const props = defineProps({
  limit: {
    type: Object as PropType<[number, number]>,
  },
  mountedValue: {
    type: Object as PropType<[number, number]>,
  },
});
const handleChange = () => {
  if (model.value[0] >= model.value[1]) {
    model.value[0] = model.value[1];
    lowMax.value = model.value[1];
    min.value = model.value[0];
  } else {
    lowMax.value = undefined;
    min.value = undefined;
  }
};
onMounted(() => {
  if (props.mountedValue) {
    model.value = props.mountedValue;
  }
});
</script>

<style scoped></style>
