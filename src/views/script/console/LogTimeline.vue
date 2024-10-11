<template>
  <el-timeline
    size="small"
    class="logger-timeline"
    v-infinite-scroll="load"
    :infinite-scroll-immediate="false"
  >
    <el-timeline-item
      v-for="log in buildInData"
      :key="log.id"
      :icon="log.icon"
      :type="log.type"
      :color="log.color"
      :size="log.size"
      :hollow="log.hollow"
      :timestamp="log.time"
    >
      <el-text size="small" class="text" line-clamp="10">{{
        log.content
      }}</el-text>
    </el-timeline-item>
  </el-timeline>
</template>
<script lang="ts" setup>
import type { LogOutputType } from "../../../hooks/useLog";
import DotLoader from "../../../components/Icons/DotLoader.vue";
import MenuDots from "../../../components/Icons/MenuDots.vue";
import CheekIcon from "../../../components/Icons/CheekIcon.vue";
import AlertOutline from "../../../components/Icons/AlertOutline.vue";
import AlertCircle from "../../../components/Icons/AlertCircle.vue";
import InfoIcon from "../../../components/Icons/InfoIcon.vue";
const props = defineProps({
  data: {
    type: Array as PropType<LogOutputType[]>,
    required: true,
  },
  reverseShow: {
    type: Boolean,
    default: true,
  },
});
const showMaxCount = ref(20);
const load = () => {
  showMaxCount.value += 20;
};
const { appAsideBgColor } = useAppTheme();
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
  return res
    .map((item, index) => {
      if (item.type === "danger") {
        return {
          icon: AlertCircle,
          type: "danger" as "danger",
          color: "#f56c6c",
          size: "large" as "large",
          hollow: props.reverseShow ? index === 0 : index === res.length - 1,
          timestamp: item.timestamp,
          time: item.time,
          content: item.log,
          id: item.id,
        };
      } else if (item.type === "warning") {
        return {
          icon: AlertOutline,
          type: "warning" as "warning",
          color: "#e6a23c",
          size: "large" as "large",
          hollow: props.reverseShow ? index === 0 : index === res.length - 1,
          timestamp: item.timestamp,
          time: item.time,
          content: item.log,
          id: item.id,
        };
      } else if (item.type === "success") {
        return {
          icon: CheekIcon,
          type: "success" as "success",
          color: "#67c23a",
          size: "large" as "large",
          hollow: props.reverseShow ? index === 0 : index === res.length - 1,
          timestamp: item.timestamp,
          time: item.time,
          content: item.log,
          id: item.id,
        };
      } else if (item.type === "loading") {
        if (props.reverseShow) {
          if (index === 0) {
            return {
              icon: DotLoader,
              type: "info" as "info",
              size: "large" as "large",
              hollow: false,
              timestamp: item.timestamp,
              time: item.time,
              content: item.log,
              id: item.id,
            };
          } else {
            return {
              icon: MenuDots,
              type: "info" as "info",
              size: "large" as "large",
              hollow: false,
              timestamp: item.timestamp,
              time: item.time,
              content: item.log,
              id: item.id,
            };
          }
        } else {
          if (index === res.length - 1) {
            return {
              icon: DotLoader,
              type: "info" as "info",
              size: "large" as "large",
              hollow: false,
              timestamp: item.timestamp,
              time: item.time,
              content: item.log,
              id: item.id,
            };
          } else {
            return {
              icon: MenuDots,
              type: "info" as "info",
              size: "large" as "large",
              hollow: false,
              timestamp: item.timestamp,
              time: item.time,
              content: item.log,
              id: item.id,
            };
          }
        }
      } else {
        return {
          icon: InfoIcon,
          type: "info" as "info",
          color: "#909399",
          size: "large" as "large",
          hollow: props.reverseShow ? index === 0 : index === res.length - 1,
          timestamp: item.timestamp,
          time: item.time,
          content: item.log,
          id: item.id,
        };
      }
    })
    .slice(0, Math.min(showMaxCount.value, props.data.length));
});
</script>

<style lang="scss" scoped>
.logger-timeline {
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  background: v-bind(appAsideBgColor);
  padding: 10px;
  box-sizing: border-box;
  transition: all 0.5s;
  border-radius: 10px;
  .text {
    max-width: 100%;
  }
}
:deep(.el-timeline-item .el-timeline-item__icon) {
  font-size: inherit;
}
</style>
