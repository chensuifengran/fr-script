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
    //   type: "check",
    //   label: '测试字段',
    //   targetGroupLabel: "测试组",
    //   checked: true
    // },
  ]);

  //等待用户点击"开始"按钮，点击按钮时等待结束，后续可以通过getCustomizeForm获取表单数据
  const { getFieldValue, getFieldValueById } = await getCustomizeForm();
  //示例
  //const testField = getFieldValue<boolean>('checkList', '测试字段', false, '测试组');
  //console.log(testField);//true
  //脚本运行逻辑
  
};
`;
};

export const IS_PLAYGROUND_ENV = import.meta.env.MODE === "play";