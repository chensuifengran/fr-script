export const BUILD_FORM_DECLARE = `
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
    type: FieldType.Input | "input";
  } & InputListItem;
  type Select = Base & {
    type: FieldType.Select | "select";
  } & SelectListItem;
  type Check = Base & {
    type: FieldType.Check | "check";
  } & CheckListItem;
  type Picker = Base & {
    type: FieldType.Picker | "picker";
  } & PickerListItem;
}

declare type BuildFormItems =
  | BuildFormItem.Input
  | BuildFormItem.Select
  | BuildFormItem.Check
  | BuildFormItem.Picker;
`