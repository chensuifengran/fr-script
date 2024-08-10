import { exists } from "@tauri-apps/api/fs";

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
          type: "void",
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
  private contentCache: Record<string, string> = {};
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
          if (_type.trim().length) {
            return `${p.name}${p.required ? "" : "?"}: ${_type},`;
          }
          return `${p.name},`;
        })
        .join("\n  ");
    }
  }
  private genArgList() {
    const argList = this.options.dialog.args;
    if (!argList) {
      return "";
    } else {
      const res = JSON.stringify(argList, null, 2);
      // 去除key中的双引号
      const regex = /"([^"]+)":/g;
      return res.replace(regex, "$1:");
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
    if (!argList?.length) {
      return "";
    } else {
      return `${argList
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
        .join(";\n    ")};\n    `;
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
    return snippetStr;
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
  private genRetract(count: number, retractSize = 2) {
    return " ".repeat(count * retractSize);
  }
  private genParamListStr(
    paramList?: DocumentParamItem[],
    tabCount = 2
  ): string {
    return `[${paramList ? "\n" + this.genRetract(tabCount) : ""}${
      paramList
        ? paramList
            .map((param) => {
              return `{
${this.genRetract(tabCount + 1)}name: "${param.name}",
${this.genRetract(tabCount + 1)}required: ${param.required ? "true" : "false"},
${this.genRetract(tabCount + 1)}instructions: "${param.instructions}",
${this.genRetract(tabCount + 1)}type: ${
                Array.isArray(param.type)
                  ? `[${param.type.map((i) => `'${i}'`).join(", ")}]`
                  : `'${param.type}'`
              },
${this.genRetract(tabCount + 1)}default: "${
                param.type === "string"
                  ? `${
                      param.default.includes('"') || param.default.includes("'")
                        ? `'${param.default}'`
                        : param.default
                    }`
                  : param.default
              }",
${this.genRetract(tabCount + 1)}children: ${this.genParamListStr(
                param.children,
                tabCount + 2
              )}
${this.genRetract(tabCount)}}`;
            })
            .join(",\n" + this.genRetract(tabCount))
        : ""
    }${paramList ? "\n" + this.genRetract(tabCount - 1) : ""}]`;
  }
  get documentTemplate() {
    const d = this.options.document;
    const prefixStr = `export const apiDocument = <ApiDocumentType>`;
    const tempStr = `{
  howToUse: "${d.howToUse}",
  params: ${this.genParamListStr(d.params)},
  returnValue: {
    ${
      d?.returnValue?.instructions
        ? `instructions: "${d.returnValue.instructions}",\n    `
        : ""
    }type: \`${d?.returnValue?.type || ""}\`,
  },
  example: {
    ${
      d?.example?.title
        ? `title: "${d.example.title.replace(/"/g, "'")}",`
        : 'title: "",'
    }
    code: \`${d?.example?.code || ""}\`,
  },
  searchKeys: [${d?.searchKeys?.map((i) => `'${i}'`).join(", ")}],
  codeSnippet:
    "${d?.codeSnippet || this.defaultSnippet()}",
};`;
    try {
      //对代码进行格式化
      let res = JSON.stringify(eval(`const t = ${tempStr};t`), undefined, 2);
      // 去除key中的双引号
      const regex = /"([^"]+)":/g;
      res = res.replace(regex, "$1:");
      return `${prefixStr}${res}`;
    } catch (error) {
      return `${prefixStr}${tempStr}`;
    }
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
      title ? `title: "${title}",\n  ` : ""
    }targetMethodName: "${this.options.name}",
  ${content ? `content: "${content}",\n  ` : ""}args: ${
      args ? this.genArgList() : `[]`
    }
};`;
  }
  get dialogCBTemplate() {
    const { name, scope, document, dialog } = this.options;
    const newExample = document.example?.code.replace(
      /\(.*\)/,
      `(${this.genCBOptionNames()})`
    );
    if (dialog.notOpen) {
      return `export const modelCallback = async (
  _options: {
    ${this.genCBOption()}replaceCurFnArgs?: (targetArgs: string) => void;
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
    ${this.genCBOption()}replaceCurFnArgs?: (targetArgs: string) => void;
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
  const res = await ${name}Fn(${this.genCBOptionNames()});
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
  //快速编辑/修改参数弹窗打开时触发
  onDialogOpen: async (_close,...args) => {
    //处理来自编辑器的参数
    const params = await AutoTipUtils.paramsProcess(...args);
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
    ${this.genCBOption()}replaceCurFnArgs: (targetArgs: string) => void;
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
      await Promise.all([
        fsUtils.writeFile(indexFile, this.indexTemplate),
        fsUtils.writeFile(documentFile, this.documentTemplate),
        fsUtils.writeFile(exportFnFile, this.exportFnTemplate),
        fsUtils.writeFile(dialogFile, this.dialogTemplate),
        fsUtils.writeFile(auxiliaryFile, this.auxiliaryTemplate),
        fsUtils.writeFile(declarationFile, this.declaration),
        fsUtils.writeFile(modelCallbackFile, this.dialogCBTemplate),
      ]);
      return true;
    } catch (error) {
      return false;
    }
  }
  private async syncOtherFileName(apiIndexPath: string, oldName: string) {
    const newName = this.options.name;
    const oldEqReg = new RegExp(
      `i\\.name\\s?={2,3}\\s?[\`"']${oldName}[\`"']`,
      "g"
    );
    try {
      //exportFn.ts文件
      const exportFnPath = await pathUtils.resolve(
        apiIndexPath,
        "../exportFn.ts"
      );
      let exportFnContent;
      if (this.contentCache[exportFnPath]) {
        exportFnContent = this.contentCache[exportFnPath];
      } else {
        exportFnContent = await fsUtils.readFile(exportFnPath);
      }
      const newExportFnContent = exportFnContent.replace(
        new RegExp(`${oldName}Fn`, "g"),
        newName + "Fn"
      );
      //auxiliary.ts文件
      const auxiliaryPath = await pathUtils.resolve(
        apiIndexPath,
        "../auxiliary.ts"
      );
      let auxiliaryContent;
      if (this.contentCache[auxiliaryPath]) {
        auxiliaryContent = this.contentCache[auxiliaryPath];
      } else {
        auxiliaryContent = await fsUtils.readFile(auxiliaryPath);
      }
      const newAuxiliaryContent = auxiliaryContent.replace(
        oldEqReg,
        `i.name === "${newName}"`
      );
      //declaration.ts文件
      const declarationPath = await pathUtils.resolve(
        apiIndexPath,
        "../declaration.ts"
      );
      let declarationContent;
      if (this.contentCache[declarationPath]) {
        declarationContent = this.contentCache[declarationPath];
      } else {
        declarationContent = await fsUtils.readFile(declarationPath);
      }
      const newDeclarationContent = declarationContent.replace(
        new RegExp(`function ${oldName}`, "g"),
        `function ${newName}`
      );
      //modelCallback.ts文件
      const modelCallbackPath = await pathUtils.resolve(
        apiIndexPath,
        "../modelCallback.ts"
      );
      let modelCallbackContent;
      if (this.contentCache[modelCallbackPath]) {
        modelCallbackContent = this.contentCache[modelCallbackPath];
      } else {
        modelCallbackContent = await fsUtils.readFile(modelCallbackPath);
      }
      let newModelCallbackContent = modelCallbackContent.replace(
        new RegExp(`${oldName}Fn`, "g"),
        `${newName}Fn`
      );
      newModelCallbackContent = newModelCallbackContent.replace(
        new RegExp(`${oldName}耗时`, "g"),
        `${newName}耗时`
      );
      newModelCallbackContent = newModelCallbackContent.replace(
        oldEqReg,
        `i.name === "${newName}"`
      );
      newModelCallbackContent = newModelCallbackContent.replace(
        new RegExp(`"${oldName}"`, "g"),
        `"${newName}"`
      );
      newModelCallbackContent = newModelCallbackContent.replace(
        new RegExp(`\\.${oldName}`, "g"),
        `.${newName}`
      );
      newModelCallbackContent = newModelCallbackContent.replace(
        new RegExp(`${oldName}\\(`, "g"),
        `${newName}(`
      );
      //document.ts文件
      const documentPath = await pathUtils.resolve(
        apiIndexPath,
        "../document.ts"
      );
      let documentContent;
      if (this.contentCache[documentPath]) {
        documentContent = this.contentCache[documentPath];
      } else {
        documentContent = await fsUtils.readFile(documentPath);
      }
      const newDocumentContent = documentContent.replace(
        new RegExp(`${oldName}\\(`, "g"),
        `${newName}(`
      );
      await Promise.all([
        fsUtils.writeFile(exportFnPath, newExportFnContent),
        fsUtils.writeFile(auxiliaryPath, newAuxiliaryContent),
        fsUtils.writeFile(declarationPath, newDeclarationContent),
        fsUtils.writeFile(modelCallbackPath, newModelCallbackContent),
        fsUtils.writeFile(documentPath, newDocumentContent),
      ]);
      this.contentCache[exportFnPath] = exportFnContent;
      this.contentCache[auxiliaryPath] = auxiliaryContent;
      this.contentCache[declarationPath] = declarationContent;
      this.contentCache[modelCallbackPath] = modelCallbackContent;
      this.contentCache[documentPath] = documentContent;
    } catch (error) {
      console.error("syncOtherFileName error:", error);
    }
  }
  private async syncOtherFileScope(apiIndexPath: string, oldScope: string) {
    const newScope = this.options.scope;
    const replaceReg = new RegExp(
      `i\\.scope\\s?={2,3}\\s?[\`"']${oldScope}[\`"']`,
      "g"
    );
    const newScopeExp = `i.scope === "${newScope}"`;
    try {
      //auxiliary.ts文件
      const auxiliaryPath = await pathUtils.resolve(
        apiIndexPath,
        "../auxiliary.ts"
      );
      let auxiliaryContent;
      if (this.contentCache[auxiliaryPath]) {
        auxiliaryContent = this.contentCache[auxiliaryPath];
      } else {
        auxiliaryContent = await fsUtils.readFile(auxiliaryPath);
      }
      const newAuxiliaryContent = auxiliaryContent.replace(
        replaceReg,
        newScopeExp
      );

      //modelCallback.ts文件
      const modelCallbackPath = await pathUtils.resolve(
        apiIndexPath,
        "../modelCallback.ts"
      );
      let modelCallbackContent;
      if (this.contentCache[modelCallbackPath]) {
        modelCallbackContent = this.contentCache[modelCallbackPath];
      } else {
        modelCallbackContent = await fsUtils.readFile(modelCallbackPath);
      }
      let newModelCallbackContent = modelCallbackContent.replace(
        replaceReg,
        `i.scope === "${newScope}"`
      );
      newModelCallbackContent = newModelCallbackContent.replace(
        new RegExp(`${oldScope}\\.`, "g"),
        `${newScope}.`
      );
      //document.ts文件
      const documentPath = await pathUtils.resolve(
        apiIndexPath,
        "../document.ts"
      );
      let documentContent;
      if (this.contentCache[documentPath]) {
        documentContent = this.contentCache[documentPath];
      } else {
        documentContent = await fsUtils.readFile(documentPath);
      }
      const newDocumentContent = documentContent.replace(
        new RegExp(`${oldScope}\\.`, "g"),
        `${newScope}.`
      );
      //declaration.ts文件
      const declarationPath = await pathUtils.resolve(
        apiIndexPath,
        "../declaration.ts"
      );
      let declarationContent;
      if (this.contentCache[declarationPath]) {
        declarationContent = this.contentCache[declarationPath];
      } else {
        declarationContent = await fsUtils.readFile(declarationPath);
      }
      let newDeclarationContent = declarationContent;
      if (this.options.scope.trim().length) {
        newDeclarationContent = declarationContent.replace(/declare /, "");
      } else if (!newDeclarationContent.includes("declare function")) {
        newDeclarationContent = newDocumentContent.replace(
          /function /,
          "declare function "
        );
      }
      await Promise.all([
        fsUtils.writeFile(auxiliaryPath, newAuxiliaryContent),
        fsUtils.writeFile(modelCallbackPath, newModelCallbackContent),
        fsUtils.writeFile(documentPath, newDocumentContent),
        fsUtils.writeFile(declarationPath, newDeclarationContent),
      ]);
      this.contentCache[auxiliaryPath] = auxiliaryContent;
      this.contentCache[modelCallbackPath] = modelCallbackContent;
      this.contentCache[documentPath] = documentContent;
      this.contentCache[declarationPath] = declarationContent;
    } catch (error) {
      console.error("syncOtherFileScope error:", error);
    }
  }

  private async applyIndexOptions(
    apiIndexPath: string,
    _oldOptions: InvokeTemplateOptions
  ) {
    const exist = await exists(apiIndexPath);
    if (!exist) {
      console.error(`文件${apiIndexPath}不存在`);
      return;
    }
    let oldIndexContent;
    if (this.contentCache[apiIndexPath]) {
      oldIndexContent = this.contentCache[apiIndexPath];
    } else {
      oldIndexContent = await fsUtils.readFile(apiIndexPath);
    }
    const updateInfo = {
      nameChanged: false,
      scopeChanged: false,
    };
    let newContent = oldIndexContent;
    const oldOptions = await astWorker.parseInvokeApiConfig(
      oldIndexContent,
      _oldOptions.name + "Api"
    );
    if (this.options.disabled) {
      if (oldOptions.disabled === undefined) {
        newContent = newContent.replace(
          /name:\s*['"`].*['"`],?/,
          `name: '${this.options.name}',\n  disabled: true,`
        );
      } else {
        newContent = newContent.replace(
          /disabled:\s*false,/,
          `disabled: true,`
        );
      }
    }
    if (oldOptions.testModule.weight !== this.options.weight) {
      newContent = newContent.replace(
        /weight:\s*\d+,/,
        `weight: ${this.options.weight},`
      );
    }
    if (this.options.name !== oldOptions.name) {
      newContent = newContent.replace(
        /fn:\s*.*Fn,/,
        `fn: ${this.options.name}Fn,`
      );
      newContent = newContent.replace(
        /import\s+\{\s*.*Fn\s*\}\s+from\s+".\/exportFn";?/,
        `import { ${this.options.name}Fn } from "./exportFn";`
      );
      newContent = newContent.replace(
        /export const .*Api\s*=/,
        `export const ${this.options.name}Api =`
      );
      newContent = newContent.replace(
        /name:\s*['"`].*['"`],?/,
        `name: '${this.options.name}',`
      );
      updateInfo.nameChanged = true;
      await this.syncOtherFileName(apiIndexPath, oldOptions.name);
    }
    const changeScope = this.options.scope !== oldOptions.scope;
    if (changeScope) {
      if (oldOptions.scope !== undefined) {
        newContent = newContent.replace(
          /scope:\s*['"`].*['"`],?/,
          this.options.scope.trim().length
            ? `scope: '${this.options.scope}',`
            : ""
        );
      } else {
        if (this.options.scope.trim().length) {
          newContent = newContent.replace(
            /name:\s*['"`].*['"`],?/,
            `scope: '${this.options.scope}',\n  name: '${this.options.name}',`
          );
        }
      }
      updateInfo.scopeChanged = true;
      await this.syncOtherFileScope(apiIndexPath, oldOptions.scope);
    }
    newContent = newContent.replace(/^\s*\n/gm, "");
    if (newContent !== oldIndexContent) {
      await fsUtils.writeFile(apiIndexPath, newContent);
      this.contentCache[apiIndexPath] = newContent;
    }
    return updateInfo;
  }
  private async applyDocumentOptions(documentFilePath: string) {
    const exist = await exists(documentFilePath);
    if (!exist) {
      console.error(`文件${documentFilePath}不存在`);
      return;
    }
    let oldDocumentContent;
    if (this.contentCache[documentFilePath]) {
      oldDocumentContent = this.contentCache[documentFilePath];
    } else {
      oldDocumentContent = await fsUtils.readFile(documentFilePath);
    }
    const oldCode = eval(
      `${oldDocumentContent
        .replace("<ApiDocumentType>", "")
        .replace("export ", "")};apiDocument`
    );
    let newCode = eval(
      `${this.documentTemplate
        .replace("<ApiDocumentType>", "")
        .replace("export ", "")};apiDocument`
    );
    if (JSON.stringify(oldCode) !== JSON.stringify(newCode)) {
      await fsUtils.writeFile(documentFilePath, this.documentTemplate);
      this.contentCache[documentFilePath] = this.documentTemplate;
    }
  }
  private async applyDialogOptions(dialogFilePath: string) {
    const exist = await exists(dialogFilePath);
    if (!exist) {
      console.error(`文件${dialogFilePath}不存在`);
      return;
    }
    let oldDialogContent;
    if (this.contentCache[dialogFilePath]) {
      oldDialogContent = this.contentCache[dialogFilePath];
    } else {
      oldDialogContent = await fsUtils.readFile(dialogFilePath);
    }
    const oldCode = eval(
      `${oldDialogContent
        .replace("<TestModuleDialogType>", "")
        .replace("export ", "")};dialogOptions`
    );
    let newCode = eval(
      `${this.dialogTemplate
        .replace("<TestModuleDialogType>", "")
        .replace("export ", "")};dialogOptions`
    );
    if (JSON.stringify(oldCode) !== JSON.stringify(newCode)) {
      await fsUtils.writeFile(dialogFilePath, this.dialogTemplate);
      this.contentCache[dialogFilePath] = this.dialogTemplate;
    }
  }
  async apply(apiIndexPath: string, oldOptions: InvokeTemplateOptions) {
    try {
      let invokesDir;
      if (oldOptions.scope) {
        invokesDir = await pathUtils.resolve(apiIndexPath, "../../../");
      } else {
        invokesDir = await pathUtils.resolve(apiIndexPath, "../../");
      }
      const oldDirPath = await pathUtils.resolve(apiIndexPath, "../");
      const newDirPath = await pathUtils.resolve(
        invokesDir,
        `${this.options.scope.length ? this.options.scope + "/" : ""}${
          this.options.name
        }`
      );
      //判断新目录是否存在其他API
      const exist = await exists(
        await pathUtils.resolve(newDirPath, "index.ts")
      );
      if (exist) {
        ElMessage.error(
          `${this.options.scope ? this.options.scope + "." : ""}${
            this.options.name
          } 已存在,无法完成修改！`
        );
        return false;
      }
      const dialogFilePath = await pathUtils.resolve(
        apiIndexPath,
        "../dialog.ts"
      );
      const documentFilePath = await pathUtils.resolve(
        apiIndexPath,
        "../document.ts"
      );
      const iRes = await this.applyIndexOptions(apiIndexPath, oldOptions);
      await this.applyDocumentOptions(documentFilePath);
      await this.applyDialogOptions(dialogFilePath);
      if (iRes?.nameChanged || iRes?.scopeChanged) {
        const res = await fsUtils.moveChildToNewDir(oldDirPath, newDirPath);
        if (res) {
          ElMessage.success("更新成功");
        } else {
          console.error("更新失败", oldDirPath, newDirPath, this.options.scope);
          ElMessage.error("更新失败");
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("apply new options error:", error);
      return false;
    }
  }
}
