export const inject_enums: Record<
  /*枚举类型命名*/ string,
  Record<
    /*枚举值名称*/ string,
    {
      description?: string; //枚举值描述
      value: string; //枚举值
      deprecated?: string; //是否已废弃
    }
  >
> = {
  FieldType: {
    Check: {
      description: 'BuildForm中，type为"check"的表单项',
      value: "check",
    },
    Input: {
      description: 'BuildForm中，type为"input"的表单项',
      value: "input",
    },
    Select: {
      description: 'BuildForm中，type为"select"的表单项',
      value: "select",
    },
    Picker: {
      description: 'BuildForm中，type为"picker"的表单项',
      value: "picker",
    },
    CheckList: {
      deprecated: "请使用FieldType.Check代替,将在未来版本中移除",
      value: "checkList",
    },
    InputList: {
      deprecated: "请使用FieldType.Input代替,将在未来版本中移除",
      value: "inputList",
    },
    SelectList: {
      deprecated: "请使用FieldType.Select代替,将在未来版本中移除",
      value: "selectList",
    },
    PickerList: {
      deprecated: "请使用FieldType.Picker代替,将在未来版本中移除",
      value: "pickerList",
    },
  },
};

const genEnumDeclare = (removeDecalreWord?: boolean) => {
  let declare = (!removeDecalreWord ? "declare " : "") + `enum FieldType {\n`;
  for (const key in inject_enums.FieldType) {
    const item = inject_enums.FieldType[key];
    declare += `  /**\n`;
    if (item.description) {
      declare += `   * @description ${item.description}\n`;
    }
    if (item.deprecated) {
      declare += `   * @deprecated ${item.deprecated}\n`;
    }
    declare += `   */\n  ${key} = "${item.value}",\n`;
  }
  declare += `}\n`;
  return declare;
};

export const ENUM_DECLARE = genEnumDeclare();
export const ENUM_CODE = genEnumDeclare(true);