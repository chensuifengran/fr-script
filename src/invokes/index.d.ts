type ShowDetailsFn = (text: string | undefined, preStr?: string) => void;

type MouseOption = {
  randomOffset?: [
    //随机偏移量
    [number, number], //x坐标偏移量[最小值,最大值]
    [number, number] //y坐标偏移量[最小值,最大值]
  ];
  baseSize?: [number, number]; //基础尺寸
};

type ReturnMethods = {
  [methodName: string]: [returnType: string, argumentTypes: string[]];
};

type ExportFns = {
  [methodName: string]: ((...args: any[]) => Promise<any>) | any;
};

type DocumentParamItem = {
  id?: string;
  name: string;
  required: boolean;
  instructions: string;
  type: string | string[];
  default: string;
  children?: DocumentParamItem[];
};

type ApiDocumentType = {
  id?: string;
  howToUse: string;
  params?: DocumentParamItem[];
  returnValue: {
    type: string;
    instructions?: string;
  };
  example: {
    title: string;
    code: string;
  };
  searchKeys?: string[];
  //编辑器代码片段
  codeSnippet?: string;
};
namespace DialogArg {
  type Combined<
    T extends string | number = string,
    Multiple extends true | false = false
  > = {
    multiple?: Multiple;
    value: Multiple extends true ? T[] : T;
  };

  type ExtraAttr = {
    desc?: string /*用于DialogArgEditor组件*/;
  };
  type Select<
    OPTION extends
      | string[]
      | number[]
      | ((store: ListStore) => string[] | number[]) =
      | string[]
      | number[]
      | ((store: ListStore) => string[] | number[]),
    Multiple extends true | false = false
  > = {
    componentType: "select";
    options: OPTION;
    selectOptionSeparator?: string;
    notAllowCreate?: boolean;
  } & Combined<
    OPTION extends (store: ListStore) => infer R ? R[number] : OPTION[number],
    Multiple
  > &
    ExtraAttr;

  type FileInput<Multiple extends true | false = false> = {
    componentType: "FileInput";
    verifyPath?: boolean;
    suffix?: string;
  } & Combined<string, Multiple> &
    ExtraAttr;

  type Input = {
    componentType: "input";
    value: string;
  } & ExtraAttr;

  type RectInput = {
    componentType: "RectInput";
    value: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    targetSrc?: string;
  } & ExtraAttr;
  type Slider = {
    componentType: "slider";
    value: number;
    range?: {
      min: number;
      max: number;
      step?: number;
    };
  } & ExtraAttr;
  type Switch = {
    componentType: "switch";
    value: boolean;
    activeText?: string;
    inactiveText?: string;
  } & ExtraAttr;
  type DirInput = {
    componentType: "DirInput";
    value: string;
    suffix?: string;
    verifyPath?: boolean;
  } & ExtraAttr;
  type NumberInput = {
    componentType: "numberInput";
    value: number;
  } & ExtraAttr;
  type NumberRangeInput = {
    componentType: "numberRangeInput";
    value: [number, number];
    limit?: [number, number];
  } & ExtraAttr;
}
type ArgItems =
  | DialogArg.Select
  | DialogArg.FileInput<true>
  | DialogArg.FileInput<false>
  | DialogArg.Input
  | DialogArg.RectInput
  | DialogArg.Slider
  | DialogArg.Switch
  | DialogArg.DirInput
  | DialogArg.NumberInput
  | DialogArg.NumberRangeInput;
type ArgItem<T extends ArgItems = ArgItems> = {
  id?: string;
  noTest?: boolean;
  onlyTest?: boolean;
  name: string;
  label: string;
  displayCondition?: string[];
  placeholder?: string;
} & T;
type DialogDynamicArgItem =
  | ArgItem<DialogArg.Select>
  | ArgItem<DialogArg.FileInput<true>>
  | ArgItem<DialogArg.FileInput<false>>
  | ArgItem<DialogArg.Input>
  | ArgItem<DialogArg.RectInput>
  | ArgItem<DialogArg.Slider>
  | ArgItem<DialogArg.Switch>
  | ArgItem<DialogArg.DirInput>
  | ArgItem<DialogArg.NumberInput>
  | ArgItem<DialogArg.NumberRangeInput>;

type TestModuleDialogType = {
  notOpen?: boolean;
  title?: string;
  targetMethodName: string;
  content?: string;
  args?: DialogDynamicArgItem[];
};
type TestModuleType = {
  weight: number;
  dialog: TestModuleDialogType;
  callback: (...args: any[]) => Promise<void> | void;
  document?: ApiDocumentType;
};
type AuxiliaryType = {
  //参数回填方法
  parameterBackfill: (...args: string[]) => void;
  //参数处理方法
  parameterReplace: (options: any) => void;
};
type InvokeApiMethodType = {
  scope?: string;
  name: string;
  exportFn?: {
    fn: (...args: any[]) => Promise<any> | any;
  };
  testModule?: TestModuleType;
  //编辑-快速填写或修改方法参数 辅助模块
  auxiliary?: AuxiliaryType;
  //编辑器提示声明
  declaration?: string;
  //辅助类
  helperClass?: Function[];
  //禁用该内置API
  disabled?: boolean;
};
type Key =
  // 数字键
  | "Num0"
  | "Num1"
  | "Num2"
  | "Num3"
  | "Num4"
  | "Num5"
  | "Num6"
  | "Num7"
  | "Num8"
  | "Num9"
  // 字母键
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  // 功能键
  | "F1" // F1键
  | "F2" // F2键
  | "F3" // F3键
  | "F4" // F4键
  | "F5" // F5键
  | "F6" // F6键
  | "F7" // F7键
  | "F8" // F8键
  | "F9" // F9键
  | "F10" // F10键
  | "F11" // F11键
  | "F12" // F12键
  // 控制键
  | "Backspace" // 退格键
  | "Tab" // 制表键
  | "Return" // 回车键
  | "Shift" // Shift键
  | "Control" // Ctrl键
  | "Alt" // Alt键
  | "Pause" // Pause键
  | "CapsLock" // 大写锁定键
  | "Escape" // Esc键
  | "Space" // 空格键
  | "PageUp" // Page Up键
  | "PageDown" // Page Down键
  | "End" // End键
  | "Home" // Home键
  | "LeftArrow" // 左箭头键
  | "UpArrow" // 上箭头键
  | "RightArrow" // 右箭头键
  | "DownArrow" // 下箭头键
  | "Insert" // Insert键
  | "Delete" // Delete键
  // 其他键
  | "Windows" // Windows键
  | "ContextMenu" // 右键菜单键
  | "NumLock" // 数字锁定键
  | "ScrollLock" // 滚动锁定键
  | "Semicolon" // 分号键
  | "Equal" // 等号键
  | "Comma" // 逗号键
  | "Dash" // 破折号键
  | "Period" // 句号键
  | "Slash" // 斜杠键
  | "Backquote" // 反引号键
  | "BracketLeft" // 左方括号键
  | "Backslash" // 反斜杠键
  | "BracketRight" // 右方括号键
  | "Quote"; // 引号键
