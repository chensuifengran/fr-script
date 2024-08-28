export const BUILD_FORM_DECLARE = `
declare namespace BuildFormItem {
  type Base = {
    targetGroupLabel: string;
    enable?: boolean;
  };
  type StripBase<T> = {
    [P in keyof T as Exclude<P, keyof Base>]: T[P];
  };
  type Input = Base & {
    type: "input";
    label: string;
  } & InputListItem;
  type Select = Base & {
    type: "select";
    label: string;
  } & SelectListItem;
  type Check = Base & {
    type: "check";
    label: string;
    checked: boolean;
  };
}
declare type BuildFormItems =
  | BuildFormItem.Input
  | BuildFormItem.Select
  | BuildFormItem.Check;
`