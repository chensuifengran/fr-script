import * as monaco from "monaco-editor";
const auxiliaryActionRegister = (
  editor: monaco.editor.IStandaloneCodeEditor,
  cb: (ed: monaco.editor.ICodeEditor) => void
) => {
  editor.addAction({
    id: "fastFillParams",
    label: "快速填写参数",
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Tab],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 0,
    run: cb,
  });
};
const insertSnippetCodeActionRegister = (
  editor: monaco.editor.IStandaloneCodeEditor,
  cb: (ed: monaco.editor.ICodeEditor) => void
) => {
  editor.addAction({
    id: "insertSnippetCode",
    label: "插入代码片段",
    keybindings: [monaco.KeyMod.chord(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
      monaco.KeyCode.KeyI
    )],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 0.1,
    run: cb,
  });
};

export const editorActions = {
  auxiliaryActionRegister,
  insertSnippetCodeActionRegister
};
