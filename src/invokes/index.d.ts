type ReturnMethods = {
  [methodName: string]: [returnType: string, argumentTypes: string[]];
};

type ExportFns = {
  [methodName: string]: ((...args: any[]) => Promise<any>) | any;
};

type ApiDocumentType = {
  howToUse: string;
  params?: {
    name: string;
    required: boolean;
    instructions: string;
    type: string | string[];
    default: string;
  }[];
  returnValue?: {
    type: string | string[];
    instructions: string;
  };
  example?: {
    title?: string;
    code: string[];
  };
  searchKeys?: string[];
  //编辑器代码片段
  codeSnippet?: string;
};

type TestModuleType = {
  canBeCalled?: boolean;
  itemType?: "invokeApi" | "util";
  weight: number;
  dialog: {
    notOpen?: boolean;
    title?: string;
    targetMethodName: string;
    content?: string;
    args?: {
      noTest?: boolean;
      onlyTest?: boolean;
      name: string;
      componentType:
        | "select"
        | "input"
        | "FileInput"
        | "RectInput"
        | "slider"
        | "switch"
        | "DirInput"
        | "numberInput"
        | 'numberRangeInput'
        ;
      label: string;
      options?: string[] | number[];
      notAllowCreate?: boolean;
      checked?: boolean;
      value?: any;
      //用于RectInput组件读取的图片路径字段
      targetSrc?: string;
      //显示条件，可以指定当前testModule的属性值，如果该值为true，则显示
      displayCondition?: string;
      placeholder?: string;
      activeText?: string;
      inactiveText?: string;
      mountedValue?: string;
      suffix?: string;
      range?: {
        min: number;
        max: number;
        step?: number;
      };
    }[];
  };
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
    alias?: string;
    fn: (...args: any[]) => Promise<any> | any;
  };
  testModule?: TestModuleType;
  //编辑-快速填写或修改方法参数 辅助模块
  auxiliary?: AuxiliaryType;
  //编辑器提示声明
  declaration?: string;
};