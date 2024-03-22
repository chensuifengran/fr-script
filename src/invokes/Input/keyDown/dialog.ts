import { KeyOptions } from "../KeyOptions";
export const dialogOptions = {
  title: "按下按键",
  targetMethodName: "keyDown",
  content: "主动按下指定按键，按下后不会自动抬起，需要手动调用keyUp方法抬起按键",
  args: [
    {
      name: "key",
      componentType: "select",
      value: 'A',
      notAllowCreate: true,
      label: "需要按下的按键",
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
