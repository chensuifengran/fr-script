import type {
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
} from "element-plus";

const DATE_PREFIX = "__D2S__";
export const processDate = (strOrDate?: string | Date | null) => {
  if (!strOrDate) {
    return strOrDate;
  }
  if (strOrDate instanceof Date) {
    return `${DATE_PREFIX}${strOrDate.toLocaleString()}`;
  }
  return strOrDate;
};

export const objectToString = (
  target: any,
  indent: number = 2,
  currentIndent: number = 0,
  resetDateString: boolean = false
): string => {
  const space = " ".repeat(currentIndent + indent);
  const closingSpace = " ".repeat(currentIndent);
  if (Array.isArray(target)) {
    const arrayValues = target.map((item) => {
      if (typeof item === "object" && item !== null) {
        return objectToString(
          item,
          indent,
          currentIndent + indent,
          resetDateString
        );
      } else if (typeof item === "string") {
        if (resetDateString && item.startsWith(DATE_PREFIX)) {
          return `new Date(${item.replace(DATE_PREFIX, "")})`;
        }
        return `"${item}"`;
      } else if (typeof item === "function") {
        return item.toString();
      } else {
        return item;
      }
    });
    return `[\n${space}${arrayValues.join(`,\n${space}`)}\n${closingSpace}]`;
  }

  const entries = Object.entries(target)
    .sort(([key1], [key2]) => {
      // 属性显示优先级排序
      const priorityKeys = ["id", "type", "targetGroupLabel", "label", "inputType", "pickerType", "mod", "segmented"];
      const priority: Record<string, number> = {}
      priorityKeys.reverse().forEach((key, index) => {
        priority[key] = -index - 1;
      });
      const p1 = priority[key1] || 0;
      const p2 = priority[key2] || 0;
      if(p1 !== p2){
        return p1 - p2;
      }
      return key1.localeCompare(key2);
    })
    .map(([key, value]) => {
      if (value === undefined) {
        return "";
      }
      if (Array.isArray(value)) {
        const arrayValues = value.map((item) => {
          if (typeof item === "object" && item !== null) {
            return objectToString(
              item,
              indent,
              currentIndent + indent,
              resetDateString
            );
          } else if (typeof item === "string") {
            if (resetDateString && item.startsWith(DATE_PREFIX)) {
              return `new Date("${item.replace(DATE_PREFIX, "")}")`;
            }
            return `"${item}"`;
          } else if (typeof item === "function") {
            return item.toString();
          } else {
            return item;
          }
        });
        return `${key}: [\n${space}${space}${arrayValues.join(
          `,\n${space}${space}`
        )}\n${space}${closingSpace}]`;
      } else if (typeof value === "object" && value !== null) {
        return `${key}: ${objectToString(
          value,
          indent,
          currentIndent + indent,
          resetDateString
        )}`;
      } else if (typeof value === "string") {
        if (resetDateString && value.startsWith(DATE_PREFIX)) {
          return `${key}: new Date("${value.replace(DATE_PREFIX, "")}")`;
        }
        return `${key}: "${value}"`;
      } else if (typeof value === "function") {
        return `${key}: ${value.toString()}`;
      } else {
        return `${key}: ${value}`;
      }
    })
    .filter(Boolean);
  const result = `{\n${space}${entries.join(`,\n${space}`)}\n${closingSpace}}`;
  return result;
};

export const transformFnStr = <
  T extends
    | GetDisabledHours
    | GetDisabledMinutes
    | GetDisabledSeconds
    | Function = Function
>(
  fnStr?: string
): T | undefined => {
  if (!fnStr) {
    return;
  }
  try {
    const res = new Function(`return ${fnStr}`)();
    return res;
  } catch (e) {
    console.warn(`字符串"${fnStr}"无法转为函数`, e);
    return;
  }
};
