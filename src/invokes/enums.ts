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
      description: 'BuildForm中,type为"check"的表单项',
      value: "check",
    },
    Input: {
      description: 'BuildForm中,type为"input"的表单项',
      value: "input",
    },
    Select: {
      description: 'BuildForm中,type为"select"的表单项',
      value: "select",
    },
    Picker: {
      description: 'BuildForm中,type为"picker"的表单项',
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
  // TestFieldType: {
  //   Success: {
  //     value: "success",
  //     description: "测试成功",
  //   },
  //   Fail: {
  //     value: "fail",
  //     description: "测试失败",
  //   },
  // },
};

const genEnumDeclare = (removeDecalreWord?: boolean) => {
  let _declare = "";
  for (const typeName in inject_enums) {
    _declare += (!removeDecalreWord ? "declare " : "") + `enum ${typeName} {\n`;
    for (const key in inject_enums[typeName]) {
      const item = inject_enums[typeName][key];
      _declare += `  /**\n`;
      if (item.description) {
        _declare += `   * @description ${item.description}\n`;
      }
      if (item.deprecated) {
        _declare += `   * @deprecated ${item.deprecated}\n`;
      }
      _declare += `   */\n  ${key} = "${item.value}",\n`;
    }
    _declare += `}\n`;
  }
  return _declare;
};

export const ENUM_DECLARE = genEnumDeclare();
export const ENUM_CODE = genEnumDeclare(true);
