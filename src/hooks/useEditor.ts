import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import * as monaco from "monaco-editor";
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false,
});
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ESNext,
  module: monaco.languages.typescript.ModuleKind.ESNext,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  allowNonTsExtensions: true,
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  noEmit: true,
  typeRoots: ["node_modules/@types"],
});
monaco.languages.register({
  id: "typescript",
  extensions: [".ts"],
  aliases: ["TypeScript", "ts", "typescript"],
  mimetypes: ["text/typescript"],
});
monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
monaco.languages.registerCompletionItemProvider("typescript", {
  provideCompletionItems: async function (model, position) {
    const { createDependencyProposals } = AutoTipUtils;
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };
    return {
      suggestions: await createDependencyProposals(range),
    };
  },
});
const openOperationRecordDrawer = ref(false)
const languages = monaco.languages.getLanguages();
const supportLanguageIds = ["javascript", "typescript", "json"];
//禁用语言
languages.forEach((language) => {
  if (supportLanguageIds.indexOf(language.id) === -1) {
    monaco.languages.setLanguageConfiguration(language.id, {});
  }
});
const editors: {
  domId: string;
  instance: monaco.editor.IStandaloneCodeEditor;
  value: Ref<string>;
}[] = [];
/**
 * 在指定编辑器实例的指定范围插入文本
 * @param domId 编辑器domId
 * @param text 需要插入的文本
 * @param insertHead 是否插入脚本头部声明
 * @param range 范围参数
 */
const insertText = (
  domId: string,
  text: string,
  insertHead = false,
  range?: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  }
) => {
  const editor = editors.find((item) => item.domId === domId)?.instance;
  if (!editor) {
    console.error("domId对应的编辑器实例不存在！");
    return;
  }
  const curSelection = editor.getSelection()!; // 选择的文本范围或光标的当前位置
  const { startLineNumber, startColumn, endLineNumber, endColumn } = range
    ? range
    : curSelection;
  if (insertHead) {
    const txt: string = editor.getValue();
    const originText =
      txt.indexOf("请勿删除，此声明会在脚本读取时用到！") === -1
        ? txt
        : txt.replace(txt.substring(0, txt.indexOf(" */") + 3), "");
    return editor.setValue(text + "\n" + originText);
  }
  // 在光标位置插入文本
  editor.executeEdits("", [
    {
      range: new monaco.Range(
        startLineNumber,
        startColumn,
        endLineNumber,
        endColumn
      ),
      text, // 插入的文本
      forceMoveMarkers: true,
    },
  ]);
  editor.focus();
  // 核心 设置光标的位置
  editor.setPosition({
    column: startColumn + text.length,
    lineNumber: startLineNumber,
  });
};
let setTextTimer: any = null;
const setText = (domId: string, text: string) => {
  setTextTimer && clearTimeout(setTextTimer);
  setTextTimer = setTimeout(() => {
    const editor = editors.find((item) => item.domId === domId)?.instance;
    if (!editor) {
      console.warn("无法设置文本，编辑器实例可能已经被销毁。");
      return;
    }
    editor.setValue("");
    editor.setValue(text);
    clearTimeout(setTextTimer);
  }, 200);
};
const findEditor = (domId: string) => {
  return editors.find((item) => item.domId === domId)?.instance;
};
const getEditorValue = (domId: string) => {
  return editors.find((item) => item.domId === domId)?.value;
};

export const useEditor = () => {
  // @ts-ignore
  !self.MonacoEnvironment &&
    (self.MonacoEnvironment = {
      getWorker(_: string, label: string) {
        if (label === "json") {
          return new jsonWorker();
        }
        if (label === "css" || label === "scss" || label === "less") {
          return new cssWorker();
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
          return new htmlWorker();
        }
        if (["typescript", "javascript"].includes(label)) {
          return new tsWorker();
        }
        return new EditorWorker();
      },
    });
  monaco.languages.typescript.typescriptDefaults.setExtraLibs([
    {
      content: editorTsDeclaration(),
    },
  ]);
  let currentDomId = "";
  let editor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;
  /**
   * 当前编辑器的值，非同一个编辑器实例之间不共享值，请通过findEditor方法获取编辑器实例再获取值
   */
  const editorValue = ref("");
  let onEditorMounted: ((
    editor: monaco.editor.IStandaloneCodeEditor
  ) => void)[] = [];
  const registerEditorEvent = (name: string, cb: (event: any) => void) => {
    if (name === "mounted") {
      onEditorMounted.push(cb);
    }
  };
  const formatCode = () => {
    editor?.getAction("editor.action.formatDocument")?.run();
  };
  const disposeEditor = () => {
    const targetIndex = editors.findIndex(
      (item) => item.domId === currentDomId
    );
    editor?.dispose();
    if (targetIndex !== -1) {
      editors.splice(targetIndex, 1);
    }
    editor = undefined;
  };
  const unRegisterEditorEvent = (name: string) => {
    if (name === "mounted") {
      onEditorMounted = [];
    }
  };
  /**
   *
   * @param domId 编辑器容器的id
   * @param genEditorTsDeclaration 是否生成编辑器辅助声明文件
   */
  const editorInit = async (domId: string, genEditorTsDeclaration = true) => {
    const appGSStore = useAppGlobalSettings();
    let editorTheme = "vs";
    const settingEditorTheme = appGSStore.editor.theme.value;
    if (settingEditorTheme === "跟随全局主题") {
      const { isDark } = useAppTheme();
      editorTheme = isDark.value ? "vs-dark" : "vs";
    } else {
      editorTheme = settingEditorTheme === "明亮" ? "vs" : "vs-dark";
    }
    if (genEditorTsDeclaration) {
      //将editorTsDeclaration写入到csfr.d.ts文件中
      try {
        if (
          appGSStore.envSetting.workDir &&
          appGSStore.envSetting.workDir.length
        ) {
          const targetPath = await pathUtils.join(
            appGSStore.envSetting.workDir,
            "./lib/csfr.d.ts"
          );
          await fsUtils.writeFile(targetPath, editorTsDeclaration());
        }
      } catch (error) {
        console.error("辅助声明文件写入失败：", error);
      }
    }
    const usedEditor = editors.find((item) => item.domId === domId);
    if (usedEditor) {
      console.error("domId对应的编辑器实例已存在！");
      return;
    }
    const targetDom = document.getElementById(domId);
    if (!targetDom) {
      console.error("domId对应的dom不存在！");
      return;
    }
    currentDomId = domId;
    editor = monaco.editor.create(targetDom, {
      value: editorValue.value, // 编辑器初始显示文字
      language: "typescript", // 语言支持自行查阅demo
      automaticLayout: true, // 自适应布局
      theme: editorTheme, // 官方自带三种主题vs, hc-black, or vs-dark
      foldingStrategy: "indentation",
      renderLineHighlight: "all", // 行亮
      selectOnLineNumbers: true, // 显示行号
      tabSize: 2, // tab缩进大小
      minimap: {
        enabled: true,
      },
      readOnly: false, // 只读
      fontSize: 16, // 字体大小
      scrollBeyondLastLine: false, // 取消代码后面一大段空白
      overviewRulerBorder: false, // 不要滚动条的边框
    });
    editors.push({ domId, instance: editor, value: editorValue });
    onEditorMounted.forEach((cb) => {
      editor && cb(editor);
    });
    // 监听值的变化
    editor.onDidChangeModelContent((_val: any) => {
      if (!editor) {
        return;
      }
      editorValue.value = editor.getValue();
    });
  };
  
  return {
    editorInit,
    disposeEditor,
    findEditor,
    getEditorValue,
    registerEditorEvent,
    unRegisterEditorEvent,
    insertText,
    setText,
    formatCode,
    editorValue: readonly(editorValue),
    openOperationRecordDrawer
  };
};
