export const auxiliary = <AuxiliaryType>{
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (close, ...args) => {
    close();
    AutoTipUtils.buildFormEditorVisible.value = true;
    const params: BuildFormItems[] = args[0]?.value || [];
    const selfModule = getInvokeApiMethods().find(
      (i) => i.name === "buildForm" && i.scope === "Preludes"
    );
    const dialog = selfModule!.testModule!.dialog;
    if (dialog.args) {
      if (
        dialog.args[0] !== undefined &&
        dialog.args[0].componentType === "buildFormEditor"
      ) {
        dialog.args[0].value.splice(
          0,
          dialog.args[0].value.length,
          ...removeKeyQuotes<BuildFormItems[]>(params)
        );
      }
    }
  },
  parameterReplace: (options: {
    formItems: BuildFormItems[];
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    try {
      //把date类型的值转为带有前缀的字符串
      const items = options.formItems.map((item) => {
        if (item.type === "picker") {
          if (item.pickerType !== "color") {
            if (Array.isArray(item.value)) {
              item.value = item.value.map((d) => processDate(d)) as [
                string,
                string
              ];
            } else {
              const res = processDate(item.value);
              if (res) {
                item.value = res;
              }
            }
          }
        }
        return item;
      });
      let res = objectToString(items, 2, 0, true);
      const constants = getLastConstants();
      //replace constants
      Object.keys(constants).forEach((key) => {
        const value = constants[key];
        if (typeof value !== "string" || value !== "") {
          res = res.replaceAll(`"${constants[key]}"`, key);
        }
      });
      //reset enums
      for (const enumKey in inject_enums) {
        const enumConfig = inject_enums[enumKey];
        for (const key in enumConfig) {
          const item = enumConfig[key];
          res = res.replaceAll(`"${item.value}"`, `${enumKey}.${key}`);
        }
      }
      options.replaceCurFnArgs(res);
      findEditor(EDITOR_DOM_ID)
        ?.getAction("editor.action.formatDocument")
        ?.run();
    } catch (error) {
      console.error(error);
    }
  },
};
