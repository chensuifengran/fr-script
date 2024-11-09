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
    picker: {
      pickerType: "color" | "date" | "time";
      colorFields: {
        alpha: boolean;
        value: string;
        predefine: string[];
        colorFormat: string;
      };
      dtFields: {
        isRange: boolean;
        valueFormat: string;
        value: string | Date;
        rangeValue: [string, string] | [Date, Date];
        placeholder?: string;
        startPlaceholder?: string;
        endPlaceholder?: string;
        rangeSeparator?: string;
        disabledHours?: string;
        disabledMinutes?: string;
        disabledSeconds?: string;
      };
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
    picker: {
      pickerType: "color",
      colorFields: {
        alpha: false,
        value: "#000000",
        predefine: [],
        colorFormat: "hex",
      },
      dtFields: {
        isRange: false,
        valueFormat: "",
        value: new Date(),
        rangeValue: [new Date(), new Date()],
        placeholder: "请选择日期时间",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        rangeSeparator: "至",
        disabledHours: "",
        disabledMinutes: "",
        disabledSeconds: "",
      },
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

const pickerTypeOptions = [
  {
    label: "Color",
    value: "color",
  },
  {
    label: "Date",
    value: "date",
  },
  {
    label: "Time",
    value: "time",
  },
];

const colorOptions = [
  {
    label: "red",
    value: "#ff4500",
  },
  {
    label: "green",
    value: "#32cd32",
  },
  {
    label: "blue",
    value: "#1e90ff",
  },
  {
    label: "yellow",
    value: "#ffd700",
  },
  {
    label: "black",
    value: "#000000",
  },
  {
    label: "white",
    value: "#ffffff",
  },
];

const colorFormatOptions = [
  {
    label: "hex(a)",
    value: "hex",
  },
  {
    label: "rgb(a)",
    value: "rgb",
  },
  {
    label: "hsl(a)",
    value: "hsl",
  },
  {
    label: "hsv(a)",
    value: "hsv",
  },
];

export const useRenderItemEditForm = () => {
  return {
    form,
    formData,
    rules,
    ctxMenu,
    fieldTypeOptions,
    pickerTypeOptions,
    colorOptions,
    colorFormatOptions
  };
};
