export const objectToString = (
  target: any,
  indent: number = 2,
  currentIndent: number = 0
): string => {
  const space = " ".repeat(currentIndent + indent);
  const closingSpace = " ".repeat(currentIndent);
  if (Array.isArray(target)) {
    const arrayValues = target.map((item) => {
      if (typeof item === "object" && item !== null) {
        return objectToString(item, indent, currentIndent + indent);
      } else if (typeof item === "string") {
        return `"${item}"`;
      } else if (typeof item === "function") {
        return item.toString();
      } else {
        return item;
      }
    });
    return `[\n${space}${arrayValues.join(`,\n${space}`)}\n${closingSpace}]`;
  }

  const entries = Object.entries(target).map(([key, value]) => {
    if (Array.isArray(value)) {
      const arrayValues = value.map((item) => {
        if (typeof item === "object" && item !== null) {
          return objectToString(item, indent, currentIndent + indent);
        } else if (typeof item === "string") {
          return `"${item}"`;
        } else if (typeof item === "function") {
          return item.toString();
        } else {
          return item;
        }
      });
      return `${key}: [\n${space}${space}${arrayValues.join(
        `,\n${space}${space}`
      )}\n${space}${closingSpace}]`;
    } else if (typeof value === "object" && value !== null) {
      return `${key}: ${objectToString(value, indent, currentIndent + indent)}`;
    } else if (typeof value === "string") {
      return `${key}: "${value}"`;
    } else if (typeof value === "function") {
      return `${key}: ${value.toString()}`;
    } else {
      return `${key}: ${value}`;
    }
  });
  const result = `{\n${space}${entries.join(`,\n${space}`)}\n${closingSpace}}`;
  return result;
};
