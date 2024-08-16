<template>
  <div class="renderer-form" id="renderer-form">
    <el-alert
      v-if="isPreviewForm"
      title="表单预览"
      type="info"
      description="表单预览仅能修改组件默认值，修改/删除组件需打开下方的“组件管理树”进行修改。"
      show-icon
      class="alert"
    />
    <ElCard class="box-card" v-for="g in showList" :key="g.groupLabel" :id="'renderer-form-g-'+g.groupLabel">
      <template #header>
        <div class="card-header">
          <span>{{ g.groupLabel }}</span>
          <el-switch
            v-model="g.enable"
            class="mgl-5"
            v-if="g.groupLabel !== '*脚本设置'"
            @change="rendererListChangeHandle"
            style="
              --el-switch-off-color: #ff4949;
            "
            :disabled="disabledAll"
          />
        </div>
      </template>
      <div class="form-content">
        <div class="check-content">
          <el-checkbox
            v-for="c in g.checkList"
            :key="c.label"
            :label="c.label"
            class="check-item"
            v-model="c.checked"
            :disabled="
              (isPreviewForm &&
                g.groupLabel === '*脚本设置' &&
                c.label === '导入上次运行配置') ||
              !g.enable || disabledAll
            "
            @change="configChangeHandle(c.label)"
          />
        </div>
        <div
          class="select-item"
          v-for="s in g.selectList"
          :key="s.label"
          :style="{
            flexDirection:
              s.label.length && s.label.length > 6 ? 'column' : 'row',
            alignItems:
              s.label.length && s.label.length > 6 ? 'flex-start' : 'center',
          }"
        >
          <el-text
            :style="{
              alignSelf:
                s.label.length && s.label.length > 6 ? 'self-start' : 'center',
            }"
            >{{ s.label }}</el-text
          >
          <el-select
            class="select"
            :style="{
              minWidth:
                s.label.length && s.label.length > 6
                  ? '100%'
                  : getSelectMinWidth(s.value),
            }"
            v-model="s.value"
            :placeholder="s.label"
            @change="rendererListChangeHandle"
            size="small"
            :disabled="!g.enable || disabledAll"
          >
            <el-option
              v-for="item in s.options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div
          class="select-item"
          v-for="s in g.multipleSelectList"
          :key="s.label"
          style="align-items: flex-start"
        >
          <el-text style="align-self: self-start">{{ s.label }}</el-text>
          <el-select
            multiple
            size="small"
            :disabled="!g.enable || disabledAll"
            :multiple-limit="s.limit"
            v-model="s.value"
            :placeholder="s.label"
            @change="rendererListChangeHandle"
          >
            <el-option-group
              v-for="group in s.options"
              :key="group.groupLabel"
              :label="group.groupLabel"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </div>
        <div
          class="select-item"
          v-for="s in g.groupSelectList"
          :key="s.label"
          style="align-items: flex-start"
        >
          <el-text style="align-self: self-start">{{ s.label }}</el-text>
          <el-select
            size="small"
            v-model="s.value"
            :placeholder="s.label"
            :disabled="!g.enable || disabledAll"
            @change="rendererListChangeHandle"
          >
            <el-option-group
              v-for="group in s.options"
              :key="group.groupLabel"
              :label="group.groupLabel"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </div>
        <div
          class="input-item"
          v-for="i in g.inputList"
          :key="i.label"
          style="align-items: flex-start"
        >
          <el-text
            v-if="i.label.length && i.label.length > 6"
            style="align-self: self-start"
            >{{ i.label }}</el-text
          >
          <el-input
            size="small"
            v-model="i.value"
            :placeholder="i.label"
            :disabled="!g.enable || disabledAll"
            @change="rendererListChangeHandle"
          >
            <template #prepend v-if="i.label.length && i.label.length <= 6">{{
              i.label
            }}</template>
          </el-input>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { WatchStopHandle } from "vue";

const props = defineProps({
  isPreviewForm: {
    type: Boolean,
    default: false,
  },
  reInit: {
    type: Function as PropType<() => boolean>,
    default: () => false,
  },
  saveBuildForm: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
  disabledAll: {
    type: Boolean,
    default: false,
  },
});
const { importLastRunConfig } = useScriptApi();
const listStore = useListStore();
const {
  rendererList: storeRendererList,
  previewRendererList,
  scriptList,
} = storeToRefs(listStore);
const rendererList = props.isPreviewForm
  ? previewRendererList.value
  : storeRendererList.value;
const localPreviewValue = reactive([...previewRendererList.value.slice(0)]);
const showList = computed(() =>
  props.isPreviewForm ? localPreviewValue : rendererList
);
if (props.isPreviewForm) {
  watch(previewRendererList, () => {
    localPreviewValue.splice(
      0,
      localPreviewValue.length,
      ...previewRendererList.value
    );
  });
}
let isFirst = true;
const { openId } = useScriptInfo();
if (!props.isPreviewForm) {
  watch(openId, () => {
    if (openId.value !== "-1") {
      const target = scriptList.value.find((i) => i.id === openId.value);
      if (target?.setting.autoImportLastRunConfig) {
        isFirst = true;
      }
    }
  });
}

const configChangeHandle = async (label?: string) => {
  if (props.isPreviewForm) {
    diffComponentValue();
    props.saveBuildForm!();
    return;
  }
  if (label === "导入上次运行配置") {
    await importLastRunConfig(rendererList);
  }
};

let stopHandle: WatchStopHandle;
onMounted(() => {
  if (props.isPreviewForm) return;
  stopHandle = watchEffect(async () => {
    const reInit = props.reInit();
    if (reInit) {
      isFirst = true;
    }
    if (!isFirst) return;
  });
});
onBeforeUnmount(() => {
  if (stopHandle) {
    stopHandle();
  }
});
//"multiplSelect" | "groupSelect" | "select" | "check" | "input"转换为previewRendererList对应的列表
const bTypeToPType = (bType: string) => {
  switch (bType) {
    case "multiplSelect":
      return "multipleSelectList";
    default:
      return bType + "List";
  }
};

//比较scriptStore.previewRendererList 和 scriptStore.previewBuildFormList各组件默认值，不一致则以previewRendererList为准
const diffComponentValue = () => {
  const { previewRendererList, previewBuildFormList } = storeToRefs(listStore);
  previewBuildFormList.value.forEach((i) => {
    const type = bTypeToPType(i.type);
    const target = previewRendererList.value.find(
      (j) => j.groupLabel === i.targetGroupLabel
    );
    if (target) {
      i.enable = target.enable;
      const targetItem = (target as any)[type].find(
        (j: any) => j.label === i.label
      );
      if (targetItem) {
        if (type === "checkList") {
          const item = i as {
            targetGroupLabel: string;
            type:
              | "multiplSelect"
              | "groupSelect"
              | "select"
              | "check"
              | "input";
            label: string;
            checked: boolean;
            enable?: boolean;
          };
          if (targetItem.checked !== item.checked) {
            item.checked = targetItem.checked;
          }
        } else {
          const item = i as {
            targetGroupLabel: string;
            type:
              | "multiplSelect"
              | "groupSelect"
              | "select"
              | "check"
              | "input";
            label: string;
            value: string | string[];
            enable?: boolean;
          };
          if (targetItem.value !== item.value) {
            item.value = targetItem.value;
          }
        }
      }
    }
  });
};

const rendererListChangeHandle = () => {
  if (props.isPreviewForm) {
    diffComponentValue();
    props.saveBuildForm!();
  }
};

const getSelectMinWidth = (text: string) => {
  const len = Math.min(text.length - 1, 7);
  let d = 45;
  return `${d + len * 15}px`;
};
</script>

<style lang="scss" scoped>
.mgl-5 {
  margin-left: 5px;
}

.renderer-form {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  transition: all 0.5s;

  .box-card {
    margin: 0 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    transition: all 0.3s;
    box-shadow: 2px 2px 3px #00000033;
    overflow: visible;

    .form-content {
      display: flex;
      flex-direction: column;

      .check-content {
        display: flex;
        flex-flow: wrap;
        .check-item {
          margin-right: 5px;
        }
      }

      .select-item,
      .input-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        margin-top: 5px;

        .select {
          max-width: 70%;
        }
      }
    }

    .table-list-div {
      padding: 10px;
    }

    .descriptions-box {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.alert {
  margin: 0 0 10px 10px;
}
</style>
<style lang="scss">
.renderer-form {
  overflow-x: hidden;

  .el-card__body {
    padding: 0 20px;
  }

  .el-card__header {
    padding: 5px 20px;
  }
}
</style>
