export const SCRIPT_TEMPLATE = (
  name: string = "newScript",
  version: string = "v1.0",
  description: string = "脚本描述"
) => {
  const index = import.meta.glob<Record<string, any>>(
    "../invokes/Preludes/**/index.ts"
  );
  const preludes = Object.keys(index).map((namePath) => namePath.split("/")[3]);
  return `//引用类型推断文件，以便在vscode中获得内置api的类型推断
//@ts-ignore
/// <reference path="./lib/csfr.d.ts" />
/*
 * 请勿删除，此声明会在脚本读取时用到！
 * @version:${version}
 * @name:${name}
 * @description:${description}
 */
const { ${preludes.join(", ")} } = Preludes;
//脚本运行入口函数
const main = async () => {
  //构建默认表单项并渲染表单
  buildForm([
    // {
    //   id: 'checkItem',
    //   type: FieldType.Check,
    //   label: '测试字段',
    //   targetGroupLabel: "测试组",
    //   checked: true
    // },
  ]);
  //使用getCustomizeForm等待用户点击"开始"按钮，点击后等待结束，可以通过getFieldValue或getFieldValueById方法获取表单数据
  const { getFieldValue, getFieldValueById } = await getCustomizeForm();
  //示例
  //通过组件类型、分组名称和字段名称获取表单项的值
  //const testField = getFieldValue<boolean>(FieldType.Check, '测试字段', false, '测试组');
  //或者通过id获取表单项的值
  //const testField = getFieldValueById<boolean>('checkItem', false);
  //console.log(testField);//true
  //脚本运行逻辑
  
};
`;
};

export const DEMO_SCRIPT_TEMPLATE = `//引用类型推断文件，以便在vscode中获得内置api的类型推断
//@ts-ignore
/// <reference path="./lib/csfr.d.ts" />
/*
 * 请勿删除，此声明会在脚本读取时用到！
 * @version:v1.2
 * @name: 演示脚本
 * @description:对脚本交互表单的渲染效果进行展示
 */
const { buildForm, log, sleep } = Preludes;
//脚本运行入口函数
const main = async () => {
  //构建默认表单项并渲染表单
  buildForm([
    {
      type: FieldType.Select,
      label: "运行模式",
      targetGroupLabel: "选择组件",
      options: ["运行模式1", "运行模式2", "运行模式3"],
      value: "运行模式1", //默认值
    },
    {
      id: "__test__",
      type: FieldType.Select,
      label: "测试",
      targetGroupLabel: "选择组件",
      multiple: true,
      options: [1, 2, 3, 4],
      value: [1, 3],
    },
    {
      type: FieldType.Select,
      label: "最大分数百分比",
      targetGroupLabel: "选择组件",
      options: [100, 90, 80],
      value: 100,
    },
    {
      id: "daojwdoj",
      type: FieldType.Select,
      label: "随机最小分数百分比",
      targetGroupLabel: "选择组件",
      group: true,
      multiple: true,
      options: [
        {
          groupLabel: "高分",
          options: [
            {
              value: 90,
              label: "90分",
            },
            {
              value: 80,
              label: "80分",
            },
            {
              value: 70,
              label: "70分",
            },
          ],
        },
        {
          groupLabel: "低分",
          options: [
            {
              value: 60,
              label: "60分",
            },
            {
              value: 50,
              label: "50分",
            },
            {
              value: 0,
              label: "0分",
            },
          ],
        },
      ],
      value: [90, 80],
    },
    {
      id: "",
      type: FieldType.Check,
      label: "随机点击",
      targetGroupLabel: "复选框组件",
      checked: false,
    },
    {
      type: FieldType.Check,
      label: "随机偏移",
      targetGroupLabel: "复选框组件",
      checked: true,
    },
    {
      type: FieldType.Input,
      inputType: "text",
      label: "密码",
      targetGroupLabel: "密码组件",
      value: "-1",
      mod: "password",
      clearable: true,
      showPassword: true,
      placeholder: "dawkodkwoakdok",
    },
    {
      type: FieldType.Input,
      label: "密码2",
      targetGroupLabel: "密码组件",
      value: "-1",
      mod: "password",
      clearable: true,
      maxlength: 5,
      showWordLimit: true,
    },
    {
      type: FieldType.Input,
      label: "请输入随机值的范围",
      id: "test_2",
      inputType: "range",
      targetGroupLabel: "范围输入组件",
      controls: false,
      value: [0, 5],
      limit: [0, 10],
    },
    {
      type: FieldType.Input,
      label: "说明",
      targetGroupLabel: "文本域组件",
      value: "巴拉巴拉~",
      maxlength: 50,
      showWordLimit: true,
      clearable: true,
      mod: "textarea",
      autosize: [undefined, 10],
    },
    {
      type: FieldType.Input,
      inputType: "number",
      label: "数字1",
      targetGroupLabel: "数字输入框",
      value: 123,
      step: 2,
      controlsPosition: "right",
      valueOnClear: "min",
      min: -5,
    },
    {
      type: FieldType.Input,
      inputType: "number",
      label: "数字2",
      targetGroupLabel: "数字输入框",
      value: 123,
      step: 3,
      max: 129,
      valueOnClear: "max",
    },
    {
      type: FieldType.Input,
      label: "简介",
      targetGroupLabel: "文本输入框",
      value: "-1",
      showWordLimit: true,
      maxlength: 100,
    },
    {
      type: FieldType.Input,
      label: "子文件(多选)",
      targetGroupLabel: "文件输入",
      inputType: "file",
      multiple: true,
      value: [],
    },
    {
      type: FieldType.Input,
      label: "主文件",
      targetGroupLabel: "文件输入",
      inputType: "file",
      multiple: false,
      value: "",
    },
    {
      id: "daokok",
      type: FieldType.Picker,
      label: "颜色",
      targetGroupLabel: "pickers",
      pickerType: "color",
      value: "",
      colorFormat: "rgb",
      enableAlpha: false,
      predefine: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577",
      ],
    },
    {
      type: FieldType.Picker,
      label: "222",
      targetGroupLabel: "pickers",
      value: [],
      pickerType: "time",
      isRange: true,
      valueFormat: "HH:mm:ss",
      rangeSeparator: "至",
      startPlaceholder: "起始时间",
      endPlaceholder: "结束时间",
    },
    {
      type: FieldType.Picker,
      label: "111",
      targetGroupLabel: "pickers",
      value: "",
      pickerType: "time",
      isRange: false,
      valueFormat: "HH/mm/ss",
      disabledHours: () => [1, 2, 3, 16],
    },
    {
      id: "TM",
      type: FieldType.Picker,
      label: "333",
      targetGroupLabel: "pickers",
      value: [],
      pickerType: "date",
      isRange: true,
      valueFormat: "YYYY-MM-DD HH:mm:ss",
    },
    {
      type: FieldType.Picker,
      label: "444",
      targetGroupLabel: "pickers",
      value: new Date(),
      pickerType: "date",
    },
    {
      type: FieldType.Select,
      label: "部分",
      targetGroupLabel: "分段选择",
      segmented: true,
      options: [
        {
          label: "一",
          value: 1,
        },
        {
          label: "二",
          value: 2,
        },
        {
          label: "三",
          value: 3,
        },
      ],
      value: 1,
    },
  ]);
  //等待用户点击"开始"按钮，点击按钮时等待结束，后续可以通过getCustomizeForm获取表单数据
  const { getFieldValue, getFieldValueById } = await getCustomizeForm();
  //通过组件类型、标签名、组标签定位到表单项并获取值
  const mod = getFieldValue(
    FieldType.Select,
    "运行模式",
    "无效的运行模式",
    "选择组件"
  );
  //通过id获取表单项的值
  const testValue = getFieldValueById<number[]>("__test__", []);
  //其它表单项的获取方式同上
  log("运行模式为：" + mod, "loading");
  log("testValue:" + testValue, "loading");
  const unlisten = await GlobalShortcut.listen(["Shift+C"], (e) => {
    log("按键按下" + e.shortcut, "loading");
    unlisten && unlisten();
  });
  const types = ["loading", "success", "danger", "warning", "info"];
  setInterval(() => {
    let socre = Math.floor((Math.random() * 100 - 1) / 20);
    log(Math.random(), types[socre] as any);
  }, 500);
  await sleep(1000 * 3000);
};
`;

export const DEMO_SCRIPT_ID = "DEMO_SCRIPT_ITEM";

export const IS_PLAYGROUND_ENV = import.meta.env.MODE === "play";

//code snippets
export const HEADER_REF_INJECT_KEY = Symbol("headerRefInjectKey");

export const API_BASE_HOST = "47.106.34.210:8711";
// export const API_BASE_HOST = "localhost:8711";