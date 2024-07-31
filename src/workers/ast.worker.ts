import {
  Project,
  SourceFile,
  Node,
  ObjectBindingPattern,
  CallExpression,
  VariableDeclaration,
  ObjectLiteralExpression,
  PropertyAssignment,
  ShorthandPropertyAssignment,
  SpreadAssignment,
} from "ts-morph";
import ts from "typescript";
import * as monaco from "monaco-editor";
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
const parseNodeValue = (node: Node, offset: number, ss: SourceFile): any => {
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
  if (node.isKind(ts.SyntaxKind.ArrowFunction)) {
    return node.getText();
  }
  if (node.isKind(ts.SyntaxKind.TrueKeyword)) {
    return true;
  }
  if (node.isKind(ts.SyntaxKind.FalseKeyword)) {
    return false;
  }
  if (node.isKind(ts.SyntaxKind.StringLiteral)) {
    return node.getText().replace(/"/g, "");
  }
  if (node.isKind(ts.SyntaxKind.NumericLiteral)) {
    return +node.getText();
  }
  if (node.isKind(ts.SyntaxKind.BinaryExpression)) {
    const expression = node.getText();
    try {
      const res = eval(expression);
      return res;
    } catch (error) {
      return expression;
    }
  }

  if (node.isKind(ts.SyntaxKind.NullKeyword)) {
    return null;
  }
  return undefined;
};
//获得离光标最近的变量声明的值
const getNearestVariableValue = (
  offset: number,
  name: string,
  ss: SourceFile,
  treeLevel: number
) => {
  let res: string | number | boolean | undefined | null = "";
  const visit = (node: Node<ts.Node>) => {
    if (node.getKind() === ts.SyntaxKind.VariableDeclaration) {
      if (node.getEnd() <= offset && getNodeTreeLevel(node) <= treeLevel) {
        const vNode = node as VariableDeclaration;
        if (vNode.getName() === name) {
          const initializer = vNode.getInitializer();
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
