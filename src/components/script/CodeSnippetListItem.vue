<template>
  <div class="code-snippet-item" @click="showDetails = !showDetails">
    <div class="content drag-handle">
      <div class="info">
        <el-icon class="icon" v-if="!showDetails" size="large">
          <div i-solar-alt-arrow-right-line-duotone></div>
        </el-icon>
        <el-icon class="icon" v-else size="large">
          <div i-solar-alt-arrow-down-line-duotone></div>
        </el-icon>
        <span>{{ codeSnippet.name }}</span>
      </div>
      <div class="menu">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="删除代码片段"
          placement="bottom"
        >
          <el-icon class="icon" @click.stop="deleteCodeSnippet">
            <span i-mdi-file-document-remove-outline></span>
          </el-icon>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="编辑代码片段"
          placement="bottom"
        >
          <code-icon class="icon" @click.stop="editFile" />
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="修改代码片段信息"
          placement="bottom"
        >
          <el-icon class="icon" @click.stop="editInfo">
            <span i-mdi-playlist-edit></span>
          </el-icon>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="打开代码片段"
          placement="bottom"
        >
          <el-icon class="icon" @click.stop="openFIleDialog">
            <span i-mdi-folder-eye-outline></span>
          </el-icon>
        </el-tooltip>
      </div>
    </div>
    <div class="details" ref="detailsRef">
      <div>代码片段ID：</div>
      <div class="text" @click.stop="">{{ codeSnippet.id }}</div>
      <div>前缀：</div>
      <div class="text" @click.stop="">{{ codeSnippet.prefix }}</div>
      <div>保存路径：</div>
      <div class="text" @click.stop="">{{ codeSnippet.filePath }}</div>
      <div>代码片段描述(备注)：</div>
      <div class="description" @click.stop="">
        {{ codeSnippet.description }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";

const listStore = useListStore();
const { codeSnippets } = storeToRefs(listStore);
const { appAsideBgColor, appBackground } = useAppTheme();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  showHover: {
    type: Boolean,
    default: true,
  },
});
const hoverBeforeWidth = computed(() => {
  return props.showHover ? "4px" : "0px";
});
const showAnimation = computed(() => {
  return props.showHover ? "all 0.5s" : "none";
});
const emit = defineEmits<{
  (event: "editFile", index: number): void;
  (event: "openFile", index: number): void;
  (event: "delCodeSnippets", index: number): void;
  (event: "editInfo", index: number): void;
}>();

const codeSnippet = computed(() => {
  return (IS_PLAYGROUND_ENV ? usePlayMock().mockCodeSnippetList : codeSnippets).value.find(
    (item) => item.id === props.id
  )!;
});
const scriptIndex = computed(() => {
  return (
    IS_PLAYGROUND_ENV ? usePlayMock().mockCodeSnippetList : codeSnippets
  ).value.findIndex((item) => item.id === props.id)!;
});

const showDetails = ref(false);

const deleteCodeSnippet = () => {
  if (scriptIndex.value !== undefined && scriptIndex.value !== -1)
    emit("delCodeSnippets", scriptIndex.value);
};

const editFile = () => {
  if (scriptIndex.value !== undefined && scriptIndex.value !== -1)
    emit("editFile", scriptIndex.value);
};
const editInfo = () => {
  if (scriptIndex.value !== undefined && scriptIndex.value !== -1)
    emit("editInfo", scriptIndex.value);
};
const openFIleDialog = () => {
  if (scriptIndex.value !== undefined && scriptIndex.value !== -1)
    emit("openFile", scriptIndex.value);
};
const detailsRef = ref<HTMLElement>();
const itemHeight = computed(() => {
  if (showDetails.value) {
    const height = detailsRef.value!.clientHeight;
    return 40 + height + "px";
  }
  return "40px";
});
</script>

<style lang="scss" scoped>
.code-snippet-item {
  width: 100%;
  height: v-bind(itemHeight);
  background-color: v-bind(appAsideBgColor);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 3px;
  border-radius: 5px;
  transition: v-bind(showAnimation);
  cursor: pointer;

  &:hover {
    box-shadow: #a0e0bd 0 0 3px;
  }

  .details {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    box-sizing: border-box;

    .description {
      padding: 5px 10px;
      box-sizing: border-box;
      border-radius: 10px;
      background-color: v-bind(appBackground);
      max-height: 220px;
      overflow-y: scroll;
      user-select: text;
      cursor: text;
    }

    .text {
      padding: 5px 10px;
      box-sizing: border-box;
      border-radius: 10px;
      background-color: v-bind(appBackground);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: text;
      cursor: text;
    }
  }

  .content {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
    background-color: v-bind(appAsideBgColor);

    .info {
      display: flex;
      flex-direction: row;
      align-items: center;

      span {
        margin-right: 10px;
      }

      .icon {
        color: #537e62;
        cursor: default;
        margin-right: 10px;

        &:hover {
          color: #05d74e;
        }
      }
    }

    .menu {
      display: flex;
      flex-direction: row;
      align-items: center;

      .icon {
        margin-left: 10px;
        color: #537e62;

        &:hover {
          color: #05d74e;
        }

        &:first-of-type {
          margin-left: 0;
          color: #b35b5b;

          &:hover {
            color: #cd0000;
          }
        }

        &.no-click {
          cursor: default;
          margin-left: 20px;
        }
      }
    }
  }

  &:hover {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: v-bind(hoverBeforeWidth);
      height: 0;
      background-color: var(--el-color-primary-light-3);
      animation: forwards 0.5s heightChange;
    }
  }
}

@keyframes heightChange {
  from {
    height: 0;
    top: 50%;
  }

  to {
    height: 100%;
    top: 0;
  }
}
</style>
