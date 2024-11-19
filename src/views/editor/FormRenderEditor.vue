<template>
  <div class="form-renderer">
    <render-item-edit-dialog
      :edit-item="ctxMenu.target"
      :edit-target="ctxMenu.editTarget"
      :groups="groupNames"
      :is-edit="ctxMenu.isEdit"
      v-model="dialogVisible"
      :rules="rules"
      @confirm="confirmHandle"
    />
    <context-menu v-model:show="ctxMenu.show" :options="ctxMenu.options">
      <context-menu-item
        v-if="ctxMenu.target.groupLabel !== '__ADD__'"
        :label="`删除${ctxMenu.target.label.length ? '组件' : '分组'}`"
        :clickClose="true"
        @click="itemDeleteHandle"
      >
        <template #icon>
          <puzzle-remove-icon />
        </template>
      </context-menu-item>
      <context-menu-item
        v-if="ctxMenu.target.groupLabel !== '__ADD__'"
        :label="`编辑${ctxMenu.target.label.length ? '组件' : '分组'}`"
        :clickClose="true"
        @click="itemEditHandle"
      >
        <template #icon>
          <puzzle-edit-icon />
        </template>
      </context-menu-item>
      <context-menu-item
        label="添加组件"
        :clickClose="true"
        @click="itemAddHandle"
      >
        <template #icon>
          <puzzle-plus-icon />
        </template>
      </context-menu-item>
    </context-menu>
    <VueDraggable
      ref="el"
      v-model="formData!"
      ghostClass="ghost"
      :animation="200"
      handle=".drag-handle"
      @end="onGroupDragEnd"
      v-if="formData?.length"
    >
      <TransitionGroup type="transition" name="fade">
        <ElCard
          class="box-card"
          v-for="g in formData"
          :key="g.groupLabel"
          :id="'form-renderer-g-' + g.groupLabel"
        >
          <template #header>
            <div
              class="card-header drag-handle"
              @contextmenu="(e:MouseEvent)=>openContextMenu(e, g.groupLabel)"
            >
              <span>{{ g.groupLabel }}</span>
              <el-switch
                v-model="g.enable"
                ml-5px
                style="--el-switch-off-color: #ff4949"
                :disabled="true"
              />
            </div>
          </template>
          <div class="form-content">
            <div class="check-content">
              <VueDraggable
                v-model="formData!"
                ghostClass="ghost"
                :animation="200"
                handle=".check-item"
                @end="(evt) => onDragEnd(evt, g.groupLabel, 'checkList')"
                ><el-checkbox
                  v-for="c in g.checkList"
                  :key="c.id"
                  :label="c.label"
                  class="check-item"
                  v-model="c.checked"
                  :disabled="!g.enable"
                  @contextmenu="(e:MouseEvent)=>openContextMenu(e, g.groupLabel, c.label, 'checkList')"
              /></VueDraggable>
            </div>
            <VueDraggable
              v-model="formData!"
              ghostClass="ghost"
              :animation="200"
              handle=".select-item"
              @end="(evt) => onDragEnd(evt, g.groupLabel, 'selectList')"
            >
              <div
                class="select-item"
                v-for="s in g.selectList"
                :key="s.id"
                :style="{
                  flexDirection:
                    s.multiple ||
                    (s.label.length && s.label.length > 6 && !s.segmented)
                      ? 'column'
                      : 'row',
                  alignItems:
                    s.multiple ||
                    (s.label.length && s.label.length > 6 && !s.segmented)
                      ? 'flex-start'
                      : 'center',
                }"
                @contextmenu="(e:MouseEvent)=>openContextMenu(e, g.groupLabel, s.label, 'selectList')"
              >
                <template v-if="!s.segmented">
                  <div flex flex-row items-center>
                    <el-tag size="small" v-if="s.group"
                      >{{ getItemType(s.options[0]?.options?.[0])
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
                          s.label.length && s.label.length > 6
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
                        s.multiple || (s.label.length && s.label.length > 6)
                          ? '100%'
                          : getSelectMinWidth(s.value),
                    }"
                    :multiple="s.multiple"
                    v-model="s.value"
                    :placeholder="s.label"
                    size="small"
                    :disabled="!g.enable"
                  >
                    <template v-if="s.group">
                      <el-option-group
                        v-for="g in s.options"
                        :key="g.groupLabel"
                        :label="g.groupLabel"
                      >
                        <el-option
                          v-for="(item, index) in g.options"
                          :key="
                            optTransformer.transformKey(item, s.id || index)
                          "
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
                        :value="optTransformer.transformValue(item)"
                      />
                    </template>
                  </el-select>
                </template>
                <template v-else>
                  <el-text
                    ml-1
                    :style="{
                      alignSelf: 'center',
                    }"
                    truncated
                    >{{ s.label }}</el-text
                  >
                  <el-segmented
                    v-model="s.value"
                    :options="s.options"
                    :disabled="!g.enable"
                  />
                </template>
              </div>
            </VueDraggable>
            <VueDraggable
              v-model="formData!"
              ghostClass="ghost"
              :animation="200"
              handle=".input-item"
              @end="(evt) => onDragEnd(evt, g.groupLabel, 'inputList')"
            >
              <div
                class="input-item"
                v-for="i in g.inputList"
                :key="i.id"
                style="align-items: flex-start"
                @contextmenu="(e:MouseEvent)=>openContextMenu(e, g.groupLabel, i.label, 'inputList')"
              >
                <template v-if="i.inputType === 'range'">
                  <range-input
                    w-full
                    v-model="i.value"
                    :limit="i.limit"
                    :disabled="!g.enable"
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
                      :disabled="!g.enable"
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
                    :disabled="!g.enable"
                    multiple-label-pos="left"
                    label-pos="left"
                    w-full
                  />
                </template>
                <template v-else-if="i.inputType === 'dir'">
                  <dir-input
                    v-model="i.value"
                    :label="i.label"
                    :disabled="!g.enable"
                    w-full
                  />
                </template>
                <template v-else>
                  <el-text
                    v-if="
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
                    :disabled="!g.enable"
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
                        i.label.length &&
                        i.label.length <= 6 &&
                        i.mod !== 'textarea'
                      "
                      >{{ i.label }}</template
                    >
                  </el-input>
                </template>
              </div>
            </VueDraggable>
            <VueDraggable
              v-model="formData!"
              ghostClass="ghost"
              :animation="200"
              handle=".picker-item"
              @end="(evt) => onDragEnd(evt, g.groupLabel, 'pickerList')"
            >
              <div
                class="picker-item"
                v-for="i in g.pickerList"
                :key="i.id"
                @contextmenu="(e:MouseEvent)=>openContextMenu(e, g.groupLabel, i.label, 'pickerList')"
              >
                <template v-if="i.pickerType === 'color'">
                  <el-text truncated>{{ i.label }}</el-text>
                  <el-color-picker
                    v-model="i.value"
                    :disabled="!g.enable"
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
                      justifyContent: i.isRange
                        ? 'flex-start'
                        : 'space-between',
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
                        :disabled="!g.enable"
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
                        :disabled="!g.enable"
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
                      justifyContent: i.isRange
                        ? 'flex-start'
                        : 'space-between',
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
                        :disabled="!g.enable"
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
                        :disabled="!g.enable"
                        :placeholder="i.placeholder"
                        :value-format="getValueFormat(i)"
                        size="small"
                      />
                    </template>
                  </div>
                </template>
              </div>
            </VueDraggable>
          </div>
        </ElCard>
      </TransitionGroup>
    </VueDraggable>
    <el-empty
      v-else
      description="暂无组件，可通过右键菜单添加组件"
      w-full
      h-full
      @contextmenu="(e:MouseEvent)=>openContextMenu(e, '__ADD__')"
    />
  </div>
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";
import { ContextMenu, ContextMenuItem } from "@imengyu/vue3-context-menu";
type OIType =
  | string
  | number
  | boolean
  | OptionItem<string>
  | OptionItem<number>
  | OptionItem<boolean>;
const { appAsideBgColor, isDark } = useAppTheme();
const { ctxMenu } = useRenderItemEditForm();
const dialogVisible = ref(false);

const itemDeleteHandle = () => {
  const { groupLabel, label, listName } = ctxMenu.target;
  if (formData.value) {
    const targetIndex = formData.value.findIndex(
      (g) => g.groupLabel === groupLabel
    );
    if (label === "" || listName === "") {
      ElMessageBox.confirm("是否删除整个分组?", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
      })
        .then(() => {
          formData.value?.splice(targetIndex, 1);
          ElMessage.success("分组删除完成");
        })
        .catch(() => {});
      return;
    }
    const target = formData.value[targetIndex];
    const key = listName as
      | "checkList"
      | "inputList"
      | "selectList"
      | "pickerList";
    if (target && target[key]) {
      target[key] = target[key].filter((item) => item.label !== label) as any;
      ElMessage.success("删除完成");
    } else {
      ElMessage.error("删除失败");
    }
  }
};

const itemEditHandle = () => {
  const key = ctxMenu.target.listName;
  if (key === "") {
    ctxMenu.editTarget = "group";
  } else {
    ctxMenu.editTarget = "item";
  }
  ctxMenu.isEdit = true;
  dialogVisible.value = true;
};

const itemAddHandle = () => {
  ctxMenu.target.label = "";
  ctxMenu.isEdit = false;
  dialogVisible.value = true;
};

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
const formData = defineModel<RenderGroup[]>();

const groupNames = computed(() => {
  return formData.value?.map((g) => g.groupLabel) || [];
});

const onDragEnd = (
  evt: any,
  groupLabel: string,
  _type: "checkList" | "inputList" | "selectList" | "pickerList"
) => {
  if (formData.value) {
    const { newIndex, oldIndex } = evt;
    const target = formData.value.find((g) => g.groupLabel === groupLabel);
    if (target && target.checkList) {
      const [removed] = target[_type].splice(oldIndex, 1);
      target[_type].splice(newIndex, 0, removed as any);
    }
  }
};
const onGroupDragEnd = (evt: any) => {
  if (formData.value) {
    const { newIndex, oldIndex } = evt;
    const [removed] = formData.value.splice(oldIndex, 1);
    formData.value.splice(newIndex, 0, removed);
    formData.value = formData.value.map((g: any, idx) => {
      g.idx = idx;
      return g;
    });
  }
};
const openContextMenu = (
  event: MouseEvent,
  groupLabel: string,
  label?: string,
  listName?: "checkList" | "inputList" | "selectList" | "pickerList"
) => {
  event.preventDefault();
  ctxMenu.show = true;
  ctxMenu.options = {
    x: event.clientX,
    y: event.clientY,
    zIndex: 9999,
    theme: isDark.value ? "default dark" : "default",
  };
  
  let item = null;
  const targetItem = formData.value?.find((f) => f.groupLabel === groupLabel);
  if (targetItem) {
    const key = listName || "";
    if (key) {
      const target = targetItem[key].find((i) => i.label === label);
      if (target) {
        item = target;
      }
    }
  }
  ctxMenu.target = {
    groupLabel,
    label: label || "",
    listName: listName || "",
    item,
  };
};

const { rules } = useRenderItemEditForm();

const confirmHandle = (
  item: RenderCodeItem,
  isEdit: boolean,
  oldGroupLabel: string,
  oldLabel: string,
  t: "checkList" | "inputList" | "selectList" | "pickerList",
  validate: boolean
) => {
  if (!validate) {
    return;
  }
  if (!formData.value) {
    ElMessage.error("数据异常");
    return;
  }
  if (ctxMenu.editTarget === "group") {
    if (item.targetGroupLabel === oldGroupLabel) {
      return;
    } else {
      const newGroup = formData.value.find(
        (g) => g.groupLabel === item.targetGroupLabel
      );
      if (!newGroup) {
        formData.value.find((g) => g.groupLabel === oldGroupLabel)!.groupLabel =
          item.targetGroupLabel;
        dialogVisible.value = false;
        ElMessage.success("修改成功");
      } else {
        ElMessageBox.confirm("新分组已存在，是否合并分组？", {
          confirmButtonText: "合并",
          cancelButtonText: "取消",
        })
          .then(() => {
            const oldGroupIndex = formData.value!.findIndex(
              (g) => g.groupLabel === oldGroupLabel
            );
            const oldGroup = formData.value![oldGroupIndex];
            const newGroup = formData.value!.find(
              (g) => g.groupLabel === item.targetGroupLabel
            );
            newGroup?.checkList.push(...(oldGroup?.checkList || []));
            newGroup?.inputList.push(...(oldGroup?.inputList || []));
            newGroup?.selectList.push(...(oldGroup?.selectList || []));
            newGroup?.pickerList.push(...(oldGroup?.pickerList || []));
            if (oldGroup) {
              formData.value!.splice(oldGroupIndex, 1);
            }
            dialogVisible.value = false;
            ElMessage.success("修改成功");
          })
          .catch(() => {});
      }
    }
  } else {
    if (!isEdit) {
      let targetGroup = formData.value!.find(
        (g) => g.groupLabel === oldGroupLabel
      );
      if (!targetGroup) {
        formData.value.push({
          groupLabel: oldGroupLabel,
          enable: true,
          checkList: [],
          inputList: [],
          selectList: [],
          pickerList: [],
        });
        targetGroup = formData.value[formData.value.length - 1];
      }
      let targetList = targetGroup[t];
      targetList.push(item as any);
      dialogVisible.value = false;
      ElMessage.success("添加成功");
    } else {
      const newGroup = item.targetGroupLabel;
      if (newGroup === oldGroupLabel) {
        const targetGroup = formData.value.find(
          (g) => g.groupLabel === oldGroupLabel
        );
        if (targetGroup) {
          const targetIndex = targetGroup[t].findIndex(
            (i) => i.label === oldLabel
          );
          if (targetIndex !== -1) {
            targetGroup[t][targetIndex] = item as any;
            dialogVisible.value = false;
            ElMessage.success("修改成功");
          } else {
            ElMessage.error("数据异常");
            return;
          }
        } else {
          ElMessage.error("数据异常");
          return;
        }
      } else {
        let targetGroup = formData.value.find((g) => g.groupLabel === newGroup);
        if (!targetGroup) {
          formData.value.push({
            groupLabel: newGroup,
            enable: true,
            checkList: [],
            inputList: [],
            selectList: [],
            pickerList: [],
          });
          targetGroup = formData.value[formData.value.length - 1];
        }
        const oldGroup = formData.value.find(
          (g) => g.groupLabel === oldGroupLabel
        );
        if (oldGroup) {
          const targetIndex = oldGroup[t].findIndex(
            (i) => i.label === oldLabel
          );
          if (targetIndex !== -1) {
            oldGroup[t].splice(targetIndex, 1);
          }
        }
        targetGroup[t].push(item as any);
        dialogVisible.value = false;
        ElMessage.success("修改成功");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-renderer {
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
.drag-handle {
  cursor: move;
}
</style>
<style lang="scss">
.form-renderer {
  overflow-x: hidden;

  .el-card__body {
    padding: 0 20px;
  }

  .el-card__header {
    padding: 5px 20px;
  }
}
</style>
