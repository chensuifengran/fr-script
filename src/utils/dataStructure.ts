const dataGrouping = <T extends Record<string, any>>(
  data: T[],
  groupField: string,
  defaultGroup = ""
): Record<string, T[]> => {
  const result: Record<string, T[]> = {};
  for (const item of data) {
    const group = item[groupField] || defaultGroup;
    if (!result[group]) {
      result[group] = [item];
    } else {
      result[group].push(item);
    }
  }
  return result;
};
export type SelectOption<T extends Object> = {
  label: string;
  value: string;
  children?: SelectOption<T>[];
} & T;
const groupRecordToOptions = <T extends Record<string, any>>(
  groupedData: Record<string, Record<string, any>[]>,
  labelField: string | string[],
  valueField: string | string[],
  reservedField: (keyof T)[] = [],
  rootField: string = "",
  splitter = "."
): SelectOption<T>[] => {
  const result: SelectOption<T>[] = [];
  for (const key in groupedData) {
    const data = groupedData[key];
    if (key === rootField) {
      data.forEach((child) => {
        const label = Array.isArray(labelField)
          ? labelField
              .map((v) => child[v])
              .filter((s) => s)
              .join(splitter)
          : child[labelField];
        const value = Array.isArray(valueField)
          ? valueField
              .map((v) => child[v])
              .filter((s) => s)
              .join(splitter)
          : child[valueField];
        const reservedFieldObj: Record<string, any> = {};
        for (const field of reservedField) {
          reservedFieldObj[field as string] = child[field as string];
        }
        result.push({
          label,
          value,
          ...reservedFieldObj,
        } as SelectOption<T>);
      });
    } else {
      const children: SelectOption<T>[] = [];
      data.forEach((child) => {
        const label = Array.isArray(labelField)
          ? labelField
              .map((v) => child[v] || "")
              .filter((s) => s)
              .join(splitter)
          : child[labelField];
        const value = Array.isArray(valueField)
          ? valueField
              .map((v) => child[v] || "")
              .filter((s) => s)
              .join(splitter)
          : child[valueField];
        const reservedFieldObj: Record<string, any> = {};
        for (const field of reservedField) {
          reservedFieldObj[field as string] = child[field as string];
        }
        children.push({
          label,
          value,
          ...reservedFieldObj,
        } as SelectOption<T>);
      });

      result.push({
        label: key,
        value: key,
        children,
      } as SelectOption<T>);
    }
  }
  return result;
};
const findByIdInTree = <T extends Record<string, any>>(
  id: string,
  tree: T[],
  idField: string = "id",
  childrenField: string = "children"
): T | undefined => {
  for (const item of tree) {
    if (item[idField] === id) {
      return item;
    }
    if (item[childrenField]) {
      const result = findByIdInTree(
        id,
        item[childrenField],
        idField,
        childrenField
      );
      if (result) {
        return result as T;
      }
    }
  }
};
const findIndexPathByIdInTree = (
  id: string,
  tree: Record<string, any>[],
  idField: string = "id",
  childrenField: string = "children"
): string => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i][idField] === id) {
      return i.toString();
    }
    if (tree[i][childrenField]) {
      const result = findIndexPathByIdInTree(
        id,
        tree[i][childrenField],
        idField,
        childrenField
      );
      if (result) {
        return i + "." + result;
      }
    }
  }
  return "";
};
const getTreeParentById = <T extends Record<string, any>>(
  id: string,
  tree: T[],
  idField: string = "id",
  childrenField: string = "children"
) => {
  const indexPath = dataStructureUtils
    .findIndexPathByIdInTree(id, tree, idField, childrenField)
    .split(".")
    .map((ns) => +ns);
  let parent = tree;
  for (let idx = 0; idx < indexPath.length - 1; idx++) {
    parent = parent[indexPath[idx]].children!;
  }
  return parent;
};

export const dataStructureUtils = {
  dataGrouping,
  groupRecordToOptions,
  findByIdInTree,
  findIndexPathByIdInTree,
  getTreeParentById,
};
