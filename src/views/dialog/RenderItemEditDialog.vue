<template>
  <general-dialog
    :callback="confirm"
    :title="`${isEdit ? '编辑' : '添加'}${
      editTarget === 'group' ? '分组' : '组件'
    }`"
    v-model="visible"
  >
    <template #element>
      <el-form
        label-position="left"
        label-width="100px"
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
            <el-form-item label="是否默认选中" prop="checked">
              <el-switch v-model="form.cForm.check.checked" size="small" />
            </el-form-item>
          </template>
        </template>
      </el-form>
    </template>
  </general-dialog>
</template>
<script lang="ts" setup>
import { PropType } from "vue";
import { FieldType } from "../../utils/enums.ag";
import { nanoid } from "nanoid";
import { type RenderFormInstance } from "../../hooks/useRenderItemEditForm";
import { FormRules } from "element-plus";
import { templateRef } from "@vueuse/core";
const { form } = useRenderItemEditForm();
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
    if (
      props.editItem.listName === "checkList" &&
      props.editItem.item &&
      "checked" in props.editItem.item
    ) {
      form.cForm.check.checked = props.editItem.item.checked || false;
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
    default:
      item = {
        targetGroupLabel: form.groupLabel,
        label: "",
        id: "",
        value: "",
      } as unknown as RenderCodeItem;
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
    // case FieldType.Picker:
    //   item = {
    //     value: (form.cForm as any).picker.value,
    //   };
    //   break;
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

const fieldTypeOptions = [
  {
    label: "Check",
    value: FieldType.Check,
  },
  {
    label: "Input",
    value: FieldType.Input,
  },
  {
    label: "Select",
    value: FieldType.Select,
  },
  {
    label: "Picker",
    value: FieldType.Picker,
  },
];
</script>

<style lang="scss" scoped></style>
