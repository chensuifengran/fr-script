import { dayjs } from "element-plus";
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

export const processRList = (list: RendererList[]) => {
  const newList = (JSON.parse(JSON.stringify(list)) as RendererList[]).map(
    (group) => {
      return {
        ...group,
        pickerList: group.pickerList.map((item) => {
          if (item.pickerType === "color") {
            //目前仅支持rgb、hex、rgba、hexa格式的颜色，需要删除其他格式的颜色
            if (item.predefine) {
              item.predefine = item.predefine.filter((c) => {
                if (c.includes("#") || c.includes("rgb")) {
                  return true;
                }
                return false;
              });
            }
          } else {
            //date类型值无法被序列化，需要转换为字符串
            if (item.isRange) {
              item.value = item.value
                .filter((i) => i)
                .map((v) => {
                  if ("valueFormat" in item) {
                    const date = dayjs(v, item.valueFormat);
                    if (!date.isValid()) {
                      return new Date().toLocaleString();
                    }
                    return date.toLocaleString();
                  }
                  if (typeof v === "string") {
                    return v;
                  } else {
                    return v.toLocaleString();
                  }
                }) as [string, string];
            } else {
              if ("valueFormat" in item) {
                const date = dayjs(item.value, item.valueFormat);
                if (!date.isValid()) {
                  item.value = new Date().toLocaleString();
                } else {
                  item.value = date.toLocaleString();
                }
              } else {
                if (typeof item.value !== "string" && item.value) {
                  item.value = item.value.toLocaleString() as unknown as Date;
                } else {
                  item.value = new Date().toLocaleString() as unknown as Date;
                }
              }
            }
          }
          return item;
        }),
      };
    }
  );
  return newList;
};

export const resetRListDate = (list: RendererList[]) => {
  const res = (JSON.parse(JSON.stringify(list)) as RendererList[]).map(
    (group) => {
      return {
        ...group,
        pickerList: group.pickerList.map((item) => {
          if (item.pickerType !== "color") {
            if (item.isRange) {
              if (!item.value.length) {
                item.value = [new Date(), new Date()];
              }
              item.value = item.value.map((i) => {
                i = new Date();
                if ("valueFormat" in item) {
                  const res = dayjs(i).format(item.valueFormat);
                  return res;
                }
                return i;
              }) as [Date, Date] | [string, string];
            } else {
              item.value = new Date(item.value);
              if ("valueFormat" in item) {
                item.value = dayjs(item.value).format(item.valueFormat);
              }
            }
          }
          return item;
        }),
      };
    }
  );
  console.log(
    "-----------res:",
    JSON.parse(JSON.stringify(res.map((i) => i.pickerList)))
  );

  return res;
};
