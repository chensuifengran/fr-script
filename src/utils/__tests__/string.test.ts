import { describe, it, expect } from "vitest";
import { objectToString, processDate, transformFnStr } from "../string";

describe("objectToString", () => {
  it("should convert a simple object to string", () => {
    const obj = { a: 1, b: "test" };
    expect(objectToString(obj)).toBe('{\n  a: 1,\n  b: "test"\n}');
  });

  it("should convert a nested object to string", () => {
    const obj = { a: 1, b: { c: 2, d: "nested" } };
    expect(objectToString(obj)).toBe(
      '{\n  a: 1,\n  b: {\n    c: 2,\n    d: "nested"\n  }\n}'
    );
  });

  it("should handle null values", () => {
    const obj = { a: null, b: "test" };
    expect(objectToString(obj)).toBe('{\n  a: null,\n  b: "test"\n}');
  });

  it("should handle boolean values", () => {
    const obj = { a: true, b: false };
    expect(objectToString(obj)).toBe("{\n  a: true,\n  b: false\n}");
  });

  it("should handle arrays", () => {
    const obj = { a: [1, 2, 3], b: "test" };
    expect(objectToString(obj)).toBe(
      '{\n  a: [\n    1,\n    2,\n    3\n  ],\n  b: "test"\n}'
    );
  });

  it("should handle array as root", () => {
    const arr = [1, { a: 2 }, "test"];
    expect(objectToString(arr)).toBe(
      '[\n  1,\n  {\n    a: 2\n  },\n  "test"\n]'
    );
  });

  it("should handle functions", () => {
    const obj = {
      a: 1,
      b: function () {
        const a = 0;
        return a;
      },
    };
    expect(objectToString(obj).replace(/\s/g, "")).toBe(
      "{\n  a: 1,\n  b: function() { const a = 0;return a; }\n}".replace(
        /\s/g,
        ""
      )
    );
  });

  it("should handle arrow functions", () => {
    const obj = { a: 1, b: () => "test" };
    expect(objectToString(obj)).toBe('{\n  a: 1,\n  b: () => "test"\n}');
  });

  it("should handle undefined values", () => {
    const obj = { a: undefined, b: "test" };
    expect(objectToString(obj)).toBe('{\n  b: "test"\n}');
  });

  it("should handle Date objects", () => {
    const date = new Date("2023-01-01");
    const obj = { a: processDate(date) };
    expect(objectToString(obj)).toBe(`{\n  a: "__D2S__${date.toLocaleString()}"\n}`);
  });

  it("should handle objects with functions", () => {
    const obj = {
      a: 1,
      b: function () {
        return "test";
      },
    };
    expect(objectToString(obj).replace(/\s/g, "")).toBe(
      "{\n  a: 1,\n  b: function() { return \"test\"; }\n}".replace(/\s/g, "")
    );
  });

  it("should handle objects with arrow functions", () => {
    const obj = { a: 1, b: () => "test" };
    expect(objectToString(obj)).toBe('{\n  a: 1,\n  b: () => "test"\n}');
  });
});

describe("processDate", () => {
  it("should process Date object to string with prefix", () => {
    const date = new Date("2023-01-01");
    expect(processDate(date)).include("__D2S__2023/1/1")
  });

  it("should return the string as is if input is a string", () => {
    const str = "test string";
    expect(processDate(str)).toBe("test string");
  });

  it("should handle invalid Date objects", () => {
    const date = new Date("invalid date");
    expect(processDate(date)).toBe("__D2S__Invalid Date");
  });

  it("should handle empty string", () => {
    const str = "";
    expect(processDate(str)).toBe("");
  });

  it("should handle null input", () => {
    const str = null;
    expect(processDate(str)).toBe(null);
  });

  it("should handle undefined input", () => {
    const str = undefined;
    expect(processDate(str)).toBe(undefined);
  });
});

describe("transformFnStr", () => {
  it("should transform a valid function string to a function", () => {
    const fnStr = "function() { return 'test'; }";
    const fn = transformFnStr(fnStr);
    expect(typeof fn).toBe("function");
    expect(fn!()).toBe("test");
  });

  it("should transform a valid arrow function string to a function", () => {
    const fnStr = "() => 'test'";
    const fn = transformFnStr(fnStr);
    expect(typeof fn).toBe("function");
    expect(fn!()).toBe("test");
  });

  it("should return undefined for an invalid function string", () => {
    const fnStr = "invalid function string";
    const fn = transformFnStr(fnStr);
    expect(fn).toBeUndefined();
  });

  it("should return undefined for an empty string", () => {
    const fnStr = "";
    const fn = transformFnStr(fnStr);
    expect(fn).toBeUndefined();
  });

  it("should return undefined for undefined input", () => {
    const fn = transformFnStr(undefined);
    expect(fn).toBeUndefined();
  });
});
