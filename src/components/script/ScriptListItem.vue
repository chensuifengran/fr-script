<template>
  <div class="script-item" @click="showDetails = !showDetails">
    <div class="content">
      <div class="info">
        <el-icon class="icon" v-if="!showDetails">
          <IEpArrowRight />
        </el-icon>
        <el-icon class="icon" v-else>
          <IEpArrowDown />
        </el-icon>
        <span>{{ script.name }}</span><el-tag size="small" type="info">{{ script.version }}</el-tag>
      </div>
      <div class="menu">
        <el-tooltip class="box-item" effect="dark" content="删除脚本" placement="bottom">
          <el-icon class="icon" @click.stop="deleteScript">
            <IEpDeleteFilled />
          </el-icon>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="编辑脚本" placement="bottom">
          <code-icon class="icon" @click.stop="editorScriptFile" />
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="打开脚本" placement="bottom">
          <el-icon class="icon" @click.stop="openFIleDialog">
            <IEpFolder />
          </el-icon>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="脚本设置" placement="bottom">
          <el-icon class="icon" @click.stop="goSetScript">
            <IEpSetting />
          </el-icon>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="运行脚本" placement="bottom">
          <run-icon class="icon" @click.stop="runScript" />
        </el-tooltip>
      </div>
    </div>
    <div class="details" ref="detailsRef">
      <div>脚本ID：</div>
      <div class="text" @click.stop="">{{ script.id }}</div>
      <div>保存路径：</div>
      <div class="text" @click.stop="">{{ script.savePath }}</div>
      <div>脚本描述(备注)：</div>
      <div class="description" @click.stop="">{{ script.description }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
const listStore = useListStore();
const { scriptList } = storeToRefs(listStore);
const { appAsideBgColor, appBackground } = useAppTheme();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const emit = defineEmits<{
  (event: "editorScriptFile", index: number): void;
  (event: "openFile", index: number): void;
  (event: "setScript", index: number): void;
  (event: "runScript", index: number): void;
  (event: "deleteScript", index: number): void;
}>();

const script = computed(() => {
  return scriptList.value.find((item) => item.id === props.id)!;
});
const scriptIndex = computed(() => {
  return scriptList.value.findIndex((item) => item.id === props.id)!;
});

const showDetails = ref(false);

const deleteScript = () => {
  if (scriptIndex.value !== undefined && scriptIndex.value !== -1)
    emit("deleteScript", scriptIndex.value);
};

const editorScriptFile = () => {
  if (scriptIndex.value !== undefined && scriptIndex.value !== -1)
    emit("editorScriptFile", scriptIndex.value);
};

const openFIleDialog = () => {
  if (scriptIndex.value !== undefined && scriptIndex.value !== -1)
    emit("openFile", scriptIndex.value);
};

const goSetScript = () => {
  if (scriptIndex.value !== undefined && scriptIndex.value !== -1)
    emit("setScript", scriptIndex.value);
};

const runScript = () => {
  if (scriptIndex.value !== undefined && scriptIndex.value !== -1)
    emit("runScript", scriptIndex.value);
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
.script-item {
  width: 100%;
  height: v-bind(itemHeight);
  background-color: v-bind(appAsideBgColor);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.5s;
  margin-top: 3px;
  border-radius: 5px;

  &:hover {
    box-shadow: #a0e0bd 0 0 3px;
  }

  cursor: pointer;

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
        // margin-left: 10px;
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
      width: 4px;
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
