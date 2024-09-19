export const ENUM_DECLARE = `
declare enum FieldType {
  /**
   * @description BuildForm中，type为"check"的表单项
   */
  Check = "check",
  /**
   * @description BuildForm中，type为"input"的表单项
   */
  Input = "input",
  /**
   * @description BuildForm中，type为"select"的表单项
   */
  Select = "select",
  /**
   * @description BuildForm中，type为"picker"的表单项
   */
  Picker = "picker",
  /**
   * @deprecated 请使用FieldType.Check代替,将在未来版本中移除
   */
  CheckList = "checkList",
  /**
   * @deprecated 请使用FieldType.Input代替,将在未来版本中移除
   */
  InputList = "inputList",
  /**
   * @deprecated 请使用FieldType.Select代替,将在未来版本中移除
   */
  SelectList = "selectList",
  /**
   * @deprecated 请使用FieldType.Picker代替,将在未来版本中移除
   */
  PickerList = "pickerList",
}
`;
export const ENUM_CODE = ENUM_DECLARE.replace(/declare enum/g, "enum");