<template>
  <div class="code" overflow-x-hidden>
    <div class="code-content" overflow-y-scroll>
      <div v-for="(c, index) in _code" :key="c+index" v-html="c" text-nowrap cursor-text></div>
    </div>
    <div v-html="_code.join('\n')" ref="rawCodeRef" style="display: none"></div>
    <el-button class="copy-code" @click="copy" size="small" v-if="showCopy"><el-icon>
        <span i-mdi-content-copy></span>
      </el-icon>复制</el-button>
  </div>
</template>
<script lang="ts" setup>
import { PropType } from 'vue';
const props = defineProps({
  //使用codeHighLight处理过的代码
  highlightCode: {
    type: [String, Array] as PropType<string | string[]>,
    required: true,
  },
  showCopy: {
    type: Boolean,
    default: true
  }
});
const _code = computed(() => {
  return Array.isArray(props.highlightCode) ? props.highlightCode : [props.highlightCode];
})
const rawCodeRef = ref<HTMLDivElement>();
const copy = () => {
  if (rawCodeRef.value) {
    const replaceStr = rawCodeRef.value.innerText.replace(/\s+(?=[^()]*\))/g, "").trim();
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