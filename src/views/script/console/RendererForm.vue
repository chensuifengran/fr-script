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
            :key="c.id"
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
          :key="s.id"
          :style="{
            flexDirection:
              disabledAll ||
              s.multiple ||
              (s.label.length && s.label.length > 6 && !s.segmented)
                ? 'column'
                : 'row',
            alignItems:
              disabledAll ||
              s.multiple ||
              (s.label.length && s.label.length > 6 && !s.segmented)
                ? 'flex-start'
                : 'center',
          }"
        >
          <template v-if="!s.segmented">
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
                truncated
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
          </template>
          <template v-else>
            <el-text
              ml-1
              :style="{
                alignSelf: disabledAll ? 'self-start' : 'center',
              }"
              truncated
              >{{ s.label }}</el-text
            >
            <el-segmented
              v-model="s.value"
              :options="s.options"
              :disabled="disabledAll || !g.enable"
            />
          </template>
        </div>
        <div
          class="input-item"
          v-for="i in g.inputList"
          :key="i.id"
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
          <template v-else-if="i.inputType === 'number'">
            <div w-full flex flex-row items-center justify-between>
              <el-text truncated>{{ i.label }}</el-text>
              <el-input-number
                size="small"
                v-model="i.value"
                :min="i.min"
                :max="i.max"
                :step="i.step"
                :disabled="!g.enable || disabledAll"
                :controls="i.controls"
                :controls-position="i.controlsPosition"
                :step-strictly="i.stepStrictly"
                :precision="i.precision"
                :valueOnClear="i.valueOnClear"
              />
            </div>
          </template>
          <template v-else-if="i.inputType === 'file'">
            <file-input
              v-model="i.value"
              :label="i.label"
              :multiple="i.multiple"
              :disabled="!g.enable || disabledAll"
              :multiple-label-pos="disabledAll ? 'top' : 'left'"
              label-pos="left"
              w-full
            />
          </template>
          <template v-else>
            <el-text
              v-if="
                disabledAll ||
                i.mod === 'textarea' ||
                (i.label.length && i.label.length > 6)
              "
              truncated
              style="align-self: self-start"
              >{{ i.label }}</el-text
            >
            <el-input
              size="small"
              v-model="i.value"
              :placeholder="i.placeholder || i.label"
              :type="i.mod ? i.mod : 'text'"
              :clearable="i.clearable"
              :show-password="i.showPassword"
              :disabled="!g.enable || disabledAll"
              :maxlength="i.maxlength"
              :show-word-limit="i.showWordLimit"
              :autosize="
                typeof i.autosize === 'object'
                  ? {
                      minRows: i.autosize[0],
                      maxRows: i.autosize[1],
                    }
                  : typeof i.autosize === 'number'
                  ? { minRows: i.autosize, maxRows: i.autosize }
                  : i.autosize
              "
            >
              <template
                #prepend
                v-if="
                  !disabledAll &&
                  i.label.length &&
                  i.label.length <= 6 &&
                  i.mod !== 'textarea'
                "
                >{{ i.label }}</template
              >
            </el-input>
          </template>
        </div>
        <div class="picker-item" v-for="i in g.pickerList" :key="i.id">
          <template v-if="i.pickerType === 'color'">
            <el-text truncated>{{ i.label }}</el-text>
            <el-color-picker
              v-model="i.value"
              :disabled="!g.enable || disabledAll"
              size="small"
              :show-alpha="enableAlpha(i.enableAlpha, i.colorFormat)"
              :color-format="processFormat(i.colorFormat)"
              :predefine="i.predefine"
            />
          </template>
          <template v-else-if="i.pickerType === 'time'">
            <div
              class="time-picker-content"
              :style="{
                flexDirection: i.isRange ? 'column' : 'row',
                justifyContent: i.isRange ? 'flex-start' : 'space-between',
              }"
            >
              <el-text
                :style="{
                  alignSelf: i.isRange ? 'flex-start' : 'center',
                }"
                truncated
                >{{ i.label }}</el-text
              >
              <template v-if="i.isRange">
                <el-time-picker
                  class="time-picker"
                  v-model="i.value"
                  :default-value="[new Date(), new Date()]"
                  :is-range="i.isRange"
                  :start-placeholder="i.startPlaceholder"
                  :end-placeholder="i.endPlaceholder"
                  :disabled="!g.enable || disabledAll"
                  :range-separator="i.rangeSeparator"
                  :disabled-hours="i.disabledHours"
                  :disabled-minutes="i.disabledMinutes"
                  :disabled-seconds="i.disabledSeconds"
                  :value-format="getValueFormat(i)"
                  size="small"
                />
              </template>
              <template v-else>
                <el-time-picker
                  v-model="i.value"
                  :default-value="new Date()"
                  :disabled="!g.enable || disabledAll"
                  :placeholder="i.placeholder"
                  :disabled-hours="i.disabledHours"
                  :disabled-minutes="i.disabledMinutes"
                  :disabled-seconds="i.disabledSeconds"
                  :value-format="getValueFormat(i)"
                  size="small"
                />
              </template>
            </div>
          </template>
          <template v-else-if="i.pickerType === 'date'">
            <div
              class="time-picker-content"
              :style="{
                flexDirection: i.isRange ? 'column' : 'row',
                justifyContent: i.isRange ? 'flex-start' : 'space-between',
              }"
            >
              <el-text
                :style="{
                  alignSelf: i.isRange ? 'flex-start' : 'center',
                }"
                truncated
                >{{ i.label }}</el-text
              >
              <template v-if="i.isRange">
                <el-date-picker
                  class="time-picker"
                  v-model="i.value"
                  :default-value="[new Date(), new Date()]"
                  type="datetimerange"
                  :start-placeholder="i.startPlaceholder"
                  :end-placeholder="i.endPlaceholder"
                  :disabled="!g.enable || disabledAll"
                  :range-separator="i.rangeSeparator"
                  :value-format="getValueFormat(i)"
                  size="small"
                />
              </template>
              <template v-else>
                <el-date-picker
                  v-model="i.value"
                  :default-value="new Date()"
                  type="datetime"
                  :disabled="!g.enable || disabledAll"
                  :placeholder="i.placeholder"
                  :value-format="getValueFormat(i)"
                  size="small"
                />
              </template>
            </div>
          </template>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { WatchStopHandle } from "vue";
const { appAsideBgColor } = useAppTheme();
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
const { importLastRunConfig, replaceRendererList } = useScriptApi();
const listStore = useListStore();
const { rendererList } = storeToRefs(listStore);
let syncFormTimer: NodeJS.Timeout | null = null;
watch(
  rendererList,
  (val) => {
    console.log("rendererList changed");

    syncFormTimer && clearTimeout(syncFormTimer);
    syncFormTimer = setTimeout(() => {
      useWss().syncRendererList(val, true);
    }, 500);
  },
  {
    deep: true,
  }
);
let isFirst = true;

const configChangeHandle = async (label?: string) => {
  if (label === "导入上次运行配置") {
    await importLastRunConfig(rendererList.value);
  }
};
let stopHandle: WatchStopHandle;
let unlistenMsg: () => void = () => {};
onMounted(() => {
  const { syncRendererList, onMsg, existSyncId, deprecatedSyncId } = useWss();
  unlistenMsg = onMsg((msg) => {
    if (msg.type === "COMMAND") {
      if (msg.command === "SYNC_FORM") {
        if (!existSyncId(msg.syncId)) {
          replaceRendererList(resetRListDate(msg.form));
        }
      } else if (msg.command === "DEPRECATED_SYNC_ID") {
        deprecatedSyncId(msg.syncId);
      }
    }
  });
  rendererList.value = RFormUtil.genId(rendererList.value);
  stopHandle = watchEffect(async () => {
    const reInit = props.reInit();
    if (reInit) {
      isFirst = true;
    }
    if (!isFirst) return;
  });
  const { controlDeviceInfo } = useControl();
  if (controlDeviceInfo.willSyncForm) {
    syncRendererList(rendererList.value);
  }
});
onBeforeUnmount(() => {
  if (stopHandle) {
    stopHandle();
  }
  unlistenMsg();
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
const enableAlpha = (enable?: boolean, colorFormat?: string) => {
  if (enable === undefined) {
    if (colorFormat) {
      if (colorFormat.toLocaleLowerCase().endsWith("a")) {
        return true;
      }
    }
    return false;
  }
  return enable;
};
const processFormat = (format?: string) => {
  if (!format) {
    return "hex";
  }
  format = format.toLocaleLowerCase();
  if (format.endsWith("a")) {
    format = format.replace("a", "");
  }
  return format;
};
const getValueFormat = (item: Record<string, any>) => {
  if (item.valueFormat) {
    return item.valueFormat as string;
  }
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
      .picker-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 5px;
        box-sizing: border-box;
        border-radius: 5px;
        margin-bottom: 2px;
        .time-picker-content {
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          :deep(.time-picker) {
            width: 100%;
            box-sizing: border-box;
            padding: 0 5px;
          }
        }
        &:hover {
          background: v-bind(appAsideBgColor);
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
        padding: 5px;
        box-sizing: border-box;
        border-radius: 5px;
        .select {
          max-width: 70%;
        }
        &:hover {
          background: v-bind(appAsideBgColor);
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
