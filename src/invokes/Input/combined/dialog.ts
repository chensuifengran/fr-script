import { KeyOptions } from "../KeyOptions";
export const dialogOptions = {
  title: "按下组合键",
  targetMethodName: "combined",
  content: "先顺序依次按下按键，再逆序依次松开按键",
  args: [
    {
      name: "keys",
      componentType: "select",
      value: [],
      multiple: true,
      notAllowCreate: true,
      label: "鼠标按键",
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
