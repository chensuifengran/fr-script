<template>
  <general-dialog
    :callback="dialogOptions.ok"
    :cancel="dialogOptions.cancel"
    :title="title"
    :cancel-text="dialogOptions.cancelText"
    :confirm-text="dialogOptions.confirmText"
    v-model="visible"
  >
    <template #element>
      <div class="edit-form" v-show="!useAddOptionDialog">
        <el-form
          label-position="top"
          :model="form"
          :rules="rules"
          ref="formEl"
        >
          <el-form-item label="分组标签" prop="groupLabel">
            <el-select
              v-model="form.groupLabel"
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="*脚本设置"
            >
              <el-option
                v-for="(item, idx) in props.groups"
                :key="idx"
                :label="item"
                :value="item"
              />
              <template #label="{ label }">
                <div flex flex-row flex-items-center>
                  <el-tag
                    type="success"
                    mr-1
                    v-if="!props.groups?.includes(label)"
                    >new</el-tag
                  >
                  <el-text>{{ label }}</el-text>
                </div>
              </template>
            </el-select>
          </el-form-item>
          <template v-if="props.editTarget === 'item'">
            <el-form-item label="ID(选填)" prop="id">
              <el-input v-model="form.id" clearable>
                <template #append>
                  <el-button link @click="randomId" type="primary">
                    <random-icon />
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="组件标签" prop="label">
              <el-input v-model="form.label" clearable />
            </el-form-item>
            <el-form-item label="组件类型" prop="componentType">
              <el-segmented
                :options="fieldTypeOptions"
                v-model="form.componentType"
                :disabled="isEdit"
              />
            </el-form-item>
            <template v-if="form.componentType === FieldType.Check">
              <el-form-item label="是否默认选中" prop="cForm.check.checked">
                <el-switch v-model="form.cForm.check.checked" />
              </el-form-item>
            </template>
            <template v-else-if="form.componentType === FieldType.Picker">
              <picker-form-items :is-edit="isEdit" />
            </template>
            <template v-else-if="form.componentType === FieldType.Select">
              <select-form-items
                :is-edit="isEdit"
                @on-open-add-option="openAddOptionDialog"
              />
            </template>
            <template v-else-if="form.componentType === FieldType.Input">
              <input-form-items :is-edit="isEdit" />
            </template>
          </template>
        </el-form>
      </div>
      <div v-show="useAddOptionDialog">
        <options-add-form />
      </div>
    </template>
  </general-dialog>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import { FieldType } from "../../utils/enums.ag";
import { nanoid } from "nanoid";
import { type RenderFormInstance } from "../../hooks/useRenderItemEditForm";
import type { FormRules } from "element-plus";
import { templateRef } from "@vueuse/core";

const { form, useAddOptionDialog, addOptionForm } = useRenderItemEditForm();

const formEl = templateRef("formEl");

const props = defineProps({
  editItem: {
    type: Object as PropType<{
      groupLabel: string;
      label: string;
      item: RenderItem | null;
      listName: "checkList" | "inputList" | "selectList" | "pickerList" | "";
    }>,
    required: true,
  },
  editTarget: {
    type: String as PropType<"item" | "group">,
    default: "item",
  },
  groups: {
    type: Array as PropType<string[]>,
    default: [],
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object as PropType<FormRules<RenderFormInstance>>,
    default: () => ({}),
  },
});

const fieldTypeOptions = [
  {
    label: "复选框",
    value: FieldType.Check,
  },
  {
    label: "输入框",
    value: FieldType.Input,
  },
  {
    label: "下拉框",
    value: FieldType.Select,
  },
  {
    label: "颜色时间选择器",
    value: FieldType.Picker,
  },
];

let oldInfo = {
  groupLabel: "",
  label: "",
};

const emit = defineEmits<{
  confirm: [
    item: RenderCodeItem,
    isEdit: boolean,
    oldGroupLabel: string,
    oldLabel: string,
    type: "checkList" | "inputList" | "selectList" | "pickerList",
    validate: boolean
  ];
}>();

const visible = defineModel({
  required: true,
  type: Boolean,
});

const title = computed(() => {
  if (useAddOptionDialog.value) {
    return `添加分段选择选项`;
  } else {
    return `${props.isEdit ? "编辑" : "添加"}${
      props.editTarget === "group" ? "分组" : "组件"
    }`;
  }
});

const randomId = () => {
  form.id = nanoid(8);
};

watch(visible, (val) => {
  if (val) {
    switch (props.editItem.listName) {
      case "inputList":
        form.componentType = FieldType.Input;
        break;
      case "selectList":
        form.componentType = FieldType.Select;
        break;
      case "pickerList":
        form.componentType = FieldType.Picker;
        break;
      default:
        form.componentType = FieldType.Check;
        break;
    }
    oldInfo.groupLabel = props.editItem.groupLabel;
    oldInfo.label = props.editItem.label;
    form.groupLabel = props.editItem.groupLabel;
    form.label = props.editItem.label;
    form.id = props.editItem.item?.id;
    if (props.editItem.listName === "checkList") {
      if (props.editItem.item && "checked" in props.editItem.item) {
        form.cForm.check.checked = props.editItem.item.checked || false;
      }
    } else if (props.editItem.listName === "pickerList") {
      if (props.editItem.item && "pickerType" in props.editItem.item) {
        if (props.editItem.item.pickerType === "color") {
          form.cForm.picker.pickerType = "color";
          form.cForm.picker.colorFields.alpha =
            props.editItem.item.enableAlpha || false;
          form.cForm.picker.colorFields.predefine =
            props.editItem.item.predefine || [];
          form.cForm.picker.colorFields.colorFormat =
            props.editItem.item.colorFormat || "hex";
          form.cForm.picker.colorFields.value =
            props.editItem.item.value || "#000000";
        } else if (props.editItem.item.pickerType === "time") {
          form.cForm.picker.pickerType = "time";
          form.cForm.picker.dtFields.isRange =
            props.editItem.item.isRange || false;
          if ("startPlaceholder" in props.editItem.item) {
            form.cForm.picker.dtFields.startPlaceholder =
              props.editItem.item.startPlaceholder || "开始时间";
          }
          if ("endPlaceholder" in props.editItem.item) {
            form.cForm.picker.dtFields.endPlaceholder =
              props.editItem.item.endPlaceholder || "结束时间";
          }
          if ("rangeSeparator" in props.editItem.item) {
            form.cForm.picker.dtFields.rangeSeparator =
              props.editItem.item.rangeSeparator || "~";
          }
          if ("valueFormat" in props.editItem.item) {
            if (form.cForm.picker.dtFields.isRange) {
              form.cForm.picker.dtFields.rangeValue = props.editItem.item
                .value as [string, string];
            } else {
              form.cForm.picker.dtFields.value = props.editItem.item
                .value as string;
            }
            form.cForm.picker.dtFields.valueFormat =
              props.editItem.item.valueFormat || "";
          } else {
            form.cForm.picker.dtFields.valueFormat = "";
            if (form.cForm.picker.dtFields.isRange) {
              form.cForm.picker.dtFields.rangeValue = (props.editItem.item
                .value as [Date, Date]) || [new Date(), new Date()];
            } else {
              form.cForm.picker.dtFields.value =
                (props.editItem.item.value as Date) || new Date();
            }
          }
          form.cForm.picker.dtFields.disabledHours =
            props.editItem.item.disabledHours?.toString() || "";
          form.cForm.picker.dtFields.disabledMinutes =
            props.editItem.item.disabledMinutes?.toString() || "";
          form.cForm.picker.dtFields.disabledSeconds =
            props.editItem.item.disabledSeconds?.toString() || "";
        } else {
          form.cForm.picker.pickerType = "date";
          form.cForm.picker.dtFields.isRange =
            props.editItem.item.isRange || false;
          if (form.cForm.picker.dtFields.isRange) {
            form.cForm.picker.dtFields.rangeValue = (props.editItem.item
              .value as any) || [new Date(), new Date()];
          } else {
            form.cForm.picker.dtFields.value =
              (props.editItem.item.value as any) || new Date();
          }
          if ("startPlaceholder" in props.editItem.item) {
            form.cForm.picker.dtFields.startPlaceholder =
              props.editItem.item.startPlaceholder || "开始日期";
          }
          if ("endPlaceholder" in props.editItem.item) {
            form.cForm.picker.dtFields.endPlaceholder =
              props.editItem.item.endPlaceholder || "结束日期";
          }
          if ("rangeSeparator" in props.editItem.item) {
            form.cForm.picker.dtFields.rangeSeparator =
              props.editItem.item.rangeSeparator || "~";
          }
          if ("valueFormat" in props.editItem.item) {
            form.cForm.picker.dtFields.valueFormat =
              props.editItem.item.valueFormat || "";
          } else {
            form.cForm.picker.dtFields.valueFormat = "";
          }
        }
      }
    } else if (props.editItem.listName === "selectList") {
      const item = props.editItem.item as SelectListItem;
      if (item?.segmented) {
        form.cForm.select.segmented = true;
        form.cForm.select.multiple = false;
        form.cForm.select.validOptions = item.options.map((item) => {
          if (typeof item === "object") {
            return item.value;
          }
          return item;
        });
        form.cForm.select.baseOptions = item.options;
        form.cForm.select.segmentedValue = item.value;
        if (typeof item.options[0] === "object") {
          addOptionForm.opType = "对象";
          form.cForm.select.valueType = typeof item.options[0].value as
            | "string"
            | "number"
            | "boolean";
        } else {
          addOptionForm.opType = "常量";
          form.cForm.select.valueType = typeof item.options[0] as
            | "string"
            | "number"
            | "boolean";
        }
      } else {
        form.cForm.select.segmented = false;
        if (!item) {
          return;
        }
        form.cForm.select.multiple = item.multiple || false;
        form.cForm.select.validOptions = item.options.flatMap((o) => {
          if (typeof o === "object") {
            if ("groupLabel" in o) {
              return o.options.map((o_) => {
                if (typeof o_ === "object") {
                  return o_.value;
                }
                return o_;
              });
            }
            if (typeof o === "object") {
              return o.value;
            }
          }
          return o;
        });
        let targetOption;
        if (item.group) {
          form.cForm.select.enabledGroupOption = true;
          form.cForm.select.groupOptions = item.options;
          targetOption = item.options[0]?.options[0];
        } else {
          form.cForm.select.enabledGroupOption = false;
          form.cForm.select.baseOptions = item.options;
          targetOption = item.options[0];
        }
        if (typeof targetOption === "object") {
          addOptionForm.opType = "对象";
          form.cForm.select.valueType = typeof targetOption.value as
            | "string"
            | "number"
            | "boolean";
        } else {
          addOptionForm.opType = "常量";
          if (targetOption === undefined) {
            form.cForm.select.valueType = "string";
          } else {
            form.cForm.select.valueType = typeof targetOption as
              | "string"
              | "number"
              | "boolean";
          }
        }
        if (item.multiple) {
          form.cForm.select.mValue = item.value;
        } else {
          form.cForm.select.sValue = item.value;
        }
      }
    } else if (props.editItem.listName === "inputList") {
      if (props.editItem.item) {
        const item = props.editItem.item as InputListItem;
        if (item.inputType === "text" || !item.inputType) {
          form.cForm.input.inputType = "text";
          form.cForm.input.text.mod = item.mod || "text";
          form.cForm.input.text.placeholder = item.placeholder || "";
          form.cForm.input.text.clearable = item.clearable || false;
          form.cForm.input.text.maxlength = item.maxlength || -1;
          form.cForm.input.text.showWordLimit = item.showWordLimit || false;
          form.cForm.input.text.showPassword = item.showPassword || false;
          form.cForm.input.text.value = item.value || "";
          if (Array.isArray(item.autosize)) {
            form.cForm.input.text.autosizeConf = "custom";
            form.cForm.input.text.autosize = item.autosize.map(
              (i) => i || 2
            ) as [number, number];
          } else if (typeof item.autosize === "boolean") {
            form.cForm.input.text.autosizeConf = item.autosize
              ? "open"
              : "close";
            form.cForm.input.text.autosize = [2, 2];
          } else if (typeof item.autosize === "number") {
            form.cForm.input.text.autosizeConf = "custom";
            form.cForm.input.text.autosize = [item.autosize, item.autosize];
          } else {
            form.cForm.input.text.autosizeConf = "close";
            form.cForm.input.text.autosize = [2, 2];
          }
        } else if (item.inputType === "number") {
          form.cForm.input.inputType = "number";
          form.cForm.input.number.min = item.min || NaN;
          form.cForm.input.number.max = item.max || NaN;
          form.cForm.input.number.step = item.step || 1;
          form.cForm.input.number.stepStrictly = item.stepStrictly || false;
          form.cForm.input.number.precision = item.precision || undefined;
          form.cForm.input.number.controls = item.controls || false;
          form.cForm.input.number.controlsPosition =
            item.controlsPosition || "";
          form.cForm.input.number.value = item.value || 0;
          if (!item.valueOnClear) {
            form.cForm.input.number.valueOnClearMod = "default";
            form.cForm.input.number.valueOnClearNum = 0;
          } else if (typeof item.valueOnClear === "string") {
            form.cForm.input.number.valueOnClearMod = item.valueOnClear;
            form.cForm.input.number.valueOnClearNum = 0;
          } else {
            form.cForm.input.number.valueOnClearMod = "custom";
            form.cForm.input.number.valueOnClearNum = item.valueOnClear;
          }
        } else if (item.inputType === "range") {
          form.cForm.input.inputType = "range";
          form.cForm.input.range.limitRange = !!item.limit;
          form.cForm.input.range.limit = item.limit || [-9999, 9999];
          form.cForm.input.range.controls = item.controls || false;
          form.cForm.input.range.value = item.value || [0, 100];
        } else if (item.inputType === "dir") {
          form.cForm.input.inputType = "dir";
          form.cForm.input.dir.value = item.value || "";
        } else if (item.inputType === "file") {
          form.cForm.input.inputType = "file";
          form.cForm.input.file.multiple = item.multiple || false;
          if (item.multiple) {
            form.cForm.input.file.mValue = item.value || [];
          } else {
            form.cForm.input.file.sValue = item.value || "";
          }
        }
      }
    } else {
      if (props.editItem.item) {
        (form.cForm as any)[props.editItem.listName.replace("List", "")] = (
          props.editItem.item as any
        ).value;
      }
    }
  }
});

const confirm = () => {
  let item: RenderCodeItem;
  switch (form.componentType) {
    case FieldType.Check:
      item = {
        targetGroupLabel: form.groupLabel,
        label: form.label,
        id: form.id,
        ...form.cForm.check,
      } as unknown as RenderCodeItem;
      break;
    case FieldType.Input:
      const fInput = form.cForm.input;
      let inputFields = {};
      if (fInput.inputType === "text" || !fInput.inputType) {
        const text = fInput.text;
        inputFields = {
          inputType: undefined,
          mod: text.mod === "text" ? undefined : text.mod,
          placeholder: text.placeholder === "" ? undefined : text.placeholder,
          clearable:
            text.mod === "textarea"
              ? undefined
              : text.clearable
              ? true
              : undefined,
          maxlength: text.maxlength === -1 ? undefined : text.maxlength,
          showWordLimit: text.showWordLimit ? true : undefined,
          autosize:
            text.mod !== "textarea"
              ? undefined
              : text.autosizeConf === "custom"
              ? text.autosize
              : text.autosizeConf === "close"
              ? undefined
              : true,
          showPassword:
            text.mod !== "password"
              ? undefined
              : text.showPassword
              ? true
              : undefined,
          value: text.value,
        };
      } else if (fInput.inputType === "number") {
        const n = fInput.number;
        inputFields = {
          inputType: "number",
          min: Number.isNaN(n.min) ? undefined : n.min,
          max: Number.isNaN(n.max) ? undefined : n.max,
          step: n.step === 1 ? undefined : n.step,
          stepStrictly: n.stepStrictly ? true : undefined,
          precision: n.precision,
          controls: n.controls ? true : undefined,
          controlsPosition:
            n.controlsPosition === "" ? undefined : n.controlsPosition,
          valueOnClear:
            n.valueOnClearMod === "custom"
              ? n.valueOnClearNum
              : n.valueOnClearMod === "default"
              ? undefined
              : n.valueOnClearMod,
          value: n.value,
        };
      } else if (fInput.inputType === "range") {
        const range = fInput.range;
        inputFields = {
          inputType: "range",
          limit: range.limitRange ? range.limit : undefined,
          controls: range.controls ? true : undefined,
          value: range.value,
        };
      } else if (fInput.inputType === "dir") {
        inputFields = {
          inputType: "dir",
          value: fInput.dir.value,
        };
      } else if (fInput.inputType === "file") {
        inputFields = {
          inputType: "file",
          multiple: fInput.file.multiple,
          value: fInput.file.multiple ? fInput.file.mValue : fInput.file.sValue,
        };
      }
      item = {
        targetGroupLabel: form.groupLabel,
        label: form.label,
        id: form.id,
        ...inputFields,
      } as unknown as RenderCodeItem;
      break;
    case FieldType.Select:
      const fSelect = form.cForm.select;
      let selectFields = {};
      if (fSelect.segmented) {
        selectFields = {
          segmented: true,
          value: fSelect.segmentedValue,
          options: fSelect.baseOptions.filter((o) => {
            return fSelect.validOptions.find((v) => {
              if (typeof o === "object") {
                return v === o.value;
              } else {
                return v === o;
              }
            });
          }),
        };
      } else {
        selectFields = {
          segmented: false,
          multiple: fSelect.multiple,
          value: fSelect.multiple ? fSelect.mValue : fSelect.sValue,
          group: fSelect.enabledGroupOption,
          options: fSelect.enabledGroupOption
            ? fSelect.groupOptions
                .map((g) => {
                  const options = g.options.filter((o) => {
                    if (typeof o === "object") {
                      return fSelect.validOptions.includes(o.value);
                    }
                    return fSelect.validOptions.includes(o);
                  });
                  if (options.length) {
                    return {
                      groupLabel: g.groupLabel,
                      options,
                    };
                  }
                  return null;
                })
                .filter((g) => g !== null)
            : fSelect.baseOptions.filter((o) => {
                if (typeof o === "object") {
                  return fSelect.validOptions.includes(o.value);
                }
                return fSelect.validOptions.includes(o);
              }),
        };
      }
      item = {
        targetGroupLabel: form.groupLabel,
        label: form.label,
        id: form.id,
        ...selectFields,
      } as unknown as RenderCodeItem;
      break;
    case FieldType.Picker:
      const fPicker = form.cForm.picker;
      let pickerFields = {};
      if (fPicker.pickerType === "color") {
        const color = fPicker.colorFields;
        pickerFields = {
          value: color.value,
          predefine: color.predefine,
          colorFormat: color.colorFormat,
          enableAlpha: color.alpha,
          pickerType: "color",
        };
      } else if (fPicker.pickerType === "time") {
        const dt = fPicker.dtFields;
        const isRange = dt.isRange;
        pickerFields = {
          value: isRange ? dt.rangeValue : dt.value,
          isRange,
          startPlaceholder: isRange ? dt.startPlaceholder : undefined,
          endPlaceholder: isRange ? dt.endPlaceholder : undefined,
          rangeSeparator: isRange ? dt.rangeSeparator : undefined,
          valueFormat: dt.valueFormat === "" ? undefined : dt.valueFormat,
          placeholder: !isRange ? dt.placeholder : undefined,
          disabledHours: transformFnStr(dt.disabledHours),
          disabledMinutes: transformFnStr(dt.disabledMinutes),
          disabledSeconds: transformFnStr(dt.disabledSeconds),
          pickerType: "time",
        };
      } else {
        const dt = fPicker.dtFields;
        const isRange = dt.isRange;
        pickerFields = {
          value: isRange ? dt.rangeValue : dt.value,
          isRange,
          startPlaceholder: isRange ? dt.startPlaceholder : undefined,
          endPlaceholder: isRange ? dt.endPlaceholder : undefined,
          rangeSeparator: isRange ? dt.rangeSeparator : undefined,
          valueFormat: dt.valueFormat === "" ? undefined : dt.valueFormat,
          placeholder: !isRange ? dt.placeholder : undefined,
          pickerType: "date",
        };
      }
      item = {
        targetGroupLabel: form.groupLabel,
        label: form.label,
        id: form.id,
        ...pickerFields,
      } as unknown as RenderCodeItem;
      break;
    default:
      item = {
        targetGroupLabel: form.groupLabel,
        label: "",
        id: "",
        value: "",
      } as unknown as RenderCodeItem;
  }
  formEl.value?.validate(async (valid: boolean) => {
    emit(
      "confirm",
      item,
      props.isEdit,
      oldInfo.groupLabel,
      oldInfo.label,
      (form.componentType + "List") as
        | "checkList"
        | "inputList"
        | "selectList"
        | "pickerList",
      valid
    );
  });
};

const dialogOptions = reactive({
  confirmText: "确定",
  cancelText: "取消",
  cancel: () => {
    visible.value = false;
  },
  ok: confirm,
});

const openAddOptionDialog = () => {
  useAddOptionDialog.value = true;
  dialogOptions.confirmText = "添加";
  dialogOptions.cancelText = "返回";
  dialogOptions.cancel = () => {
    useAddOptionDialog.value = false;
    dialogOptions.confirmText = "确定";
    dialogOptions.cancelText = "取消";
    dialogOptions.cancel = () => {
      visible.value = false;
    };
    dialogOptions.ok = confirm;
  };
  dialogOptions.ok = () => {
    let item;
    if (form.cForm.select.valueType === "string") {
      item = addOptionForm.stringValue;
    } else if (form.cForm.select.valueType === "number") {
      item = addOptionForm.numberValue;
    } else {
      item = addOptionForm.booleanValue;
    }
    const enabledGroupOption = form.cForm.select.enabledGroupOption;
    let existValue;
    if (enabledGroupOption) {
      existValue = form.cForm.select.groupOptions.find((group) => {
        return group.options.find((o) => {
          if (typeof o === "object") {
            return o.value === item;
          } else {
            return o === item;
          }
        });
      });
    } else {
      existValue = form.cForm.select.baseOptions.find((o) => {
        if (typeof o === "object") {
          return o.value === item;
        } else {
          return o === item;
        }
      });
    }
    if (existValue) {
      ElMessage.error("请确保该选项的值唯一");
      console.error("请确保该选项的值唯一", existValue);
      return;
    }
    if (enabledGroupOption && !addOptionForm.group.trim()) {
      ElMessage.error("分组名称不能为空");
      return;
    }
    if (addOptionForm.opType === "常量") {
      if (enabledGroupOption) {
        const targetGroup = form.cForm.select.groupOptions.find((group) => {
          return group.groupLabel === addOptionForm.group;
        });
        if (targetGroup) {
          targetGroup.options.unshift(item as any);
        } else {
          form.cForm.select.groupOptions.unshift({
            groupLabel: addOptionForm.group,
            options: [item as any],
          });
        }
      } else {
        form.cForm.select.baseOptions.unshift(item);
      }
    } else {
      if (enabledGroupOption) {
        const targetGroup = form.cForm.select.groupOptions.find((group) => {
          return group.groupLabel === addOptionForm.group;
        });
        if (targetGroup) {
          targetGroup.options.unshift({
            label: addOptionForm.label,
            value: item,
          } as any);
        } else {
          form.cForm.select.groupOptions.unshift({
            groupLabel: addOptionForm.group,
            options: [
              {
                label: addOptionForm.label,
                value: item,
              },
            ],
          });
        }
      } else {
        form.cForm.select.baseOptions.unshift({
          label: addOptionForm.label,
          value: item,
        });
      }
    }
    form.cForm.select.validOptions.push(item);
    if (form.cForm.select.enabledGroupOption) {
      if (form.cForm.select.multiple) {
        if (form.cForm.select.mValue.length === 0) {
          form.cForm.select.mValue = [item];
        }
      } else {
        if (
          form.cForm.select.sValue &&
          ["", false, 0].includes(form.cForm.select.sValue)
        ) {
          form.cForm.select.sValue = item;
        }
      }
    } else {
      if (["", false, 0].includes(form.cForm.select.segmentedValue)) {
        form.cForm.select.segmentedValue = item;
      }
    }

    ElMessage.success("选项添加成功，选中以生效");
    dialogOptions.cancel();
  };
};

watch(
  () => form.cForm.select.valueType,
  (valueType) => {
    if (!form.cForm.select.validOptions.length) {
      return;
    }
    let firstElement;
    if (form.cForm.select.enabledGroupOption) {
      let _firstElement;
      form.cForm.select.groupOptions.find((group) => {
        return group.options.find((o) => {
          if (typeof o === "object") {
            const res = o.value === form.cForm.select.validOptions[0];
            if (res) {
              _firstElement = o;
            }
            return res;
          } else {
            const res = o === form.cForm.select.validOptions[0];
            if (res) {
              _firstElement = o;
            }
            return res;
          }
        });
      });
      firstElement = _firstElement;
    } else {
      firstElement = form.cForm.select.baseOptions.find((s) => {
        if (typeof s === "object") {
          return s.value === form.cForm.select.validOptions[0];
        } else {
          return s === form.cForm.select.validOptions[0];
        }
      });
    }
    if (firstElement) {
      if (typeof firstElement === "object") {
        if (typeof firstElement.value !== valueType) {
          form.cForm.select.validOptions = [];
          form.cForm.select.segmentedValue =
            valueType === "string" ? "" : valueType === "number" ? 0 : false;
          form.cForm.select.sValue =
            valueType === "string" ? "" : valueType === "number" ? 0 : false;
          form.cForm.select.mValue = [];
        }
      } else {
        if (typeof firstElement !== valueType) {
          form.cForm.select.validOptions = [];
          form.cForm.select.segmentedValue =
            valueType === "string" ? "" : valueType === "number" ? 0 : false;
          form.cForm.select.sValue =
            valueType === "string" ? "" : valueType === "number" ? 0 : false;
          form.cForm.select.mValue = [];
        }
      }
    }
  }
);
</script>

<style lang="scss" scoped>
.edit-form {
  max-height: 60vh;
  overflow-y: auto;
  padding: 5px;
}
</style>
