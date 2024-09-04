<template>
  <div
    flex
    flex-row
    items-center
    :style="{
      justifyContent: props.label ? 'space-between' : 'flex-start',
    }"
  >
    <div v-if="props.label">{{ props.label }}</div>
    <div
      flex
      flex-row
      items-center
      :style="{
        width: props.label ? 'auto' : '100%',
      }"
    >
      <el-tooltip
        effect="dark"
        :content="'最小值' + (props.limit ? `(min:${props.limit[0]})` : '')"
        placement="bottom"
      >
        <el-input-number
          :class="props.controls ? 'w-105px' : 'w-65px'"
          v-model="model![0]"
          :min="props.limit ? props.limit[0] : undefined"
          :max="lowMax"
          size="small"
          :controls="props.controls"
          @change="handleChange()"
          :disabled="props.disabled"
        />
      </el-tooltip>
      ~
      <el-tooltip
        effect="dark"
        :content="'最大值' + (props.limit ? `(max:${props.limit[1]})` : '')"
        placement="bottom"
      >
        <el-input-number
          :class="props.controls ? 'w-105px' : 'w-65px'"
          v-model="model![1]"
          :min="min"
          :max="props.limit ? props.limit[1] : undefined"
          size="small"
          :controls="props.controls"
          @change="handleChange()"
          :disabled="props.disabled"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
const min = ref<number | undefined>();
const lowMax = ref<number | undefined>();
const model = defineModel<[number, number] | Object>({
  required: true,
  default: [0, 0],
}) as globalThis.Ref<[number, number]>;
const props = defineProps({
  limit: {
    type: Object as PropType<[number, number]>,
  },
  mountedValue: {
    type: Object as PropType<[number, number]>,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  controls: {
    type: Boolean,
    default: false,
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

<style scoped lang="scss"></style>
