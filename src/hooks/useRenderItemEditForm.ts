import type { FormRules } from "element-plus";
import { FieldType } from "../utils/enums.ag";
import type { MenuOptions } from "@imengyu/vue3-context-menu";

export type RenderFormInstance = {
  componentType: FieldType;
  groupLabel: string;
  label: string;
  id?: string;
  cForm: {
    check: {
      checked: boolean;
    };
  };
};
const ctxMenu = reactive({
  show: false,
  options: <MenuOptions>{},
  target: {
    groupLabel: "",
    label: "",
    listName: <"checkList" | "inputList" | "selectList" | "pickerList" | "">"",
    item: <RenderItem | null>null,
  },
  isEdit: false,
  editTarget: <"item" | "group">"item",
});
const formData = ref<RenderGroup[]>([]);
const form = reactive<RenderFormInstance>({
  componentType: FieldType.Check,
  groupLabel: "",
  label: "",
  id: "",
  cForm: {
    check: {
      checked: true,
    },
  },
});
const validateGroupLabel = (
  _: any,
  value: string,
  callback: (error?: string | Error) => void
) => {
  if (value.length) {
    callback();
  } else {
    callback(new Error("分组名称不能为空"));
  }
};
const validateLabel = (
  _: any,
  value: string,
  callback: (error?: string | Error) => void
) => {
  if (!value.length) {
    callback(new Error("标签名称不能为空"));
  }
  const targetGroup = formData.value.find(
    (g) => g.groupLabel === form.groupLabel
  );
  if (!targetGroup) {
    callback();
  } else {
    const listKey = (form.componentType + "List") as
      | "checkList"
      | "inputList"
      | "selectList"
      | "pickerList";
    const targetItem = targetGroup[listKey].find((i) => i.label === form.label);
    if (targetItem) {
      if (ctxMenu.isEdit && value === ctxMenu.target.item?.label) {
        callback();
      } else {
        callback(new Error("标签名称不能重复"));
      }
    } else {
      callback();
    }
  }
};
const validateId = (
  _: any,
  value: string | undefined,
  callback: (error?: string | Error) => void
) => {
  if (!value?.length) {
    callback();
  } else {
    const allId = formData.value.flatMap((g) => {
      return [...g.checkList, ...g.inputList, ...g.selectList, ...g.pickerList]
        .map((item) => {
          if ("id" in item) {
            return item.id;
          }
          return null;
        })
        .filter(Boolean) as string[];
    });
    if (allId.includes(value)) {
      if (ctxMenu.isEdit && value === ctxMenu.target.item?.id) {
        callback();
      } else {
        callback(new Error("ID不能重复"));
      }
    } else {
      callback();
    }
  }
};

const rules = <FormRules<RenderFormInstance>>{
  id: [{ validator: validateId, trigger: "blur" }],
  label: [{ validator: validateLabel, trigger: "blur" }],
  groupLabel: [{ validator: validateGroupLabel, trigger: "blur" }],
};
export const useRenderItemEditForm = () => {
  return {
    form,
    formData,
    rules,
    ctxMenu,
  };
};
