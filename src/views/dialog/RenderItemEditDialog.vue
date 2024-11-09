<template>
  <general-dialog
    :callback="confirm"
    :title="`${isEdit ? '编辑' : '添加'}${
      editTarget === 'group' ? '分组' : '组件'
    }`"
    v-model="visible"
  >
    <template #element>
      <div class="edit-form">
        <el-form
          label-position="left"
          label-width="140px"
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
              size="small"
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
                    size="small"
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
              <el-input v-model="form.id" clearable size="small">
                <template #append>
                  <el-button link size="small" @click="randomId" type="primary">
                    <random-icon />
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="组件类型" prop="componentType">
              <el-segmented
                :options="fieldTypeOptions"
                v-model="form.componentType"
                size="small"
                :disabled="isEdit"
              />
            </el-form-item>
            <el-form-item label="组件标签" prop="label">
              <el-input v-model="form.label" size="small" clearable />
            </el-form-item>
            <template v-if="form.componentType === FieldType.Check">
              <el-form-item label="是否默认选中" prop="cForm.check.checked">
                <el-switch v-model="form.cForm.check.checked" size="small" />
              </el-form-item>
            </template>
            <template v-else-if="form.componentType === FieldType.Picker">
              <el-form-item
                label="Picker组件子类型"
                prop="cForm.picker.pickerType"
              >
                <el-segmented
                  :options="pickerTypeOptions"
                  v-model="form.cForm.picker.pickerType"
                  size="small"
                  :disabled="isEdit"
                />
              </el-form-item>
              <!-- color子组件 -->
              <template v-if="form.cForm.picker.pickerType === 'color'">
                <el-form-item
                  label="启用alpha通道"
                  prop="cForm.picker.colorFields.alpha"
                >
                  <el-switch
                    v-model="form.cForm.picker.colorFields.alpha"
                    size="small"
                  />
                </el-form-item>
                <el-form-item
                  label="预定义的颜色"
                  prop="cForm.picker.colorFields.predefine"
                >
                  <el-select
                    v-model="form.cForm.picker.colorFields.predefine"
                    allow-create
                    filterable
                    multiple
                    placeholder="选择或者输入添加预定义颜色"
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in colorOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <div class="flex items-center">
                        <el-tag
                          :color="item.value"
                          style="margin-right: 8px"
                          size="small"
                        />
                        <span :style="{ color: item.value }">{{
                          item.label
                        }}</span>
                      </div>
                    </el-option>
                    <template #tag>
                      <el-tag
                        v-for="color in form.cForm.picker.colorFields.predefine"
                        :key="color"
                        :color="color"
                      />
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="预定义的颜色"
                  prop="cForm.picker.colorFields.predefine"
                >
                  <el-select
                    v-model="form.cForm.picker.colorFields.colorFormat"
                    placeholder="颜色格式"
                  >
                    <el-option
                      v-for="item in colorFormatOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="默认值"
                  prop="cForm.picker.colorFields.value"
                >
                  <el-color-picker
                    :show-alpha="form.cForm.picker.colorFields.alpha"
                    v-model="form.cForm.picker.colorFields.value"
                    :predefine="form.cForm.picker.colorFields.predefine"
                    :color-format="form.cForm.picker.colorFields.colorFormat"
                  />
                </el-form-item>
              </template>
              <!-- date、time子组件 -->
              <template v-else>
                <el-form-item
                  label="范围选择"
                  prop="cForm.picker.dtFields.isRange"
                >
                  <el-switch
                    v-model="form.cForm.picker.dtFields.isRange"
                    size="small"
                  />
                </el-form-item>
                <el-form-item
                  label="值的格式(选填)"
                  prop="cForm.picker.dtFields.valueFormat"
                >
                  <el-input
                    v-model="form.cForm.picker.dtFields.valueFormat"
                    size="small"
                  />
                </el-form-item>
                <!-- 范围选择 -->
                <template v-if="form.cForm.picker.dtFields.isRange">
                  <el-form-item
                    label="开始时间占位符"
                    prop="cForm.picker.dtFields.startPlaceholder"
                  >
                    <el-input
                      v-model="form.cForm.picker.dtFields.startPlaceholder"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item
                    label="结束时间占位符"
                    prop="cForm.picker.dtFields.endPlaceholder"
                  >
                    <el-input
                      v-model="form.cForm.picker.dtFields.endPlaceholder"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item
                    label="范围分隔符"
                    prop="cForm.picker.dtFields.rangeSeparator"
                  >
                    <el-input
                      v-model="form.cForm.picker.dtFields.rangeSeparator"
                      size="small"
                    />
                  </el-form-item>
                  <!-- time子组件 -->
                  <template v-if="form.cForm.picker.pickerType === 'time'">
                    <el-form-item
                      label="禁用小时"
                      prop="cForm.picker.dtFields.disabledHours"
                    >
                      <el-input
                        v-model="form.cForm.picker.dtFields.disabledHours"
                        size="small"
                        placeholder="函数表达式 例如：()=>[1,2,3,5]"
                      />
                    </el-form-item>
                    <el-form-item
                      label="禁用分钟"
                      prop="cForm.picker.dtFields.disabledMinutes"
                    >
                      <el-input
                        v-model="form.cForm.picker.dtFields.disabledMinutes"
                        size="small"
                        placeholder="函数表达式,如：(hour)=>(hour===10?[25,45]:[])"
                      />
                    </el-form-item>
                    <el-form-item
                      label="禁用秒数"
                      prop="cForm.picker.dtFields.disabledSeconds"
                    >
                      <el-input
                        v-model="form.cForm.picker.dtFields.disabledSeconds"
                        size="small"
                        placeholder="函数表达式,如：(h,m)=>((h>10&&m<=30)?[1,15]:[])"
                      />
                    </el-form-item>
                    <el-form-item
                      label="组件值"
                      prop="cForm.picker.dtFields.rangeValue"
                    >
                      <el-time-picker
                        v-model="form.cForm.picker.dtFields.rangeValue"
                        size="small"
                        :default-value="[new Date(), new Date()]"
                        :is-range="true"
                        :start-placeholder="
                          form.cForm.picker.dtFields.startPlaceholder
                        "
                        :end-placeholder="
                          form.cForm.picker.dtFields.endPlaceholder
                        "
                        :range-separator="
                          form.cForm.picker.dtFields.rangeSeparator
                        "
                        :value-format="form.cForm.picker.dtFields.valueFormat"
                        :disabled-hours="disabledHours"
                        :disabled-minutes="disabledMinutes"
                        :disabled-seconds="disabledSeconds"
                      />
                    </el-form-item>
                  </template>
                  <!-- date子组件 -->
                  <template v-else>
                    <el-form-item
                      label="组件值"
                      prop="cForm.picker.dtFields.rangeValue"
                    >
                      <el-date-picker
                        v-model="form.cForm.picker.dtFields.rangeValue"
                        size="small"
                        type="datetimerange"
                        :default-value="[new Date(), new Date()]"
                        :start-placeholder="
                          form.cForm.picker.dtFields.startPlaceholder
                        "
                        :end-placeholder="
                          form.cForm.picker.dtFields.endPlaceholder
                        "
                        :range-separator="
                          form.cForm.picker.dtFields.rangeSeparator
                        "
                        :value-format="form.cForm.picker.dtFields.valueFormat"
                      />
                    </el-form-item>
                  </template>
                </template>
                <!-- 非范围选择 -->
                <template v-else>
                  <el-form-item
                    label="提示占位符"
                    prop="cForm.picker.dtFields.placeholder"
                  >
                    <el-input
                      v-model="form.cForm.picker.dtFields.placeholder"
                      size="small"
                    />
                  </el-form-item>
                  <!-- time子组件 -->
                  <template v-if="form.cForm.picker.pickerType === 'time'">
                    <el-form-item
                      label="禁用小时"
                      prop="cForm.picker.dtFields.disabledHours"
                    >
                      <el-input
                        v-model="form.cForm.picker.dtFields.disabledHours"
                        size="small"
                        placeholder="函数表达式 例如：()=>[1,2,3,5]"
                      />
                    </el-form-item>
                    <el-form-item
                      label="禁用分钟"
                      prop="cForm.picker.dtFields.disabledMinutes"
                    >
                      <el-input
                        v-model="form.cForm.picker.dtFields.disabledMinutes"
                        size="small"
                        placeholder="函数表达式,如：(hour)=>(hour===10?[25,45]:[])"
                      />
                    </el-form-item>
                    <el-form-item
                      label="禁用秒数"
                      prop="cForm.picker.dtFields.disabledSeconds"
                    >
                      <el-input
                        v-model="form.cForm.picker.dtFields.disabledSeconds"
                        size="small"
                        placeholder="函数表达式,如：(h,m)=>((h>10&&m<=30)?[1,15]:[])"
                      />
                    </el-form-item>
                    <el-form-item
                      label="组件值"
                      prop="cForm.picker.dtFields.value"
                    >
                      <el-time-picker
                        v-model="form.cForm.picker.dtFields.value"
                        size="small"
                        :default-value="new Date()"
                        :is-range="false"
                        :value-format="form.cForm.picker.dtFields.valueFormat"
                        :placeholder="form.cForm.picker.dtFields.placeholder"
                        :disabled-hours="disabledHours"
                        :disabled-minutes="disabledMinutes"
                        :disabled-seconds="disabledSeconds"
                      />
                    </el-form-item>
                  </template>
                  <!-- date子组件 -->
                  <template v-else>
                    <el-form-item
                      label="组件值"
                      prop="cForm.picker.dtFields.value"
                    >
                      <el-date-picker
                        v-model="form.cForm.picker.dtFields.value"
                        size="small"
                        type="datetime"
                        :default-value="new Date()"
                        :value-format="form.cForm.picker.dtFields.valueFormat"
                        :placeholder="form.cForm.picker.dtFields.placeholder"
                      />
                    </el-form-item>
                  </template>
                </template>
              </template>
            </template>
          </template>
        </el-form>
      </div>
    </template>
  </general-dialog>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import { FieldType } from "../../utils/enums.ag";
import { nanoid } from "nanoid";
import { type RenderFormInstance } from "../../hooks/useRenderItemEditForm";
import type {
  FormRules,
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
} from "element-plus";
import { templateRef } from "@vueuse/core";
const {
  form,
  fieldTypeOptions,
  pickerTypeOptions,
  colorOptions,
  colorFormatOptions,
} = useRenderItemEditForm();
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
    } else {
      if (props.editItem.item) {
        (form.cForm as any)[props.editItem.listName.replace("List", "")] = (
          props.editItem.item as any
        ).value;
      }
    }
  }
});

const disabledHours = computed(() => {
  const res = transformFnStr<GetDisabledHours>(
    form.cForm.picker.dtFields.disabledHours
  );
  return res;
});

const disabledMinutes = computed(() => {
  const res = transformFnStr<GetDisabledMinutes>(
    form.cForm.picker.dtFields.disabledMinutes
  );
  return res;
});

const disabledSeconds = computed(() => {
  const res = transformFnStr<GetDisabledSeconds>(
    form.cForm.picker.dtFields.disabledSeconds
  );
  return res;
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
    // TODO: other types
    // case FieldType.Input:
    //   item = {
    //     value: (form.cForm as any).input.value,
    //   };
    //   break;
    // case FieldType.Select:
    //   item = {
    //     value: (form.cForm as any).select.value,
    //   };
    //   break;
    case FieldType.Picker:
      let otherFields = {};
      if (form.cForm.picker.pickerType === "color") {
        otherFields = {
          value: form.cForm.picker.colorFields.value,
          predefine: form.cForm.picker.colorFields.predefine,
          colorFormat: form.cForm.picker.colorFields.colorFormat,
          enableAlpha: form.cForm.picker.colorFields.alpha,
          pickerType: "color",
        };
      } else if (form.cForm.picker.pickerType === "time") {
        const isRange = form.cForm.picker.dtFields.isRange;
        otherFields = {
          value: isRange
            ? form.cForm.picker.dtFields.rangeValue
            : form.cForm.picker.dtFields.value,
          isRange,
          startPlaceholder: isRange
            ? form.cForm.picker.dtFields.startPlaceholder
            : undefined,
          endPlaceholder: isRange
            ? form.cForm.picker.dtFields.endPlaceholder
            : undefined,
          rangeSeparator: isRange
            ? form.cForm.picker.dtFields.rangeSeparator
            : undefined,
          valueFormat:
            form.cForm.picker.dtFields.valueFormat === ""
              ? undefined
              : form.cForm.picker.dtFields.valueFormat,
          placeholder: !isRange
            ? form.cForm.picker.dtFields.placeholder
            : undefined,
          disabledHours: transformFnStr(
            form.cForm.picker.dtFields.disabledHours
          ),
          disabledMinutes: transformFnStr(
            form.cForm.picker.dtFields.disabledMinutes
          ),
          disabledSeconds: transformFnStr(
            form.cForm.picker.dtFields.disabledSeconds
          ),
          pickerType: "time",
        };
      } else {
        const isRange = form.cForm.picker.dtFields.isRange;
        otherFields = {
          value: isRange
            ? form.cForm.picker.dtFields.rangeValue
            : form.cForm.picker.dtFields.value,
          isRange,
          startPlaceholder: isRange
            ? form.cForm.picker.dtFields.startPlaceholder
            : undefined,
          endPlaceholder: isRange
            ? form.cForm.picker.dtFields.endPlaceholder
            : undefined,
          rangeSeparator: isRange
            ? form.cForm.picker.dtFields.rangeSeparator
            : undefined,
          valueFormat:
            form.cForm.picker.dtFields.valueFormat === ""
              ? undefined
              : form.cForm.picker.dtFields.valueFormat,
          placeholder: !isRange
            ? form.cForm.picker.dtFields.placeholder
            : undefined,
          pickerType: "date",
        };
      }
      item = {
        targetGroupLabel: form.groupLabel,
        label: form.label,
        id: form.id,
        ...otherFields,
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
</script>

<style lang="scss" scoped>
.edit-form {
  max-height: 60vh;
  overflow-y: auto;
  padding: 5px;
}
</style>
