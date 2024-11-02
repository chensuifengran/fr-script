import {
  Project,
  SourceFile,
  Node,
  ObjectBindingPattern,
  CallExpression,
  ObjectLiteralExpression,
  SpreadAssignment,
  BinaryExpression,
  Identifier,
} from "ts-morph";
import ts from "typescript";
import * as monaco from "monaco-editor";
const STRING_QUOTATION_MARK_REGEX = /(^["'`]{1,2})|(["'`]{1,2}$)/g;
const defaultCache = () => ({
  analyzeFnInfo: {
    lastCode: "",
    lastSS: <SourceFile | null>null,
  },
  methodIsInvoked: {
    lastCode: "",
    lastSS: <SourceFile | null>null,
  },
  checkSyntaxErrors: {
    lastCode: "",
    lastSS: <SourceFile | null>null,
  },
});
let cache = defaultCache();
const project = new Project({ useInMemoryFileSystem: true });
const getNodeTreeLevel = (node: Node) => {
  let level = 0;
  let parent = node.getParent();
  while (parent) {
    level++;
    parent = parent.getParent();
  }
  return level;
};
const parseObjectLiteral = (node: Node, nodeOffset: number, ss: SourceFile) => {
  const n = node as ObjectLiteralExpression;
  let resObj: Record<string, any> = {};
  const properties = n.getProperties();
  properties.forEach((p) => {
    if (p.isKind(ts.SyntaxKind.PropertyAssignment)) {
      const key = p.getName();
      const value = p.getInitializer();
      if (value) {
        resObj[key] = parseNodeValue(value, nodeOffset, ss);
      }
    } else if (p.isKind(ts.SyntaxKind.ShorthandPropertyAssignment)) {
      const key = p.getName();
      const value = getNearestVariableValue(
        nodeOffset,
        key,
        ss,
        getNodeTreeLevel(node)
      );
      resObj[key] = value;
    } else if (p.isKind(ts.SyntaxKind.SpreadAssignment)) {
      const prop = p as SpreadAssignment;
      const value = parseNodeValue(prop.getExpression(), nodeOffset, ss);
      resObj = { ...resObj, ...value };
    } else {
      console.error("不支持的属性", p.getKindName());
    }
  });
  return resObj;
};

const processBinaryExpression = (
  node: Node,
  nodeOffset: number,
  ss: SourceFile
): any => {
  let n: BinaryExpression;
  if (node.isKind(ts.SyntaxKind.ParenthesizedExpression)) {
    n = node.getExpression() as BinaryExpression;
  } else {
    n = node as BinaryExpression;
  }
  let left, right;
  if (
    n.getLeft().isKind(ts.SyntaxKind.BinaryExpression) ||
    n.getLeft().isKind(ts.SyntaxKind.ParenthesizedExpression)
  ) {
    left = processBinaryExpression(n.getLeft(), nodeOffset, ss);
  } else {
    left = parseNodeValue(n.getLeft(), nodeOffset, ss, false);
  }
  if (
    n.getRight().isKind(ts.SyntaxKind.BinaryExpression) ||
    n.getRight().isKind(ts.SyntaxKind.ParenthesizedExpression)
  ) {
    right = processBinaryExpression(n.getRight(), nodeOffset, ss);
  } else {
    right = parseNodeValue(n.getRight(), nodeOffset, ss, false);
  }
  const evalStr = `${left}${n.getOperatorToken().getText()}${right}`;
  const res = new Function(`return ${evalStr}`)();
  return res;
};
//获得离变量节点最近的函数参数中包含指定变量名的函数作用域起点
const getNearestFnScopeStartOffset = (node: Identifier): number => {
  let res = 0;
  let parent: Node | undefined = node.getParent();
  const variableName = node.getText();
  while (parent) {
    if (
      parent.isKind(ts.SyntaxKind.FunctionDeclaration) ||
      parent.isKind(ts.SyntaxKind.ArrowFunction)
    ) {
      const fn = parent;
      const params = fn.getParameters();
      for (let i = 0; i < params.length; i++) {
        if (params[i].getName() === variableName) {
          res = (fn.getBody()?.getStart() || 0) + 2;
          break;
        }
      }
      if (res) {
        break;
      }
    }
    parent = parent.getParent();
  }
  return res;
};

const parseNodeValue = (
  node: Node,
  nodeOffset: number,
  ss: SourceFile,
  delQuotationMarks = true
): any => {
  if (node.isKind(ts.SyntaxKind.AsExpression)) {
    node = node.getExpression();
  }
  if (node.isKind(ts.SyntaxKind.ArrayLiteralExpression)) {
    const res = node
      .getElements()
      .map((e) => parseNodeValue(e, nodeOffset, ss));
    return res;
  }
  if (node.isKind(ts.SyntaxKind.ObjectLiteralExpression)) {
    return parseObjectLiteral(node, nodeOffset, ss);
  }
  if (node.isKind(ts.SyntaxKind.Identifier)) {
    const startOffset = getNearestFnScopeStartOffset(node);
    const res = getNearestVariableValue(
      nodeOffset,
      node.getText(),
      ss,
      getNodeTreeLevel(node),
      startOffset,
      startOffset === 0
    );
    return res;
  }
  if (node.isKind(ts.SyntaxKind.CallExpression)) {
    try {
      const res = new Function(`return ${node.getText()}`)();
      return res;
    } catch (error) {
      return;
    }
  }
  if (
    node.isKind(ts.SyntaxKind.PropertyAccessExpression) ||
    node.isKind(ts.SyntaxKind.ElementAccessExpression)
  ) {
    try {
      const scope = node.getExpression().getText();
      const targetObj = getNearestVariableValue(
        nodeOffset,
        scope,
        ss,
        getNodeTreeLevel(node)
      );
      if (targetObj) {
        if (node.isKind(ts.SyntaxKind.PropertyAccessExpression)) {
          return targetObj[node.getName()];
        } else {
          const key = node.getArgumentExpression();
          if (key?.isKind(ts.SyntaxKind.StringLiteral)) {
            return targetObj[
              key.getText().replace(STRING_QUOTATION_MARK_REGEX, "")
            ];
          } else if (key?.isKind(ts.SyntaxKind.NumericLiteral)) {
            return targetObj[+key.getText()];
          } else if (key?.isKind(ts.SyntaxKind.Identifier)) {
            const iValue = parseNodeValue(key, nodeOffset, ss);
            return targetObj[iValue];
          }
          console.warn("未知的ElementAccessExpression", key?.getKindName());
        }
      }
    } catch (error) {
      console.error("parseNodeValue fail:", error);
    }
    return;
  }
  if (
    node.isKind(ts.SyntaxKind.ArrowFunction) ||
    node.isKind(ts.SyntaxKind.FunctionDeclaration) ||
    node.isKind(ts.SyntaxKind.FunctionExpression)
  ) {
    return `__FUNC__` + node.getText();
  }
  if (node.isKind(ts.SyntaxKind.ClassDeclaration)) {
    try {
      const res = new Function(
        ts.transpileModule(node.getText(), {
          compilerOptions: { module: ts.ModuleKind.ESNext },
        }).outputText +
          ";" +
          node.getName()
      )();
      return res;
    } catch (error) {
      console.error("get Class fail:", error);
      return;
    }
  }
  if (node.isKind(ts.SyntaxKind.NewExpression)) {
    try {
      const str =
        getNearestClassString(
          nodeOffset,
          node.getExpression().getText(),
          ss,
          getNodeTreeLevel(node)
        ) +
        ";const target = " +
        node.getText() +
        ";target";
      const res = new Function(`return ${str}`)();
      return res;
    } catch (error) {
      console.error("get NewExpression instance fail:", error);
      return;
    }
  }
  if (node.isKind(ts.SyntaxKind.TrueKeyword)) {
    return true;
  }
  if (node.isKind(ts.SyntaxKind.FalseKeyword)) {
    return false;
  }
  if (node.isKind(ts.SyntaxKind.StringLiteral)) {
    return delQuotationMarks
      ? node.getText().replace(STRING_QUOTATION_MARK_REGEX, "")
      : node.getText();
  }
  if (node.isKind(ts.SyntaxKind.TemplateExpression)) {
    const variables = node.getTemplateSpans().map((t) => {
      let value = parseNodeValue(t.getExpression(), nodeOffset, ss);
      try {
        if (typeof value !== "string") {
          value = JSON.stringify(value).replace(
            STRING_QUOTATION_MARK_REGEX,
            ""
          );
        }
      } catch (error) {}
      const expression = t.getExpression().getText();
      return {
        value,
        expression,
      };
    });
    let oriText = node.getText().replace(STRING_QUOTATION_MARK_REGEX, "");
    variables.forEach((v) => {
      oriText = oriText.replace(`\$\{${v.expression}\}`, v.value);
    });
    return oriText;
  }
  if (node.isKind(ts.SyntaxKind.NoSubstitutionTemplateLiteral)) {
    return node.getText().replace(STRING_QUOTATION_MARK_REGEX, "");
  }
  if (node.isKind(ts.SyntaxKind.NumericLiteral)) {
    return +node.getText();
  }
  if (
    node.isKind(ts.SyntaxKind.BinaryExpression) ||
    node.isKind(ts.SyntaxKind.ParenthesizedExpression)
  ) {
    try {
      const res = processBinaryExpression(node, nodeOffset, ss);
      return res;
    } catch (error) {
      const expression = node.getText();
      return expression;
    }
  }
  if (node.isKind(ts.SyntaxKind.NullKeyword)) {
    return null;
  }
};
//获得离光标最近的类声明的字符串
const getNearestClassString = (
  nodeOffset: number,
  className: string,
  ss: SourceFile,
  treeLevel: number
) => {
  let res = "";
  const visit = (node: Node<ts.Node>) => {
    if (node.isKind(ts.SyntaxKind.ClassDeclaration)) {
      if (node.getEnd() <= nodeOffset && getNodeTreeLevel(node) <= treeLevel) {
        if (node.getName() === className) {
          res = ts.transpile(node.getText(), {
            target: ts.ScriptTarget.ESNext,
          });
        }
      }
    }
    node.forEachChild(visit);
  };
  ss.forEachChild(visit);
  return res;
};

//获得离光标最近的变量声明的值
const getNearestVariableValue = (
  nodeOffset: number,
  name: string,
  ss: SourceFile,
  treeLevel: number,
  startOffset = 0,
  limitInitValue = true
) => {
  let res: any = "__UNDEFINED_FLAG__";
  const visit = (node: Node<ts.Node>) => {
    if (
      node.getStart() >= startOffset &&
      node.getEnd() <= nodeOffset &&
      getNodeTreeLevel(node) <= treeLevel
    ) {
      if (
        //变量声明
        node.isKind(ts.SyntaxKind.VariableDeclaration) ||
        //赋值表达式
        ((!limitInitValue || res !== "__UNDEFINED_FLAG__") &&
          node.isKind(ts.SyntaxKind.BinaryExpression)) ||
        //函数声明、类声明
        node.isKind(ts.SyntaxKind.FunctionDeclaration) ||
        node.isKind(ts.SyntaxKind.ClassDeclaration)
      ) {
        if (node.isKind(ts.SyntaxKind.VariableDeclaration)) {
          if (node.getName() === name) {
            const initializer = node.getInitializer();
            if (initializer) {
              res = parseNodeValue(initializer, nodeOffset, ss);
            } else {
              res = undefined;
            }
          }
        } else if (node.isKind(ts.SyntaxKind.BinaryExpression)) {
          if (node.getLeft().getText() === name) {
            res = parseNodeValue(node.getRight(), nodeOffset, ss);
          }
        } else if (
          node.isKind(ts.SyntaxKind.FunctionDeclaration) ||
          node.isKind(ts.SyntaxKind.ClassDeclaration)
        ) {
          if (node.getName() === name) {
            res = node.getText();
          }
        }
      }
    }
    node.forEachChild(visit);
  };
  ss.forEachChild(visit);
  return res === "__UNDEFINED_FLAG__" ? undefined : res;
};

const getDeconstructionName = (
  nodeOffset: number,
  apiName: string,
  ss: SourceFile
) => {
  let res: string | boolean | number | undefined | null = "";
  const visit = (node: Node<ts.Node>) => {
    if (node.getKind() === ts.SyntaxKind.ObjectBindingPattern) {
      if (node.getEnd() <= nodeOffset) {
        const OBPNode = node as ObjectBindingPattern;
        if (OBPNode.getText().includes(apiName)) {
          const initializer = OBPNode.getParent()?.getInitializer();
          if (initializer) {
            res = initializer.getText();
          } else {
            res = undefined;
          }
        }
      }
    }
    node.forEachChild(visit);
  };
  ss.forEachChild(visit);
  return res;
};

const analyzeFnInfo = async (
  code: string,
  cursorOffset: number,
  position: monaco.Position | null
) => {
  let ss;
  if (code === cache.analyzeFnInfo.lastCode) {
    ss = cache.analyzeFnInfo.lastSS;
  } else {
    if (cache.analyzeFnInfo.lastSS) {
      project.removeSourceFile(cache.analyzeFnInfo.lastSS);
    }
    ss = project.createSourceFile("analyzeFnInfo.temp.ts", code);
    cache.analyzeFnInfo.lastCode = code;
    cache.analyzeFnInfo.lastSS = ss;
  }
  if (!position) {
    self.postMessage(null);
    return;
  }
  let targetInfo: {
    pos: {
      startIndex: number;
      endIndex: number;
    };
    name: string;
    args: any[];
  } | null = null;
  const visit = (node: Node<ts.Node>) => {
    //如果光标位置位于函数或者函数调用的位置,获取作用域scope名(如有)、函数名、函数参数、函数参数的位置
    if (
      node.isKind(ts.SyntaxKind.CallExpression) &&
      node.getStart() <= cursorOffset &&
      node.getEnd() >= cursorOffset
    ) {
      const n = node;
      let name = n.getExpression().getText();
      const scope = getDeconstructionName(cursorOffset, name, ss!);
      let isDeconstruction = false;
      if (scope?.length && !name.includes(".")) {
        name = scope + "." + name;
        isDeconstruction = true;
      }
      const args = n.getArguments().map((a, index) => {
        const t = a.getType().getText();
        let returnValue: any = undefined;
        if (t === "undefined[]") {
          returnValue = [];
        }
        try {
          const res = parseNodeValue(a, cursorOffset, ss!);
          returnValue =
            typeof res === "string"
              ? res.replace(STRING_QUOTATION_MARK_REGEX, "")
              : res;
        } catch (error) {
          console.error(error, a.getText());
        }
        return {
          value: returnValue,
          type: t,
          expression: a.getText(),
          index,
        };
      });
      const sp = n.getStart();
      const ep = n.getEnd();
      let startIndex = sp + (name.length + 1);
      if (isDeconstruction) {
        startIndex -= scope.length + 1;
      }
      const endIndex = ep - 1;
      targetInfo = {
        pos: {
          startIndex,
          endIndex,
        },
        name,
        args,
      };
    }
    node.forEachChild(visit);
  };
  ss!.forEachChild(visit);
  if (targetInfo) {
    targetInfo = targetInfo as {
      pos: {
        startIndex: number;
        endIndex: number;
      };
      name: string;
      args: any[];
    };
    const nameArr = targetInfo.name.split(".");
    const result = {
      scope: nameArr.length > 1 ? nameArr[0].replace("?", "") : "",
      name: nameArr.length > 1 ? nameArr[1] : nameArr[0],
      params: targetInfo.args,
      pos: targetInfo.pos,
    };
    self.postMessage(result);
  } else {
    self.postMessage(null);
    return;
  }
};
/**
 * 判断代码中是否调用了指定方法
 * @param code 代码
 * @param methodFullName 方法的全名：如Predules.log
 */
const methodIsInvoked = (code: string, methodFullName: string): boolean => {
  let isInvoked = false;
  let ss: SourceFile;
  if (code === cache.methodIsInvoked.lastCode) {
    if (!cache.methodIsInvoked.lastSS) {
      cache.methodIsInvoked.lastSS = project.createSourceFile(
        "methodIsInvoked.temp.ts",
        code
      );
      ss = cache.methodIsInvoked.lastSS;
    } else {
      ss = cache.methodIsInvoked.lastSS;
    }
  } else {
    if (cache.methodIsInvoked.lastSS) {
      project.removeSourceFile(cache.methodIsInvoked.lastSS);
    }
    ss = project.createSourceFile("methodIsInvoked.temp.ts", code);
    cache.methodIsInvoked.lastCode = code;
    cache.methodIsInvoked.lastSS = ss;
  }
  const visit = (node: Node<ts.Node>) => {
    if (node.getKind() === ts.SyntaxKind.CallExpression) {
      const n = node as CallExpression;
      let name = n.getExpression().getText();
      const scope = getDeconstructionName(code.length, name, ss!);
      if (scope) {
        name = scope + "." + name;
      }
      if (name === methodFullName) {
        isInvoked = true;
      }
    }
    !isInvoked && node.forEachChild(visit);
  };
  ss.forEachChild(visit);
  return isInvoked;
};

const parseInvokeApiConfig = (code: string, exportApiName: string) => {
  project.getSourceFile("parseInvokeApiConfig.ts")?.delete();
  const ss = project.createSourceFile(
    "parseInvokeApiConfig.ts",
    code
      .replace(`<InvokeApiMethodType>`, "")
      .replace(`<ApiDocumentType>`, "")
      .replace(`<TestModuleDialogType>`, "")
  );
  let indexFileInfo: Record<string, any> | null = null;
  const visit = (node: Node<ts.Node>) => {
    if (node.isKind(ts.SyntaxKind.VariableDeclaration)) {
      if (node.getName() === exportApiName) {
        indexFileInfo = parseNodeValue(node.getInitializer()!, 0, ss);
      }
    }
    indexFileInfo || node.forEachChild(visit);
  };
  ss.forEachChild(visit);
  return indexFileInfo;
};
const clearCache = () => {
  if (cache.analyzeFnInfo.lastSS) {
    project.removeSourceFile(cache.analyzeFnInfo.lastSS);
  }
  if (cache.methodIsInvoked.lastSS) {
    project.removeSourceFile(cache.methodIsInvoked.lastSS);
  }
  if (cache.checkSyntaxErrors.lastSS) {
    project.removeSourceFile(cache.checkSyntaxErrors.lastSS);
  }
  cache = defaultCache();
};

self.onmessage = function (e) {
  if (e.data.type === "analyzeFnInfo") {
    analyzeFnInfo(e.data.code, e.data.cursorOffset, e.data.position);
  } else if (e.data.type === "methodIsInvoked") {
    const isInvoked = methodIsInvoked(e.data.code, e.data.methodFullName);
    self.postMessage(isInvoked);
  } else if (e.data.type === "parseInvokeApiConfig") {
    const indexFileInfo = parseInvokeApiConfig(
      e.data.code,
      e.data.exportApiName
    );
    self.postMessage(indexFileInfo);
  } else if (e.data.type === "clearCache") {
    clearCache();
  } else {
    self.postMessage(null);
  }
};
