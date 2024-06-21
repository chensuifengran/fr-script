import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "../assets/scss/highlight-vs.scss";
hljs.registerLanguage("typescript", typescript);

export const codeHighLight = (code: string) => {
  const rows = code.split("\n");
  const rowCodes = rows.map((rowCode) => {
    const domStr = hljs.highlight(rowCode, {
      language: "typescript",
    }).value;
    let index = domStr?.split("").findIndex((item) => item !== " ") - 1;
    let result = domStr;
    if (index > 0) {
      result =
        new Array(index + 1).fill("&nbsp;").join("") + domStr.substring(index);
    }
    return result;
  });

  return rowCodes;
};
