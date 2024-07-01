<template>
  <div class="code" overflow-x-hidden>
    <div class="code-content" overflow-y-scroll>
      <div v-for="c in highlightCode" :key="c" v-html="c" text-nowrap cursor-text></div>
    </div>
    <el-button class="copy-code" @click="copyCode(_rawCode)" size="small" v-if="showCopy"><el-icon>
        <span i-mdi-content-copy></span>
      </el-icon>复制</el-button>
  </div>
</template>
<script lang="ts" setup>
import { PropType } from 'vue';
import { codeHighLight } from '../../utils/codeHighLight';
const props = defineProps({
  //未使用codeHighLight处理过的代码
  rawCode: {
    type: [String, Array] as PropType<string | string[]>,
    required: true,
  },
  showCopy: {
    type: Boolean,
    default: true
  }
});
const _rawCode = computed(() => {
  return Array.isArray(props.rawCode) ? props.rawCode.join('') : props.rawCode;
});
const highlightCode = computed(() => {
  return codeHighLight(_rawCode.value);
})
const copyCode = (text: string) => {
  const replaceStr = text.replace(/\s+(?=[^()]*\))/g, "").trim();
  if (execCopy(replaceStr)) {
    ElNotification({
      title: "复制成功",
      type: "success",
      position: "bottom-right",
    });
  } else {
    ElNotification({
      title: "复制失败",
      type: "error",
      position: "bottom-right",
    });
  }
};
const { appAsideBgColor } = useAppTheme();
</script>

<style lang="scss" scoped>
.code {
  width: 100%;
  padding: 10px 15px;
  border-radius: 4px;
  background: v-bind(appAsideBgColor);
  box-sizing: border-box;
  position: relative;
  .code-content{
    user-select: text;
  }
  &:hover {
    .copy-code {
      display: block;
    }
  }

  .copy-code {
    display: none;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>