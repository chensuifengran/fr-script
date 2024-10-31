import { describe, it, expect } from "vitest";
import { objectToString } from "../string";

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
});
