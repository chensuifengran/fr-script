export type InvokeTemplateOptions = {
  name: string;
  document: ApiDocumentType;
  dialog: {
    notOpen?: boolean;
    title?: string;
    content?: string;
    args?: DialogDynamicArgItem[];
  };
  scope?: string;
  weight?: number;
  disabled?: boolean;
};
export const defaultInvokeTemplateOptions =
  (): Required<InvokeTemplateOptions> => {
    return {
      name: "",
      scope: "",
      weight: 1,
      disabled: false,
      document: {
        howToUse: "",
        params: [],
        returnValue: {
          instructions: "",
          type: "",
        },
        example: {
          title: "",
          code: "",
        },
        searchKeys: [],
        codeSnippet: "",
      },
      dialog: {
        title: "",
        content: "",
        args: [],
        notOpen: false,
      },
    };
  };
export class InvokeTemplate {
  private options: Required<InvokeTemplateOptions>;
  constructor(options: InvokeTemplateOptions) {
    options.scope = options.scope || "";
    options.weight = options.weight || 5;
    options.disabled =
      options.disabled !== undefined ? options.disabled : false;
    this.options = options as Required<InvokeTemplateOptions>;
  }
  private genParamList() {
    const paramList = this.options.document.params;
    if (!paramList) {
      return "";
    } else {
      return paramList
        .map((p) => {
          const _type = Array.isArray(p.type)
            ? p.type.map((i) => `"${i}"`).join(" | ")
            : p.type;
          if (p.default) {
            return `${p.name}: ${_type} = ${
              p.type === "string" || Array.isArray(p.type)
                ? `'${p.default}'`
                : p.default
            },`;
          }
          return `${p.name}${p.required ? "" : "?"}: ${_type},`;
        })
        .join("\n  ");
    }
  }
  private genArgList() {
    const argList = this.options.dialog.args;
    if (!argList) {
      return "";
    } else {
      return ` ${argList.map((i) => JSON.stringify(i)).join(", ")} `;
    }
  }
  private genCBOptionNames() {
    const argList = this.options.dialog.args;
    if (!argList) {
      return "";
    } else {
      return argList.map((i) => i.name).join(", ");
    }
  }
  private genCBOption() {
    const argList = this.options.dialog.args;
    if (!argList) {
      return "";
    } else {
      return ` ${argList
        .map((i) => {
          let type = "string";
          const numberComponentTypes = [
            "numberInput",
            "numberRangeInput",
            "slider",
          ];
          if (i.componentType === "switch") {
            type = "boolean";
          } else if (i.componentType === "RectInput") {
            type = `{
      x: number;
      y: number;
      width: number;
      height: number;
    }`;
          } else if (numberComponentTypes.includes(i.componentType)) {
            type = "number";
          }
          return `${i.name}: ${type}`;
        })
        .join(";\n    ")}`;
    }
  }
  defaultSnippet() {
    const { returnValue, params } = this.options.document;
    let snippetStr = "";

    if (returnValue?.type) {
      const t = returnValue.type.toLocaleLowerCase();
      let startIndex = 0;
      if (
        returnValue.type.toLocaleLowerCase() !== "promise<void>" &&
        returnValue.type.toLocaleLowerCase() !== "void" &&
        returnValue.type.toLocaleLowerCase() !== "undefined"
      ) {
        snippetStr = "${1:const res = }";
        startIndex++;
      }
      const paramSnippetStr =
        params
          ?.map((p) => {
            return (
              `\${${++startIndex}:${
                Array.isArray(p.type)
                  ? p.type[0]
                  : p.type === "string"
                  ? `'${p.name}'`
                  : p.name
              }}` || ""
            );
          })
          .join(", ") || "";
      snippetStr += `${t.includes("promise") ? "await " : ""}${
        this.options.name
      }(${paramSnippetStr});\${0:}`;
    }
  }
  get indexTemplate() {
    return `import { apiDocument } from "./document";
import { ${this.options.name}Fn } from "./exportFn";
import { modelCallback } from "./modelCallback";
import { dialogOptions } from "./dialog";
import { declaration } from "./declaration";
import { auxiliary } from "./auxiliary";
export const ${this.options.name}Api = <InvokeApiMethodType>{
  ${
    this.options.scope.length ? `scope: '${this.options.scope}',\n  ` : ""
  }name: "${this.options.name}",
  exportFn: {
    fn: ${this.options.name}Fn,
  },
  testModule: {
    weight: ${this.options.weight},
    dialog: dialogOptions,
    callback: modelCallback,
    document: apiDocument,
  },
  //提供给编辑器的类型声明
  declaration,
  //编辑-快速填写或修改方法参数 辅助模块
  auxiliary${this.options.disabled ? ",\n  disabled: true" : ""}
};`;
  }
  get documentTemplate() {
    const d = this.options.document;
    return `export const apiDocument = <ApiDocumentType>{
  howToUse: "${d.howToUse}",
  params: [
    ${
      d.params
        ? d.params
            .map((param) => {
              return `{
      name: "${param.name}",
      required: ${param.required ? "true" : "false"},
      instructions: "${param.instructions}",
      type: ${
        Array.isArray(param.type)
          ? `[${param.type.map((i) => `'${i}'`).join(", ")}]`
          : `'${param.type}'`
      },
      default: "${
        param.type === "string"
          ? `${
              param.default.includes('"') || param.default.includes("'")
                ? `'${param.default}'`
                : param.default
            }`
          : param.default
      }",
    },`;
            })
            .join("")
        : ""
    }
  ],
  returnValue: {
    ${
      d?.returnValue?.instructions
        ? `instructions: "${d.returnValue.instructions}",`
        : ""
    }
    type: \`${d?.returnValue?.type || ""}\`,
  },
  example: {
    ${
      d?.example?.title ? `title: "${d.example.title.replace(/"/g, "'")}",` : ""
    }
    code: \`${d?.example?.code || ""}\`,
  },
  searchKeys: [${d?.searchKeys?.map((i) => `'${i}'`).join(", ")}],
  codeSnippet:
    "${d?.codeSnippet || this.defaultSnippet()}",
};`;
  }
  get exportFnTemplate() {
    const name = this.options.name;
    return `export const ${name}Fn = async (
  ${this.genParamList()}
  taskId?: string
) => {
  const { notAllowedFnId } = useScriptRuntime();
  if (taskId && notAllowedFnId.value.includes(taskId)) {
    return false;
  }
  try {
    //TODO
  } catch (e) {
    console.error("${name}FnError: ", e);
  }
};`;
  }
  get declaration() {
    return `export const declaration = \`${
      this.options.scope.length ? "" : "declare "
    }function ${this.options.name}(
  ${this.genParamList()}
): ${this.options.document.returnValue?.type || "void"};\n\`;`;
  }
  get dialogTemplate() {
    const { title, notOpen, content, args } = this.options.dialog;
    return `export const dialogOptions = <TestModuleDialogType>{
  ${notOpen ? `notOpen: true,\n  ` : ""}${
      title ? `title: "${title}",\n` : ""
    }  targetMethodName: "${this.options.name}",
  ${content ? `content: "${content}",\n` : ""}  args: ${
      args ? `[${this.genArgList()}]` : `[]`
    }
};`;
  }
  get dialogCBTemplate() {
    const { name, scope, document, dialog } = this.options;
    const newExample = document.example?.code.replace(/\(.*\)/, "(/*参数*/)");
    if (dialog.notOpen) {
      return `export const modelCallback = async (
  _options: {
    ${this.genCBOption()};
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  testModuleCtx.showDetails("此方法无法直接调用，请在脚本中使用！", "${
    scope.length ? `${scope}.` : ""
  }${name}");
};`;
    }
    return `import { auxiliary } from "./auxiliary";
import { ${name}Fn } from "./exportFn";
export const modelCallback = async (
  options: {
    ${this.genCBOption()};
    replaceCurFnArgs?: (targetArgs: string) => void;
  },
  testModuleCtx: {
    showDetails: ShowDetailsFn;
  }
) => {
  if (options.replaceCurFnArgs) {
    //快速填写或修改方法参数弹窗点击确定时
    auxiliary.parameterReplace(options);
    AutoTipUtils.apiAutoTip();
    return;
  }
  //测试调用时
  const { ${this.genCBOptionNames()} } = options;
  console.time("${name}耗时");
  const res = await ${name}Fn(/*参数*/);
  console.time("${name}耗时");
  const selfModule = getInvokeApiMethods().find((i) => i.name === "${name}"${
      scope.length ? ` && i.scope === "${scope}"` : ""
    })?.testModule!;
  //修改示例代码
  selfModule.document!.example!.code = \`${newExample}\`;
  testModuleCtx.showDetails(JSON.stringify(res), "${
    scope.length ? `${scope}.` : ""
  }${name}");
};
`;
  }
  get auxiliaryTemplate() {
    const { name, scope } = this.options;
    return `export const auxiliary = <AuxiliaryType>{
  //参数回填方法
  parameterBackfill: async (...args: string[]) => {
    //处理来自编辑器的参数
    const params = await AutoTipUtils.paramsProcess(args);
    const selfModule = getInvokeApiMethods().find((i) => i.name === "${name}"${
      scope.length ? ` && i.scope === "${scope}"` : ""
    });
    const dialog = selfModule!.testModule!.dialog;
    if (!dialog.args) {
      return;
    }
    //根据参数的位置给弹窗对应的组件进行回填赋值
    dialog.args.forEach((i, index) => {
      /**
       * 例如函数本身有5个参数，而弹窗只有两个参数，params为编辑器中输入的5个参数，
       * index为弹窗中的参数位置，i.value为弹窗中组件的值
       * @example:
      switch (index) {
        case 0:
          //第一个参数为RectInput组件的值，刚好是函数前四个参数，故赋值如下
          i.value = {
            x: +params[0] || 0,
            y: +params[1] || 0,
            width: +params[2] || 0,
            height: +params[3] || 0,
          };
          break;
        case 1:
          //第二个参数为FileInput组件的值，AutoTipUtils.pathStrReset用来处理路径字符串
          i.value = AutoTipUtils.pathStrReset(params[4] || "");
          break;
        default:
          break;
      }
      */
    });
  },
  /**
   * 参数处理方法, 快速填写/修改参数弹窗点击确定时，会将弹窗中组件的值传入options，
   * 并且提供一个replaceCurFnArgs方法用来替换编辑器中当前函数的参数
  */
  parameterReplace: (options: {
    ${this.genCBOption()};
    replaceCurFnArgs: (targetArgs: string) => void;
  }) => {
    //根据实际情况去替换编辑器中的参数
    options.replaceCurFnArgs(
        ""/*替换后的参数字符串*/
    );
  },
};
`;
  }
  async create() {
    const { scope, name } = this.options;
    try {
      const invokesDir = await pathUtils.resolve(
        await pathUtils.getInstallDir(),
        "../../../src/invokes/"
      );
      const targetPath = await pathUtils.resolve(
        invokesDir,
        scope.length ? `${scope}/${name}` : name
      );
      const indexFile = await pathUtils.join(targetPath, "index.ts");
      const documentFile = await pathUtils.join(targetPath, "document.ts");
      const exportFnFile = await pathUtils.join(targetPath, "exportFn.ts");
      const dialogFile = await pathUtils.join(targetPath, "dialog.ts");
      const auxiliaryFile = await pathUtils.join(targetPath, "auxiliary.ts");
      const declarationFile = await pathUtils.join(
        targetPath,
        "declaration.ts"
      );
      const modelCallbackFile = await pathUtils.join(
        targetPath,
        "modelCallback.ts"
      );
      await fsUtils.writeFile(indexFile, this.indexTemplate);
      await fsUtils.writeFile(documentFile, this.documentTemplate);
      await fsUtils.writeFile(exportFnFile, this.exportFnTemplate);
      await fsUtils.writeFile(dialogFile, this.dialogTemplate);
      await fsUtils.writeFile(auxiliaryFile, this.auxiliaryTemplate);
      await fsUtils.writeFile(declarationFile, this.declaration);
      await fsUtils.writeFile(modelCallbackFile, this.dialogCBTemplate);
      return true;
    } catch (error) {
      return false;
    }
  }
}
