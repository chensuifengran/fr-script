<template>
  <div class="renderer-form" id="renderer-form">
    <ElCard
      class="box-card"
      v-for="g in rendererList"
      :key="g.groupLabel"
      :id="'renderer-form-g-' + g.groupLabel"
    >
      <template #header>
        <div class="card-header">
          <span>{{ g.groupLabel }}</span>
          <el-switch
            v-model="g.enable"
            ml-5px
            v-if="g.groupLabel !== '*脚本设置'"
            style="--el-switch-off-color: #ff4949"
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
            :disabled="!g.enable || disabledAll"
            @change="configChangeHandle(c.label)"
          />
        </div>
        <div
          class="select-item"
          v-for="s in g.selectList"
          :key="s.label"
          :style="{
            flexDirection:
              disabledAll ||
              s.multiple ||
              (s.label.length && s.label.length > 6)
                ? 'column'
                : 'row',
            alignItems:
              disabledAll ||
              s.multiple ||
              (s.label.length && s.label.length > 6)
                ? 'flex-start'
                : 'center',
          }"
        >
          <div flex flex-row items-center>
            <el-tag size="small" v-if="s.group"
              >{{ getItemType(s.options[0]?.options[0])
              }}{{ s.multiple ? "[]" : "" }}</el-tag
            >
            <el-tag size="small" v-else
              >{{ getItemType(s.options[0])
              }}{{ s.multiple ? "[]" : "" }}</el-tag
            >
            <el-text
              ml-1
              :style="{
                alignSelf:
                  disabledAll || (s.label.length && s.label.length > 6)
                    ? 'self-start'
                    : 'center',
              }"
              >{{ s.label }}</el-text
            >
          </div>
          <el-select
            class="select"
            :style="{
              minWidth:
                disabledAll ||
                s.multiple ||
                (s.label.length && s.label.length > 6)
                  ? '100%'
                  : getSelectMinWidth(s.value),
            }"
            :multiple="s.multiple"
            v-model="s.value"
            :placeholder="s.label"
            size="small"
            :disabled="!g.enable || disabledAll"
          >
            <template v-if="s.group">
              <el-option-group
                v-for="g in s.options"
                :key="g.groupLabel"
                :label="g.groupLabel"
              >
                <el-option
                  v-for="(item, index) in g.options"
                  :key="optTransformer.transformKey(item, s.id || index)"
                  :label="optTransformer.transformLabel(item)"
                  :value="optTransformer.transformValue(item)"
                />
              </el-option-group>
            </template>
            <template v-else>
              <el-option
                v-for="(item, index) in s.options"
                :key="index"
                :label="optTransformer.transformLabel(item)"
                :value="item"
              />
            </template>
          </el-select>
        </div>
        <div
          class="input-item"
          v-for="i in g.inputList"
          :key="i.label"
          style="align-items: flex-start"
        >
          <template v-if="i.inputType === 'range'">
            <range-input
              w-full
              v-model="i.value"
              :limit="i.limit"
              :disabled="!g.enable || disabledAll"
              :label="i.label"
              :controls="i.controls"
            />
          </template>
          <template v-else>
            <el-text
              v-if="disabledAll || (i.label.length && i.label.length > 6)"
              style="align-self: self-start"
              >{{ i.label }}</el-text
            >
            <el-input
              size="small"
              v-model="i.value"
              :placeholder="i.label"
              :disabled="!g.enable || disabledAll"
            >
              <template
                #prepend
                v-if="!disabledAll && (i.label.length && i.label.length <= 6)"
                >{{ i.label }}</template
              >
            </el-input>
          </template>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { WatchStopHandle } from "vue";

const props = defineProps({
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
type OIType =
  | string
  | number
  | boolean
  | OptionItem<string>
  | OptionItem<number>
  | OptionItem<boolean>;
const optTransformer = {
  transformKey: (item: OIType, idx: number | string) => {
    if (typeof item === "object") {
      return item.label + "_" + idx;
    }
    return item + "_" + idx;
  },
  transformValue: (item: OIType) => {
    if (typeof item === "object") {
      return item.value;
    }
    return item;
  },
  transformLabel: (item: OIType) => {
    if (typeof item === "object") {
      return item.label;
    }
    if (typeof item === "boolean") {
      return item ? "true" : "false";
    }
    return item;
  },
};
const getItemType = (item: any) => {
  if (typeof item === "object") {
    if (item.value) {
      return typeof item.value;
    }
    return "object";
  }
  return typeof item;
};
const { importLastRunConfig } = useScriptApi();
const listStore = useListStore();
const { rendererList } = storeToRefs(listStore);

let isFirst = true;

const configChangeHandle = async (label?: string) => {
  if (label === "导入上次运行配置") {
    await importLastRunConfig(rendererList.value);
  }
};

let stopHandle: WatchStopHandle;
onMounted(() => {
  rendererList.value = RFormUtil.genId(rendererList.value);
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

const getSelectMinWidth = (text: string | number | boolean | object) => {
  if (typeof text === "object") {
    text = JSON.stringify(text);
  }
  if (typeof text === "number" || typeof text === "boolean") {
    text = `${text}`;
  }
  const len = Math.min(text.length - 1, 7);
  let d = 45;
  return `${d + len * 15}px`;
};
</script>

<style lang="scss" scoped>
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
