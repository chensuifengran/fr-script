<template>
  <div w-full h-full flex flex-col>
    <el-text tag="b" class="title">分组</el-text>
    <div class="link-contianer" overflow-x-hidden overflow-y-scroll>
      <div
        class="link-item"
        @click="scrollTo(l)"
        :class="{
          active: linkTarget === l,
        }"
        v-for="l in rendererListLabel"
        :key="l"
        :id="'link-item-' + l"
      >
        {{ l.replace("form-renderer-g-", "") }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const listStore = useListStore();
const linkTarget = ref("");
let watchTimer: NodeJS.Timeout | null = null;
let clickScrollTo = 0;
watch(linkTarget, () => {
  watchTimer && clearTimeout(watchTimer);
  watchTimer = setTimeout(() => {
    if (clickScrollTo > 0) {
      clickScrollTo--;
      return;
    }
    const catalogItem = document.getElementById(
      "link-item-" + linkTarget.value
    );
    catalogItem && catalogItem.scrollIntoView({ behavior: "smooth" });
  }, 100);
});
const rendererListLabel = computed(() =>
  listStore.renderList.map((i) => "form-renderer-g-" + i.groupLabel)
);
const scrollTo = (id: string) => {
  clickScrollTo++;
  const target = document.getElementById(id);
  if (target) {
    linkTarget.value = id;
    nextTick(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    });
  }
};
const props = defineProps({
  scrollContainerId: {
    type: String,
    required: true,
  },
});
let scrollHandleTimer: NodeJS.Timeout | null = null;
let usePreTarget = false;
let lastScrollTop = 0;

const scrollHandle = (e: Event) => {
  scrollHandleTimer && clearTimeout(scrollHandleTimer);
  scrollHandleTimer = setTimeout(() => {
    const currentScrollTop = (e.target as any).scrollTop || 0;
    const target = rendererListLabel.value.find((i) => {
      const ele = document.getElementById(i);
      if (ele) {
        const rect = ele.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      }
      return false;
    });
    if (target) {
      linkTarget.value = target;
      usePreTarget = false;
    } else {
      if (currentScrollTop < lastScrollTop) {
        //如果当前元素索引大于零，使用上一个元素
        const index = rendererListLabel.value.findIndex(
          (i) => i === linkTarget.value
        );
        if (index > 0 && !usePreTarget) {
          linkTarget.value = rendererListLabel.value[index - 1];
          usePreTarget = true;
        }
      }
    }
    lastScrollTop = currentScrollTop;
  });
};
let targetContainer: HTMLElement | null = null;
onMounted(() => {
  nextTick(() => {
    const target = document.getElementById(props.scrollContainerId);
    if (target) {
      targetContainer = target;
      target.addEventListener("scroll", scrollHandle);
    }
    linkTarget.value = rendererListLabel.value[0];
  });
});
onUnmounted(() => {
  if (targetContainer) {
    targetContainer.removeEventListener("scroll", scrollHandle);
  }
});
</script>

<style lang="scss" scoped>
.title {
  align-self: self-start;
}
.link-contianer{
  height: calc(100% - 20px);
}
.link-item {
  cursor: pointer;
  margin: 5px 0;
  color: var(--el-segmented-color);
  font-size: 12px;
  &:hover {
    color: var(--el-color-primary-light-5) !important;
  }
  &.active {
    color: var(--el-color-primary);
  }
}
</style>
