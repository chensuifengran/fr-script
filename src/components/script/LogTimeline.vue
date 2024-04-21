<template>
  <el-timeline class="logger-timeline" v-infinite-scroll="load" :infinite-scroll-immediate="false">
    <el-timeline-item v-for="log in buildInData" :key="log.timestamp" :icon="log.icon" :type="log.type"
      :color="log.color" :size="log.size" :hollow="log.hollow" :timestamp="log.time">
      {{ log.content }}
    </el-timeline-item>
  </el-timeline>
</template>
<script lang="ts" setup>
import { MoreFilled, SuccessFilled, WarnTriangleFilled, WarningFilled } from '@element-plus/icons-vue';
import { LogOutputType } from '../../hooks/useScriptApi';
import DotLoader from '../loaderIcon/DotLoader.vue';
const props = defineProps({
  data: {
    type: Array as PropType<LogOutputType[]>,
    required: true
  },
  reverseShow: {
    type: Boolean,
    default: true
  },
  running: {
    type: Boolean,
    default: false
  },
});
const showMaxCount = ref(20);
const load = () => {
  showMaxCount.value += 20;
}
const buildInData = computed(() => {
  let res;
  if (props.reverseShow) {
    res = [...props.data].reverse();
  } else {
    res = [...props.data];
  }
  if (props.data.length === 0) {
    showMaxCount.value = 20;
  }
  return res.map((item, index) => {
    if (item.type === 'danger') {
      return {
        icon: WarnTriangleFilled,
        type: 'danger' as 'danger',
        color: '#f56c6c',
        size: 'large' as 'large',
        hollow: props.reverseShow ? index === 0 : index === res.length - 1,
        timestamp: item.timestamp,
        time: item.time,
        content: item.log
      }
    } else if (item.type === 'warning') {
      return {
        icon: WarningFilled,
        type: 'warning' as 'warning',
        color: '#e6a23c',
        size: 'large' as 'large',
        hollow: props.reverseShow ? index === 0 : index === res.length - 1,
        timestamp: item.timestamp,
        time: item.time,
        content: item.log
      }
    } else if (item.type === 'success') {
      return {
        icon: SuccessFilled,
        type: 'success' as 'success',
        color: '#67c23a',
        size: 'large' as 'large',
        hollow: props.reverseShow ? index === 0 : index === res.length - 1,
        timestamp: item.timestamp,
        time: item.time,
        content: item.log
      }
    } else if (item.type === 'loading') {
      if (props.reverseShow) {
        if (index === 0) {
          return {
            icon: DotLoader,
            type: 'info' as 'info',
            size: 'large' as 'large',
            hollow: false,
            timestamp: item.timestamp,
            time: item.time,
            content: item.log
          }
        } else {
          return {
            icon: MoreFilled,
            type: 'info' as 'info',
            size: 'large' as 'large',
            hollow: false,
            timestamp: item.timestamp,
            time: item.time,
            content: item.log
          }
        }
      } else {
        if (index === res.length - 1) {
          return {
            icon: DotLoader,
            type: 'info' as 'info',
            size: 'large' as 'large',
            hollow: false,
            timestamp: item.timestamp,
            time: item.time,
            content: item.log
          }
        } else {
          return {
            icon: MoreFilled,
            type: 'info' as 'info',
            size: 'large' as 'large',
            hollow: false,
            timestamp: item.timestamp,
            time: item.time,
            content: item.log
          }
        }
      }
    } else {
      return {
        type: 'info' as 'info',
        color: '#909399',
        size: 'large' as 'large',
        hollow: props.reverseShow ? index === 0 : index === res.length - 1,
        timestamp: item.timestamp,
        time: item.time,
        content: item.log
      }
    }
  }).slice(0, Math.min(showMaxCount.value, props.data.length));
});
</script>

<style lang="scss" scoped>
.logger-timeline {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>