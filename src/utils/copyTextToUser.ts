export const execCopy = (text: string) => {
  if(text === undefined || text === null || text === ""){
    return;
  }

  if (navigator) {
    navigator.clipboard.writeText(text);
  } else {
    const input = document.createElement("INPUT");
    input.style.opacity = "0";
    input.style.position = "absolute";
    input.style.top = "-1000px";
    document.body.appendChild(input);
    (input as HTMLInputElement).value = text;
    (input as HTMLInputElement).select();
    (input as HTMLInputElement).setSelectionRange(0, text.length);
    document.execCommand("copy");
    document.body.removeChild(input);
  }
  return text;
};

export const copyRectParam = (
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  strType: "dot" | "object" = "dot"
) => {
  const { x, y, width, height } = rect;
  let param = "";
  if (strType === "dot") {
    param = `${x},${y},${width},${height}`;
  } else {
    param = `{"x":${x},"y":${y},"width":${width},"height":${height}}`;
  }
  execCopy(param);
};
