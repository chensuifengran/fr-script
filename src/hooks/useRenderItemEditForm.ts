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
    select: {
      segmented: boolean;
      valueType: "string" | "number" | "boolean";
      baseOptions: SegmentedOption<string | number | boolean>[];
      validOptions: (string | number | boolean)[];
      segmentedValue: string | number | boolean;
      multiple: boolean;
      mValue: (string | number | boolean)[];
      sValue?: string | number | boolean;
      enabledGroupOption: boolean;
      groupOptions: SelectType.GroupOptions<string | number | boolean>;
    };
    input: {
      inputType?: "text" | "number" | "range" | "file" | "dir";
      text: {
        mod?: "password" | "textarea" | "text";
        placeholder?: string;
        clearable?: boolean;
        showPassword?: boolean;
        maxlength: number;
        showWordLimit?: boolean;
        autosizeConf: "close" | "open" | "custom";
        autosize: [number, number];
        value: string;
      };
      number: {
        min?: number;
        max?: number;
        step?: number;
        stepStrictly?: boolean;
        precision?: number;
        controlsPosition?: "right" | "";
        controls?: boolean;
        valueOnClearMod: "max" | "min" | "custom" | "default";
        valueOnClearNum: number;
        value: number;
      };
      range: {
        value: [number, number];
        limitRange: boolean;
        limit: [number, number];
        controls?: boolean;
      };
      file: {
        multiple?: boolean;
        sValue: string;
        mValue: string[];
      };
      dir: {
        value: string;
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
    select: {
      valueType: "string",
      baseOptions: [],
      validOptions: [],
      segmentedValue: "",
      segmented: true,
      multiple: false,
      mValue: [],
      sValue: "",
      enabledGroupOption: false,
      groupOptions: [],
    },
    input: {
      inputType: "text",
      text: {
        mod: "text",
        placeholder: "请输入",
        clearable: false,
        showPassword: false,
        maxlength: -1,
        showWordLimit: false,
        autosizeConf: "open",
        autosize: [-1, -1],
        value: "",
      },
      number: {
        min: NaN,
        max: NaN,
        step: 1,
        stepStrictly: false,
        precision: undefined,
        controlsPosition: "",
        controls: false,
        valueOnClearMod: "default",
        valueOnClearNum: 0,
        value: 0,
      },
      range: {
        value: [0, 100],
        limitRange: false,
        limit: [-9999, 9999],
        controls: false,
      },
      file: {
        multiple: false,
        sValue: "",
        mValue: [],
      },
      dir: {
        value: "",
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

const validateSegmentedOptions = (
  _: any,
  value: string,
  callback: (error?: string | Error) => void
) => {
  if (!value.length) {
    callback(new Error("保留选项不能为空"));
  }
  callback();
};

const validateSegmentedValue = (
  _: any,
  value: string | number | boolean,
  callback: (error?: string | Error) => void
) => {
  if (!form.cForm.select.validOptions.includes(value)) {
    callback(new Error("无效的组件值，请从选项中选择一个选项作为组件值"));
  }
  callback();
};

const rules = <FormRules<RenderFormInstance>>{
  id: [{ validator: validateId, trigger: "blur" }],
  label: [{ validator: validateLabel, trigger: "blur" }],
  groupLabel: [{ validator: validateGroupLabel, trigger: "blur" }],
  "cForm.select.validOptions": [
    { validator: validateSegmentedOptions, trigger: "blur" },
  ],
  "cForm.select.segmentedValue": [
    { validator: validateSegmentedValue, trigger: "blur" },
  ],
};

const useAddOptionDialog = ref(false);

const addOptionForm = reactive<{
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

export const useRenderItemEditForm = () => {
  return {
    form,
    formData,
    rules,
    ctxMenu,
    useAddOptionDialog,
    addOptionForm
  };
};
