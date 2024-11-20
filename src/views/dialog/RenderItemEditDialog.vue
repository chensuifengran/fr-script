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
      <div class="edit-form" v-show="!useInnerDialog">
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
            <el-form-item label="组件类型" prop="componentType">
              <el-segmented
                :options="fieldTypeOptions"
                v-model="form.componentType"
                :disabled="isEdit"
              />
            </el-form-item>
            <el-form-item label="组件标签" prop="label">
              <el-input v-model="form.label" clearable />
            </el-form-item>
            <template v-if="form.componentType === FieldType.Check">
              <el-form-item label="是否默认选中" prop="cForm.check.checked">
                <el-switch v-model="form.cForm.check.checked" />
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
                  :disabled="isEdit"
                />
              </el-form-item>
              <!-- color子组件 -->
              <template v-if="form.cForm.picker.pickerType === 'color'">
                <el-form-item
                  label="启用alpha通道"
                  prop="cForm.picker.colorFields.alpha"
                >
                  <el-switch v-model="form.cForm.picker.colorFields.alpha" />
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
                        <el-tag :color="item.value" style="margin-right: 8px" />
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
                  <el-switch v-model="form.cForm.picker.dtFields.isRange" />
                </el-form-item>
                <el-form-item
                  label="值的格式(选填)"
                  prop="cForm.picker.dtFields.valueFormat"
                >
                  <el-input v-model="form.cForm.picker.dtFields.valueFormat" />
                </el-form-item>
                <!-- 范围选择 -->
                <template v-if="form.cForm.picker.dtFields.isRange">
                  <el-form-item
                    label="开始时间占位符"
                    prop="cForm.picker.dtFields.startPlaceholder"
                  >
                    <el-input
                      v-model="form.cForm.picker.dtFields.startPlaceholder"
                    />
                  </el-form-item>
                  <el-form-item
                    label="结束时间占位符"
                    prop="cForm.picker.dtFields.endPlaceholder"
                  >
                    <el-input
                      v-model="form.cForm.picker.dtFields.endPlaceholder"
                    />
                  </el-form-item>
                  <el-form-item
                    label="范围分隔符"
                    prop="cForm.picker.dtFields.rangeSeparator"
                  >
                    <el-input
                      v-model="form.cForm.picker.dtFields.rangeSeparator"
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
                        placeholder="函数表达式 例如：()=>[1,2,3,5]"
                      />
                    </el-form-item>
                    <el-form-item
                      label="禁用分钟"
                      prop="cForm.picker.dtFields.disabledMinutes"
                    >
                      <el-input
                        v-model="form.cForm.picker.dtFields.disabledMinutes"
                        placeholder="函数表达式,如：(hour)=>(hour===10?[25,45]:[])"
                      />
                    </el-form-item>
                    <el-form-item
                      label="禁用秒数"
                      prop="cForm.picker.dtFields.disabledSeconds"
                    >
                      <el-input
                        v-model="form.cForm.picker.dtFields.disabledSeconds"
                        placeholder="函数表达式,如：(h,m)=>((h>10&&m<=30)?[1,15]:[])"
                      />
                    </el-form-item>
                    <el-form-item
                      label="组件值"
                      prop="cForm.picker.dtFields.rangeValue"
                    >
                      <el-time-picker
                        v-model="form.cForm.picker.dtFields.rangeValue"
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
                        placeholder="函数表达式 例如：()=>[1,2,3,5]"
                      />
                    </el-form-item>
                    <el-form-item
                      label="禁用分钟"
                      prop="cForm.picker.dtFields.disabledMinutes"
                    >
                      <el-input
                        v-model="form.cForm.picker.dtFields.disabledMinutes"
                        placeholder="函数表达式,如：(hour)=>(hour===10?[25,45]:[])"
                      />
                    </el-form-item>
                    <el-form-item
                      label="禁用秒数"
                      prop="cForm.picker.dtFields.disabledSeconds"
                    >
                      <el-input
                        v-model="form.cForm.picker.dtFields.disabledSeconds"
                        placeholder="函数表达式,如：(h,m)=>((h>10&&m<=30)?[1,15]:[])"
                      />
                    </el-form-item>
                    <el-form-item
                      label="组件值"
                      prop="cForm.picker.dtFields.value"
                    >
                      <el-time-picker
                        v-model="form.cForm.picker.dtFields.value"
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
            <template v-else-if="form.componentType === FieldType.Select">
              <el-form-item label="组件值类型" prop="cForm.select.valueType">
                <el-segmented
                  :options="valueTypeOptions"
                  v-model="form.cForm.select.valueType"
                />
              </el-form-item>
              <el-form-item label="选项模式" prop="cForm.select.segmented">
                <el-segmented
                  :options="[
                    {
                      label: '普通',
                      value: false,
                    },
                    {
                      label: '分段',
                      value: true,
                    },
                  ]"
                  v-model="form.cForm.select.segmented"
                  :disabled="isEdit"
                />
              </el-form-item>
              <template v-if="form.cForm.select.segmented">
                <el-form-item label="选项" prop="cForm.select.validOptions">
                  <el-select
                    v-model="form.cForm.select.validOptions"
                    multiple
                    :value-key="
                      typeof form.cForm.select.validOptions[0] === 'object'
                        ? 'value'
                        : undefined
                    "
                    filterable
                    placeholder="请选择生效的选项"
                    style="width: 240px"
                  >
                    <el-option
                      v-for="(item, index) in baseOptions"
                      :key="index"
                      :label="typeof item === 'object' ? item.label : item + ''"
                      :value="typeof item === 'object' ? item.value : item"
                    >
                      <div flex flex-row items-center>
                        <el-tag size="small">{{ typeof item }}</el-tag>
                        <el-text
                          >{{ typeof item === "object" ? item.label : item
                          }}{{
                            typeof item === "object" ? `(${item.value})` : ""
                          }}</el-text
                        >
                      </div>
                    </el-option>
                  </el-select>
                  <el-button link type="primary" @click="openAddOptionDialog"
                    >添加备选选项</el-button
                  >
                </el-form-item>
                <el-form-item label="组件值" prop="cForm.select.segmentedValue">
                  <el-segmented
                    v-if="form.cForm.select.validOptions.length"
                    :options="form.cForm.select.validOptions"
                    v-model="form.cForm.select.segmentedValue"
                  />
                  <el-text v-else>暂无选项，请添加选项以调整组件值</el-text>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="多选" prop="cForm.select.multiple">
                  <el-switch v-model="form.cForm.select.multiple" />
                </el-form-item>
                <el-form-item
                  label="选项分组"
                  prop="cForm.select.enabledGroupOption"
                >
                  <el-switch v-model="form.cForm.select.enabledGroupOption" @change="handleEnabledGroupOption"/>
                </el-form-item>
                <el-form-item label="选项" prop="cForm.select.validOptions">
                  <el-select
                    v-model="form.cForm.select.validOptions"
                    multiple
                    filterable
                    placeholder="请选择生效的选项"
                    style="width: 400px"
                    @change="handleSelectChange"
                  >
                    <template #label="item">
                      <span
                        >{{
                          typeof item === "object"
                            ? typeof item.value === "object"
                              ? item.label + ":" + item.value?.value
                              : item.label + ":" + item.value
                            : item
                        }}
                      </span>
                    </template>
                    <template v-if="form.cForm.select.enabledGroupOption">
                      <el-option-group
                        v-for="(group, groupIndex) in groupOptions"
                        :key="groupIndex"
                        :label="group.groupLabel"
                      >
                        <el-option
                          v-for="(item, index) in group.options"
                          :key="index"
                          :label="
                            typeof item === 'object' ? item.label : item + ''
                          "
                          :value="typeof item === 'object' ? item.value : item"
                        >
                          <div flex flex-row items-center>
                            <el-tag size="small">{{ typeof item }}</el-tag>
                            <el-text
                              >{{ typeof item === "object" ? item.label : item
                              }}{{
                                typeof item === "object"
                                  ? `(${item.value})`
                                  : ""
                              }}</el-text
                            >
                          </div>
                        </el-option>
                      </el-option-group>
                    </template>
                    <template v-else>
                      <el-option
                        v-for="(item, index) in baseOptions"
                        :key="index"
                        :label="
                          typeof item === 'object' ? item.label : item + ''
                        "
                        :value="typeof item === 'object' ? item.value : item"
                      >
                        <div flex flex-row items-center>
                          <el-tag size="small">{{ typeof item }}</el-tag>
                          <el-text
                            >{{ typeof item === "object" ? item.label : item
                            }}{{
                              typeof item === "object" ? `(${item.value})` : ""
                            }}</el-text
                          >
                        </div>
                      </el-option>
                    </template>
                  </el-select>
                  <el-button link type="primary" @click="openAddOptionDialog"
                    >添加备选选项</el-button
                  >
                </el-form-item>
                <el-form-item label="组件值" prop="cForm.select.msValue">
                  <template v-if="form.cForm.select.multiple">
                    <el-select
                      v-model="form.cForm.select.mValue"
                      multiple
                      filterable
                      placeholder="请选择组件的默认值"
                      style="width: 240px"
                    >
                      <template #label="item">
                        <span
                          >{{
                            typeof item === "object"
                              ? typeof item.value === "object"
                                ? item.label + ":" + item.value?.value
                                : item.label + ":" + item.value
                              : item
                          }}
                        </span>
                      </template>
                      <template v-if="form.cForm.select.enabledGroupOption">
                        <el-option-group
                          v-for="g in validGroupOptions"
                          :label="g.groupLabel"
                          :key="g.groupLabel"
                        >
                          <el-option
                            v-for="(item, index) in g.options"
                            :key="index"
                            :label="
                              typeof item === 'object' ? item.label : item + ''
                            "
                            :value="
                              typeof item === 'object' ? item.value : item
                            "
                          >
                            <div flex flex-row items-center>
                              <el-tag size="small">{{ typeof item }}</el-tag>
                              <el-text
                                >{{
                                  typeof item === "object" ? item.label : item
                                }}{{
                                  typeof item === "object"
                                    ? `(${item.value})`
                                    : ""
                                }}</el-text
                              >
                            </div>
                          </el-option>
                        </el-option-group>
                      </template>
                      <template v-else>
                        <el-option
                          v-for="(item, index) in validOptions"
                          :key="index"
                          :label="
                            typeof item === 'object' ? item.label : item + ''
                          "
                          :value="typeof item === 'object' ? item.value : item"
                        >
                          <div flex flex-row items-center>
                            <el-tag size="small">{{ typeof item }}</el-tag>
                            <el-text
                              >{{ typeof item === "object" ? item.label : item
                              }}{{
                                typeof item === "object"
                                  ? `(${item.value})`
                                  : ""
                              }}</el-text
                            >
                          </div>
                        </el-option>
                      </template>
                    </el-select>
                  </template>
                  <template v-else>
                    <el-select
                      v-model="form.cForm.select.sValue"
                      filterable
                      placeholder="请选择组件默认选择的值"
                      style="width: 240px"
                    >
                      <template v-if="form.cForm.select.enabledGroupOption">
                        <el-option-group
                          v-for="g in validGroupOptions"
                          :label="g.groupLabel"
                          :key="g.groupLabel"
                        >
                          <el-option
                            v-for="(item, index) in g.options"
                            :key="index"
                            :label="
                              typeof item === 'object' ? item.label : item + ''
                            "
                            :value="
                              typeof item === 'object' ? item.value : item
                            "
                          >
                            <div flex flex-row items-center>
                              <el-tag size="small">{{ typeof item }}</el-tag>
                              <el-text
                                >{{
                                  typeof item === "object" ? item.label : item
                                }}{{
                                  typeof item === "object"
                                    ? `(${item.value})`
                                    : ""
                                }}</el-text
                              >
                            </div>
                          </el-option>
                        </el-option-group>
                      </template>
                      <template v-else>
                        <el-option
                          v-for="(item, index) in validOptions"
                          :key="index"
                          :label="
                            typeof item === 'object' ? item.label : item + ''
                          "
                          :value="typeof item === 'object' ? item.value : item"
                        >
                          <div flex flex-row items-center>
                            <el-tag size="small">{{ typeof item }}</el-tag>
                            <el-text
                              >{{ typeof item === "object" ? item.label : item
                              }}{{
                                typeof item === "object"
                                  ? `(${item.value})`
                                  : ""
                              }}</el-text
                            >
                          </div>
                        </el-option>
                      </template>
                    </el-select>
                  </template>
                </el-form-item>
              </template>
            </template>
            <template v-else-if="form.componentType === FieldType.Input">
              <!-- TODO -->
            </template>
          </template>
        </el-form>
      </div>
      <div v-show="useInnerDialog">
        <el-form
          :model="innerDialogForm"
          label-position="left"
          label-width="140px"
        >
          <el-form-item label="选项类型" prop="opType">
            <el-segmented
              :options="['常量', '对象']"
              v-model="innerDialogForm.opType"
            />
          </el-form-item>
          <template v-if="innerDialogForm.opType === '对象'">
            <el-form-item label="标签" prop="label">
              <el-input v-model="innerDialogForm.label" />
            </el-form-item>
          </template>
          <template v-if="form.cForm.select.enabledGroupOption">
            <el-form-item label="分组标签" prop="group">
              <el-autocomplete
                v-model="innerDialogForm.group"
                :fetch-suggestions="queryGroupLabels"
                placeholder="请输入分组标签"
                clearable
              />
            </el-form-item>
          </template>
          <el-form-item
            v-if="form.cForm.select.valueType === 'string'"
            :label="innerDialogForm.opType + '值'"
            prop="stringValue"
          >
            <el-input v-model="innerDialogForm.stringValue" />
          </el-form-item>
          <el-form-item
            v-if="form.cForm.select.valueType === 'number'"
            :label="innerDialogForm.opType + '值'"
            prop="numberValue"
          >
            <el-input-number v-model="innerDialogForm.numberValue" />
          </el-form-item>
          <el-form-item
            v-if="form.cForm.select.valueType === 'boolean'"
            :label="innerDialogForm.opType + '值'"
            prop="booleanValue"
          >
            <el-switch v-model="innerDialogForm.booleanValue" />
          </el-form-item>
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
  dayjs,
  FormRules,
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
} from "element-plus";
import { templateRef } from "@vueuse/core";
const {
  form,
  fieldTypeOptions,
  valueTypeOptions,
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

const useInnerDialog = ref(false);

const title = computed(() => {
  if (useInnerDialog.value) {
    return `添加分段选择选项`;
  } else {
    return `${props.isEdit ? "编辑" : "添加"}${
      props.editTarget === "group" ? "分组" : "组件"
    }`;
  }
});

const innerDialogForm = reactive<{
  opType: "常量" | "对象";
  stringValue: string;
  numberValue: number;
  booleanValue: boolean;
  group: string;
  label: string;
}>({
  opType: "对象",
  stringValue: "",
  numberValue: 0,
  booleanValue: false,
  label: "",
  group: "",
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
          innerDialogForm.opType = "对象";
          form.cForm.select.valueType = typeof item.options[0].value as
            | "string"
            | "number"
            | "boolean";
        } else {
          innerDialogForm.opType = "常量";
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
          innerDialogForm.opType = "对象";
          form.cForm.select.valueType = typeof targetOption.value as
            | "string"
            | "number"
            | "boolean";
        } else {
          innerDialogForm.opType = "常量";
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
    } else {
      if (props.editItem.item) {
        (form.cForm as any)[props.editItem.listName.replace("List", "")] = (
          props.editItem.item as any
        ).value;
      }
    }
  }
});
const disabledHours_ = computed(() => {
  const res = transformFnStr<GetDisabledHours>(
    form.cForm.picker.dtFields.disabledHours
  );
  return res;
});

const disabledHours: GetDisabledHours = (
  role: string,
  comparingDate?: dayjs.Dayjs
) => {
  return disabledHours_.value?.(role, comparingDate) || [];
};

const disabledMinutes_ = computed(() => {
  const res = transformFnStr<GetDisabledMinutes>(
    form.cForm.picker.dtFields.disabledMinutes
  );
  return res;
});

const disabledMinutes: GetDisabledMinutes = (
  hour: number,
  role: string,
  comparingDate?: dayjs.Dayjs
) => {
  return disabledMinutes_.value?.(hour, role, comparingDate) || [];
};

const disabledSeconds_ = computed(() => {
  const res = transformFnStr<GetDisabledSeconds>(
    form.cForm.picker.dtFields.disabledSeconds
  );
  return res;
});

const disabledSeconds: GetDisabledSeconds = (
  hour: number,
  minute: number,
  role: string,
  comparingDate?: dayjs.Dayjs
) => {
  return disabledSeconds_.value?.(hour, minute, role, comparingDate) || [];
};

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
    case FieldType.Select:
      let selectFields = {};
      if (form.cForm.select.segmented) {
        selectFields = {
          segmented: true,
          value: form.cForm.select.segmentedValue,
          options: form.cForm.select.baseOptions.filter((o) => {
            return form.cForm.select.validOptions.find((v) => {
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
          multiple: form.cForm.select.multiple,
          value: form.cForm.select.multiple
            ? form.cForm.select.mValue
            : form.cForm.select.sValue,
          group: form.cForm.select.enabledGroupOption,
          options: form.cForm.select.enabledGroupOption
            ? form.cForm.select.groupOptions
                .map((g) => {
                  const options = g.options.filter((o) => {
                    if (typeof o === "object") {
                      return form.cForm.select.validOptions.includes(o.value);
                    }
                    return form.cForm.select.validOptions.includes(o);
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
            : form.cForm.select.baseOptions.filter((o) => {
                if (typeof o === "object") {
                  return form.cForm.select.validOptions.includes(o.value);
                }
                return form.cForm.select.validOptions.includes(o);
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
      let pickerFields = {};
      if (form.cForm.picker.pickerType === "color") {
        pickerFields = {
          value: form.cForm.picker.colorFields.value,
          predefine: form.cForm.picker.colorFields.predefine,
          colorFormat: form.cForm.picker.colorFields.colorFormat,
          enableAlpha: form.cForm.picker.colorFields.alpha,
          pickerType: "color",
        };
      } else if (form.cForm.picker.pickerType === "time") {
        const isRange = form.cForm.picker.dtFields.isRange;
        pickerFields = {
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
        pickerFields = {
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
  useInnerDialog.value = true;
  dialogOptions.confirmText = "添加";
  dialogOptions.cancelText = "返回";
  dialogOptions.cancel = () => {
    useInnerDialog.value = false;
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
      item = innerDialogForm.stringValue;
    } else if (form.cForm.select.valueType === "number") {
      item = innerDialogForm.numberValue;
    } else {
      item = innerDialogForm.booleanValue;
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
    if (enabledGroupOption && !innerDialogForm.group.trim()) {
      ElMessage.error("分组名称不能为空");
      return;
    }
    if (innerDialogForm.opType === "常量") {
      if (enabledGroupOption) {
        const targetGroup = form.cForm.select.groupOptions.find((group) => {
          return group.groupLabel === innerDialogForm.group;
        });
        if (targetGroup) {
          targetGroup.options.unshift(item as any);
        } else {
          form.cForm.select.groupOptions.unshift({
            groupLabel: innerDialogForm.group,
            options: [item as any],
          });
        }
      } else {
        form.cForm.select.baseOptions.unshift(item);
      }
    } else {
      if (enabledGroupOption) {
        const targetGroup = form.cForm.select.groupOptions.find((group) => {
          return group.groupLabel === innerDialogForm.group;
        });
        if (targetGroup) {
          targetGroup.options.unshift({
            label: innerDialogForm.label,
            value: item,
          } as any);
        } else {
          form.cForm.select.groupOptions.unshift({
            groupLabel: innerDialogForm.group,
            options: [
              {
                label: innerDialogForm.label,
                value: item,
              },
            ],
          });
        }
      } else {
        debugger;
        form.cForm.select.baseOptions.unshift({
          label: innerDialogForm.label,
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

const baseOptions = computed(() => {
  if (!form.cForm.select.validOptions.length) {
    return form.cForm.select.baseOptions.filter((o) => {
      if (typeof o === "object") {
        return typeof o.value === form.cForm.select.valueType;
      } else {
        return typeof o === form.cForm.select.valueType;
      }
    });
  } else {
    const firstElement = form.cForm.select.baseOptions.find((s) => {
      if (typeof s === "object") {
        return s.value === form.cForm.select.validOptions[0];
      } else {
        return s === form.cForm.select.validOptions[0];
      }
    });
    return form.cForm.select.baseOptions.filter((o) => {
      if (typeof o === "object") {
        if (typeof firstElement !== "object") {
          return false;
        }
        return typeof o.value === form.cForm.select.valueType;
      } else {
        if (typeof firstElement === "object") {
          return false;
        }
        return typeof o === form.cForm.select.valueType;
      }
    });
  }
});

const groupOptions = computed(() => {
  if (!form.cForm.select.validOptions.length) {
    return form.cForm.select.groupOptions.map((group) => {
      return {
        groupLabel: group.groupLabel,
        options: group.options.filter((o) => {
          if (typeof o === "object") {
            return typeof o.value === form.cForm.select.valueType;
          } else {
            return typeof o === form.cForm.select.valueType;
          }
        }),
      };
    });
  } else {
    let targetOption:
      | {
          label: string;
          value: string | number | boolean;
        }
      | string
      | number
      | boolean;
    form.cForm.select.groupOptions.find((group) => {
      const res = group.options.find((o) => {
        if (typeof o === "object") {
          if (o.value === form.cForm.select.validOptions[0]) {
            targetOption = o;
            return true;
          }
        } else {
          if (o === form.cForm.select.validOptions[0]) {
            targetOption = o;
            return true;
          }
        }
      });
      return res;
    });
    return form.cForm.select.groupOptions.map((group) => {
      return {
        groupLabel: group.groupLabel,
        options: group.options.filter((o) => {
          if (typeof o === "object") {
            if (typeof targetOption !== "object") {
              return false;
            }
            return typeof o.value === form.cForm.select.valueType;
          } else {
            if (typeof targetOption === "object") {
              return false;
            }
            return typeof o === form.cForm.select.valueType;
          }
        }),
      };
    });
  }
});

const validOptions = computed(() => {
  return form.cForm.select.baseOptions.filter((o) => {
    if (typeof o === "object") {
      return form.cForm.select.validOptions.includes(o.value);
    } else {
      return form.cForm.select.validOptions.includes(o);
    }
  });
});

const validGroupOptions = computed(() => {
  return form.cForm.select.groupOptions
    .map((g) => {
      const opts = g.options.filter((o) => {
        if (typeof o === "object") {
          return form.cForm.select.validOptions.includes(o.value);
        } else {
          return form.cForm.select.validOptions.includes(o);
        }
      });
      if (!opts.length) {
        return null;
      }
      return {
        groupLabel: g.groupLabel,
        options: opts,
      };
    })
    .filter((g) => g !== null);
});

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

const labelFilter = (queryString: string) => {
  return (label: string) => {
    return {
      value: label
        .toLocaleLowerCase()
        .includes(queryString.toLocaleLowerCase()),
    };
  };
};
const queryGroupLabels = (queryString: string, cb: (arg: any) => void) => {
  const results = queryString
    ? form.cForm.select.groupOptions
        .map((g) => g.groupLabel)
        .filter(labelFilter(queryString))
    : form.cForm.select.groupOptions.map((g) => ({ value: g.groupLabel }));
  cb(results);
};

const handleSelectChange = () => {
  const selectConf = form.cForm.select;
  if (selectConf.multiple) {
    if (selectConf.mValue.length) {
      selectConf.mValue = selectConf.mValue.filter((v) => {
        return selectConf.validOptions.includes(v);
      });
    }
  } else {
    if (selectConf.sValue) {
      if (!selectConf.validOptions.includes(selectConf.sValue)) {
        selectConf.sValue = undefined;
      }
    }
  }
};

const handleEnabledGroupOption = ()=>{
  form.cForm.select.validOptions = [];
  form.cForm.select.sValue = undefined;
  form.cForm.select.mValue = [];
}
</script>

<style lang="scss" scoped>
.edit-form {
  max-height: 60vh;
  overflow-y: auto;
  padding: 5px;
}
</style>
