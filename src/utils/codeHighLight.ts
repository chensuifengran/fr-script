import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "../assets/scss/highlight-vs.scss";
hljs.registerLanguage("typescript", typescript);

export const codeHighLight = (code: string, tabReplace = "  ") => {
  tabReplace = tabReplace.replace(" ", "&nbsp;");
  const rows = code.split("\n");
  const rowCodes = rows.map((rowCode) =>
    hljs
      .highlight(rowCode, {
        language: "typescript",
      })
      .value.replace(/\t/g, tabReplace)
  );

  return rowCodes;
};
