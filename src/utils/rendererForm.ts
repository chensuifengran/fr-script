import { nanoid } from "nanoid";

export class RFormUtil {
  constructor(public form: RendererList[]) {}
  /**
   * 获取表单项的值
   * @param fieldType 表单项的类型
   * @param label 表单项的label
   * @param failValue 获取失败或者未启用时的返回值
   * @param groupLabel 表单项所在的分组
   * @returns failValue 或 表单项的值
   */
  getFieldValue = <T = number | string | string[] | boolean | object[]>(
    fieldType: FieldType,
    label: string,
    failValue: T,
    groupLabel: string = "*脚本设置"
  ): T => {
    const group = this.form.find((i) => {
      return i.groupLabel === groupLabel;
    });
    const key = fieldType.replace("List", "") + "List";
    if (group && group.enable && key in group) {
      const field = (group as any)[key].find(
        (i: RendererItem) => i.label === label
      ) as RendererItem;
      if (field) {
        if ("checked" in field) {
          return field.checked as T;
        } else {
          return field.value as T;
        }
      }
    }
    return failValue;
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
        const allItems = Object.keys(g)
          .map((gk) => {
            if (gk.includes("List")) {
              return (g as any)[gk] as RendererItem[];
            }
          })
          .filter((i) => !!i)
          .flat();
        const item = allItems.find((i) => i.id === id);
        if (item) {
          if ("checked" in item) {
            resValue = item.checked as T;
          } else if ("value" in item) {
            resValue = item.value as T;
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
      const g = {
        id: "g_" + nanoid(),
        ...group,
      };
      Object.keys(g).forEach((key) => {
        if (key.includes("List")) {
          (g as any)[key] = ((g as any)[key] as Record<string, any>[]).map(
            (item) => {
              return {
                id: "i_" + nanoid(),
                ...item,
              };
            }
          );
        }
      });
      return g;
    });
  };
}
