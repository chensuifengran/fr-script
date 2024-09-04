declare namespace BuildFormItem {
  type Base = {
    targetGroupLabel: string;
    enable?: boolean;
    label: string;
  };
  type StripBase<T> = {
    [P in keyof T as Exclude<P, keyof Base>]: T[P];
  };
  type Input = Base & {
    type: "input";
  } & InputListItem;
  type Select = Base & {
    type: "select";
  } & SelectListItem;
  type Check = Base & {
    type: "check";
    checked: boolean;
  };
  type Picker = Base & {
    type: "picker";
  } & PickerListItem;
}

declare type BuildFormItems =
  | BuildFormItem.Input
  | BuildFormItem.Select
  | BuildFormItem.Check
  | BuildFormItem.Picker;
