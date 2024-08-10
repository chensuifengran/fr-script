import * as monaco from "monaco-editor";
export type AnalyzeFnInfoParams = {
  type: string;
  value: any;
  expression: string;
  index: number;
};
export type AnalyzeFnInfoType = {
  scope: string;
  name: string;
  params: AnalyzeFnInfoParams[];
  paramsRange: {
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
  };
} | null;
const worker = new Worker(
  new URL("../workers/ast.worker.ts", import.meta.url),
  { type: "module" }
);
const analyzeFnInfo = (
  editorModel: monaco.editor.ITextModel | null,
  position: monaco.Position | null
) => {
  return new Promise<AnalyzeFnInfoType>((resolve) => {
    worker.onmessage = (e) => {
      const data = e.data as {
        scope: string;
        name: string;
        params: AnalyzeFnInfoParams[];
        pos: {
          startIndex: number;
          endIndex: number;
        };
      } | null;
      if (!data) {
        resolve(data);
      } else {
        const s = editorModel?.getPositionAt(data.pos.startIndex);
        const e = editorModel?.getPositionAt(data.pos.endIndex);
        if (s && e) {
          const pos = new monaco.Selection(
            s.lineNumber,
            s.column,
            e.lineNumber,
            e.column
          );
          resolve({
            scope: data.scope,
            name: data.name,
            params: data.params,
            paramsRange: {
              startLineNumber: pos.startLineNumber,
              endLineNumber: pos.endLineNumber,
              startColumn: pos.startColumn,
              endColumn: pos.endColumn,
            },
          });
        } else {
          resolve(null);
        }
      }
    };
    const code = editorModel?.getValue() || "";
    const cursorOffset = editorModel?.getOffsetAt(position!) || 0;
    worker.postMessage({
      type: "analyzeFnInfo",
      code,
      cursorOffset,
      position,
    });
  });
};

const methodIsInvoked = (code: string, methodFullName: string) => {
  return new Promise<boolean>((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data as boolean);
    };
    worker.postMessage({
      type: "methodIsInvoked",
      code,
      methodFullName,
    });
  });
};

const parseInvokeApiConfig = (code: string, exportApiName: string) => {
  return new Promise<Record<string, any>>((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data);
    };
    worker.postMessage({
      type: "parseInvokeApiConfig",
      code,
      exportApiName,
    });
  });
};

export const astWorker = {
  analyzeFnInfo,
  methodIsInvoked,
  parseInvokeApiConfig,
};
