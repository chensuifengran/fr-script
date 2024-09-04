export const RENDERER_LIST_DECLARE = `
declare namespace SelectType {
  type Multiple<T> = {
    multiple: true;
    value: T[];
    limit?: number;
  };
  type GroupOption<T extends string | number | boolean = string> = {
    group: true;
    options: {
      groupLabel: string;
      options: T[] | OptionItem<T>[];
    }[];
  };
  type ConstantOption<T extends string | number | boolean = string> = {
    group?: false;
    options: T[] | OptionItem<T>[];
  };
  type Single<T> = {
    multiple?: false;
    value: T;
  };
  type Base<
    T extends string | number | boolean,
    Opt extends ConstantOption<T> | GroupOption<T>,
    Val extends Single<T> | Multiple<T>
  > = Opt & Val;
  type Default<T extends string | number | boolean = string> =
    ConstantOption<T> & Single<T>;
}
declare type OptionItem<T extends string | number | boolean = string> = {
  label: string;
  value: T;
};
declare type BaseListItem = {
  label: string;
  id?: string;
};
declare type TextInputItem = {
  inputType?: "text";
  mod?: "password" | "textarea" | "text";
  placeholder?: string;
  clearable?: boolean;
  showPassword?: boolean;
  maxlength?: number;
  showWordLimit?: boolean;
  autosize?: [number | undefined, number | undefined] | number | boolean;
} & OptionItem<string> &
  BaseListItem;
declare type NumberInputItem = {
  inputType: "number";
  min?: number;
  max?: number;
  step?: number;
  stepStrictly?: boolean;
  precision?: number;
  controlsPosition?: "right" | "";
  controls?: boolean;
  valueOnClear?: number | "max" | "min";
} & OptionItem<number> &
  BaseListItem;
declare type RangeInputItem = {
  inputType: "range";
  value: [number, number];
  limit?: [number, number];
  controls?: boolean;
} & BaseListItem;
declare type FileInputItem<Multiple extends boolean> = {
  inputType: "file";
  multiple: Multiple extends true ? true : false | undefined;
  value: Multiple extends true ? string[] : string;
} & BaseListItem;
declare type InputListItem =
  | TextInputItem
  | NumberInputItem
  | RangeInputItem
  | FileInputItem<true>
  | FileInputItem<false>;
declare type BaseSelectItem<T extends string | number | boolean> = (
  | SelectType.Default<T>
  | SelectType.Base<T, SelectType.ConstantOption<T>, SelectType.Multiple<T>>
  | SelectType.Base<T, SelectType.GroupOption<T>, SelectType.Single<T>>
  | SelectType.Base<T, SelectType.GroupOption<T>, SelectType.Multiple<T>>
) &
  BaseListItem;
declare type SelectListItem =
  | BaseSelectItem<string>
  | BaseSelectItem<number>
  | BaseSelectItem<boolean>;
declare type CheckListItem = { checked: boolean } & BaseListItem;
declare namespace PickerItem {
  type PTime = {
    pickerType: "time";
    clearable?: boolean;
    format?: string;
    disabledHours?: (role: string, comparingDate?: any) => number[];
    disabledMinutes?: (
      hour: number,
      role: string,
      comparingDate?: any
    ) => number[];
    disabledSeconds?: (
      hour: number,
      minute: number,
      role: string,
      comparingDate?: any
    ) => number[];
  } & (
    | {
        isRange?: false;
        value: Date;
        placeholder?: string;
      }
    | {
        isRange: false;
        valueFormat: string;
        value: string;
        placeholder?: string;
      }
    | {
        isRange: true;
        valueFormat: string;
        value: [string, string];
        rangeSeparator?: string;
        startPlaceholder?: string;
        endPlaceholder?: string;
      }
    | {
        isRange: true;
        value: [Date, Date];
        rangeSeparator?: string;
        startPlaceholder?: string;
        endPlaceholder?: string;
      }
  );
  type PDate = {
    pickerType: "date";
    value: Date;
  };
  type Color<Alpha extends boolean> = {
    pickerType: "color";
    enableAlpha?: Alpha;
    colorFormat?:
      | "hsl"
      | "hsv"
      | "hex"
      | "rgb"
      | (Alpha extends true ? "hsla" | "hsva" | "hexa" | "rgba" : undefined);
    predefine?: string[];
    value: string;
  };
}
declare type PickerListItem = (
  | PickerItem.PTime
  | PickerItem.PDate
  | PickerItem.Color<true>
  | PickerItem.Color<false>
) &
  BaseListItem;
declare type RendererList = {
  id?: string;
  groupLabel: string;
  enable: boolean;
  checkList: CheckListItem[];
  inputList: InputListItem[];
  selectList: SelectListItem[];
  pickerList: PickerListItem[];
};
`