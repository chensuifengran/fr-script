import { KeyOptions } from "../KeyOptions";
export const dialogOptions = {
  title: "按下按键",
  targetMethodName: "press",
  content: "按下按键后松开",
  args: [
    {
      name: "key",
      componentType: "select",
      value: 'A',
      notAllowCreate: true,
      label: "按下的按键",
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
