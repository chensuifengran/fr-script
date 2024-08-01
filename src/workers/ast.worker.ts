import {
  Project,
  SourceFile,
  Node,
  ObjectBindingPattern,
  CallExpression,
  ObjectLiteralExpression,
  PropertyAssignment,
  ShorthandPropertyAssignment,
  SpreadAssignment,
  BinaryExpression,
} from "ts-morph";
import ts from "typescript";
import * as monaco from "monaco-editor";
const STRING_QUOTATION_MARK_REGEX = /(^["'`])|(["'`]$)/g;
const cache = {
  lastCode: "",
  lastSS: <SourceFile | null>null,
};
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
const parseObjectLiteral = (node: Node, offset: number, ss: SourceFile) => {
  const n = node as ObjectLiteralExpression;
  let resObj: Record<string, any> = {};
  const properties = n.getProperties();
  properties.forEach((p) => {
    if (p.isKind(ts.SyntaxKind.PropertyAssignment)) {
      const prop = p as PropertyAssignment;
      const key = prop.getName();
      const value = prop.getInitializer();
      if (value) {
        resObj[key] = parseNodeValue(value, offset, ss);
      }
    } else if (p.isKind(ts.SyntaxKind.ShorthandPropertyAssignment)) {
      const prop = p as ShorthandPropertyAssignment;
      const key = prop.getName();
      const value = getNearestVariableValue(
        offset,
        key,
        ss,
        getNodeTreeLevel(node)
      );
      resObj[key] = value;
    } else if (p.isKind(ts.SyntaxKind.SpreadAssignment)) {
      const prop = p as SpreadAssignment;
      const value = parseNodeValue(prop.getExpression(), offset, ss);
      resObj = { ...resObj, ...value };
    } else {
      console.log("未知属性", p.getKindName());
    }
  });
  return resObj;
};
//
const processBinaryExpression = (
  node: Node,
  offset: number,
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
    left = processBinaryExpression(n.getLeft(), offset, ss);
  } else {
    left = parseNodeValue(n.getLeft(), offset, ss, false);
  }
  if (
    n.getRight().isKind(ts.SyntaxKind.BinaryExpression) ||
    n.getRight().isKind(ts.SyntaxKind.ParenthesizedExpression)
  ) {
    right = processBinaryExpression(n.getRight(), offset, ss);
  } else {
    right = parseNodeValue(n.getRight(), offset, ss, false);
  }
  const evalStr = `${left}${n.getOperatorToken().getText()}${right}`;
  const res = eval(evalStr);
  return res;
};
const parseNodeValue = (
  node: Node,
  offset: number,
  ss: SourceFile,
  delQuotationMarks = true
): any => {
  if (node.isKind(ts.SyntaxKind.AsExpression)) {
    node = node.getExpression();
  }
  if (node.isKind(ts.SyntaxKind.ArrayLiteralExpression)) {
    const res = node.getElements().map((e) => parseNodeValue(e, offset, ss));
    return res;
  }
  if (node.isKind(ts.SyntaxKind.ObjectLiteralExpression)) {
    return parseObjectLiteral(node, offset, ss);
  }
  if (node.isKind(ts.SyntaxKind.Identifier)) {
    const res = getNearestVariableValue(
      offset,
      node.getText(),
      ss,
      getNodeTreeLevel(node)
    );
    return res;
  }
  if (node.isKind(ts.SyntaxKind.CallExpression)) {
    try {
      const res = eval(node.getText());
      return res;
    } catch (error) {
      return undefined;
    }
  }
  if (
    node.isKind(ts.SyntaxKind.PropertyAccessExpression) ||
    node.isKind(ts.SyntaxKind.ElementAccessExpression)
  ) {
    try {
      const scope = node.getExpression().getText();
      const targetObj = getNearestVariableValue(
        offset,
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
            console.log(targetObj, key.getText());
            return targetObj[
              key.getText().replace(STRING_QUOTATION_MARK_REGEX, "")
            ];
          } else if (key?.isKind(ts.SyntaxKind.NumericLiteral)) {
            return targetObj[+key.getText()];
          } else if (key?.isKind(ts.SyntaxKind.Identifier)) {
            const iValue = parseNodeValue(key, offset, ss);
            return targetObj[iValue];
          }
          console.log("未知的ElementAccessExpression", key?.getKindName());
        }
      }
    } catch (error) {
      console.error("parseNodeValue fail:", error);
    }
    return undefined;
  }
  if (node.isKind(ts.SyntaxKind.ArrowFunction)) {
    try {
      const res = eval(node.getText());
      return res;
    } catch (error) {
      return undefined;
    }
  }
  if (node.isKind(ts.SyntaxKind.FunctionDeclaration)) {
    const fnName = node.getName();
    try {
      const res = eval(`${node.getText()};${fnName}`);
      return res;
    } catch (error) {
      return undefined;
    }
  }
  if (node.isKind(ts.SyntaxKind.ClassDeclaration)) {
    try {
      const res = eval(
        ts.transpileModule(node.getText(), {
          compilerOptions: { module: ts.ModuleKind.ESNext },
        }).outputText +
          ";" +
          node.getName()
      );
      return res;
    } catch (error) {
      console.error("get Class fail:", error);
      return undefined;
    }
  }
  if (node.isKind(ts.SyntaxKind.NewExpression)) {
    try {
      const str =
        getNearestClassString(
          offset,
          node.getExpression().getText(),
          ss,
          getNodeTreeLevel(node)
        ) +
        ";const target = " +
        node.getText() +
        ";target";
      const res = eval(str);
      return res;
    } catch (error) {
      console.error("get NewExpression instance fail:", error);
      return undefined;
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
  if (node.isKind(ts.SyntaxKind.NumericLiteral)) {
    return +node.getText();
  }
  if (
    node.isKind(ts.SyntaxKind.BinaryExpression) ||
    node.isKind(ts.SyntaxKind.ParenthesizedExpression)
  ) {
    try {
      const res = processBinaryExpression(node, offset, ss);
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
  offset: number,
  className: string,
  ss: SourceFile,
  treeLevel: number
) => {
  let res = "";
  const visit = (node: Node<ts.Node>) => {
    if (node.isKind(ts.SyntaxKind.ClassDeclaration)) {
      if (node.getEnd() <= offset && getNodeTreeLevel(node) <= treeLevel) {
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
  offset: number,
  name: string,
  ss: SourceFile,
  treeLevel: number
) => {
  let res: any = "__UNDEFINED_FLAG__";
  const visit = (node: Node<ts.Node>) => {
    if (
      //变量声明
      node.isKind(ts.SyntaxKind.VariableDeclaration) ||
      //赋值表达式
      (res !== "__UNDEFINED_FLAG__" &&
        node.isKind(ts.SyntaxKind.BinaryExpression))
    ) {
      if (node.getEnd() <= offset && getNodeTreeLevel(node) <= treeLevel) {
        if (node.isKind(ts.SyntaxKind.VariableDeclaration)) {
          if (node.getName() === name) {
            const initializer = node.getInitializer();
            if (initializer) {
              res = parseNodeValue(initializer, offset, ss);
            } else {
              res = undefined;
            }
          }
        } else {
          const n = node as BinaryExpression;
          if (n.getLeft().getText() === name) {
            res = parseNodeValue(n.getRight(), offset, ss);
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
  offset: number,
  apiName: string,
  ss: SourceFile
) => {
  let res: string | boolean | number | undefined | null = "";
  const visit = (node: Node<ts.Node>) => {
    if (node.getKind() === ts.SyntaxKind.ObjectBindingPattern) {
      if (node.getEnd() <= offset) {
        const OBPNode = node as ObjectBindingPattern;
        if (OBPNode.getText().includes(apiName)) {
          const initializer = OBPNode.getParent()?.getInitializer();
          if (initializer) {
            res = parseNodeValue(initializer, offset, ss);
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
  if (code === cache.lastCode) {
    ss = cache.lastSS;
  } else {
    if (cache.lastSS) {
      project.removeSourceFile(cache.lastSS);
    }
    ss = project.createSourceFile("analyzeFnInfo.temp.ts", code);
    cache.lastCode = code;
    cache.lastSS = ss;
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
      node.getKind() === ts.SyntaxKind.CallExpression &&
      node.getStart() <= cursorOffset &&
      node.getEnd() >= cursorOffset
    ) {
      const n = node as CallExpression;
      let name = n.getExpression().getText();
      const scope = getDeconstructionName(cursorOffset, name, ss!);
      let isDeconstruction = false;
      if (scope?.length && !name.includes(".")) {
        name = scope + "." + name;
        isDeconstruction = true;
      }
      const args = n.getArguments().map((a) => {
        const t = a.getType().getText();
        if (t === "undefined[]") {
          return [];
        }
        try {
          const res = parseNodeValue(a, cursorOffset, ss!);
          return res;
        } catch (error) {
          console.error(error, a.getText());
          return [];
        }
      });
      console.log(args);

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

self.onmessage = function (e) {
  if (e.data.type === "analyzeFnInfo") {
    analyzeFnInfo(e.data.code, e.data.cursorOffset, e.data.position);
  }
};
