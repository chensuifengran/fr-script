import { nanoid } from "nanoid";

export class RFormUtil {
  constructor(public form: RendererList[]) {}
  /**
   * 获取表单项的值
   * @param valueType 表单项的类型
   * @param label 表单项的label
   * @param failValue 获取失败或者未启用时的返回值
   * @param groupLabel 表单项所在的分组
   * @returns failValue 或 表单项的值
   */
  getFieldValue = <T = number | string | string[] | boolean | object[]>(
    valueType: "checkList" | "inputList" | "selectList" | "pickerList",
    label: string,
    failValue: T,
    groupLabel: string = "*脚本设置"
  ): T => {
    const group = this.form.find((i) => {
      return i.groupLabel === groupLabel;
    });
    if (group) {
      if (!group.enable) {
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
      } else if (valueType === "selectList") {
        return (field as SelectListItem).value as T;
      } else if (valueType === "pickerList") {
        return (field as PickerListItem).value as T
      } else {
        return failValue;
      }
    } else {
      return failValue;
    }
  };
  /**
   * 指定id获取表单项的值，需要在表单项手动指定id
   * @param id 表单项的id
   * @param failValue 获取失败或者未启用时的返回值
   * @returns failValue 或 表单项的值
   */
  getFieldValueById = <T = number | string | string[] | boolean | object[]>(
    id: string,
    failValue: T
  ): T => {
    let resValue: T = failValue;
    this.form
      .filter((group) => group.enable)
      .find((g) => {
        const allItems = [...g.checkList, ...g.inputList, ...g.selectList, ...g.pickerList];
        const item = allItems.find((i) => i.id === id);
        if (item) {
          if ("checked" in item) {
            resValue = (item as CheckListItem).checked as T;
          } else if ("value" in item) {
            resValue = (item as SelectListItem | InputListItem).value as T;
          }
          return true;
        }
      });
    return resValue;
  };
  /**
   * 为渲染列表生成id，一般用于渲染前
   * @param form 待生成id的渲染列表
   * @returns 生成id后的渲染列表
   */
  static genId = (form: RendererList[]) => {
    return form.map((group) => {
      return {
        id: "g_" + nanoid(),
        ...group,
        checkList: group.checkList.map((item) => {
          return {
            id: item.id || nanoid(),
            ...item,
          };
        }),
        inputList: group.inputList.map((item) => {
          return {
            id: item.id || nanoid(),
            ...item,
          };
        }),
        selectList: group.selectList.map((item) => {
          return {
            id: item.id || nanoid(),
            ...item,
          };
        }),
      };
    });
  };
}
