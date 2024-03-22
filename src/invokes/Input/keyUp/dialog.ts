import { KeyOptions } from "../KeyOptions";
export const dialogOptions = {
  title: "抬起按键",
  targetMethodName: "keyUp",
  content: "主动抬起指定按键",
  args: [
    {
      name: "key",
      componentType: "select",
      value: 'A',
      notAllowCreate: true,
      label: "需要抬起的按键",
      options: KeyOptions, 
      selectOptionSeparator: ":",
    },
    {
      name: "delay",
      componentType: "numberInput",
      value: 0,
      label: "延迟执行时间(ms)【仅测试】",
      onlyTest: true,
    },
  ],
};
