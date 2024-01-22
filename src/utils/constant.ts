export const SCRIPT_TEMPLATE = `//引用类型推断文件，以便在vscode中获得内置api的类型推断
//@ts-ignore
/// <reference path="./lib/csfr.d.ts" />
/*
 * 请勿删除，此声明会在脚本读取时用到！
 * @version:脚本版本
 * @name:脚本名称
 * @description:脚本描述
 */

//脚本运行入口函数
const main = async () => {

  //构建默认表单项并渲染表单
  buildForm([
    //表单项
  ]);

  //等待用户点击"开始"按钮，点击按钮时等待结束并传入表单的内容，可以拿到表单指定属性的值
  const rendererForm = await getCustomizeForm();
  //脚本运行逻辑
  
};
`;
