class FormUtil {
  constructor(public form: RendererList[]) {}
  public getFieldValue<T = number | string | string[] | boolean | object[]>(
    valueType:
      | "checkList"
      | "groupSelectList"
      | "inputList"
      | "multipleGroupSelectList"
      | "selectList"
      | "tableList",
    label: string,
    failValue: T,
    groupLabel: string = "*脚本设置"
  ): T {
    const group = this.form.find((i) => {
      i.groupLabel === groupLabel;
    });
    if (group) {
      if(!group.enable){
        return failValue;
      }
      const field = group[valueType].find((i) => i.label === label);
      if (!field) {
        return failValue;
      }
      if (valueType === "checkList") {
        return (field as CheckListItem).checked as T;
      } else if (valueType === "inputList") {
        return (field as InputListItem).value as T;
      } else if (valueType === "multipleGroupSelectList") {
        return (field as MultiplSelectionItem).value as T;
      } else if (valueType === "selectList") {
        return (field as SelectListItem).value as T;
      } else if (valueType === "tableList") {
        return (field as TableListItem).tableData as T;
      } else {
        return (field as groupSelectListItem).value as T;
      }
    } else {
      return failValue;
    }
  }
}

export const rendererFormUtil = {
  FormUtil,
};
