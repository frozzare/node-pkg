import { describe, expect, it } from "vitest";
import { build } from "../src";

describe("build", () => {
  it("should build esm", async () => {
    const output = await build(`${__dirname}/fixtures/class.ts`, {
      write: false,
    });

    expect(output).toMatchSnapshot();
  });

  it("should build cjs", async () => {
    const output = await build(`${__dirname}/fixtures/class.ts`, {
      write: false,
      format: "cjs",
    });

    expect(output).toMatchSnapshot();
    expect(output).toContain("module.exports = class_default");
  });

  it("should work with entry as property", async () => {
    const output = await build({
      entry: `${__dirname}/fixtures/class.ts`,
      write: false,
    });

    expect(output).toMatchSnapshot();
  });

  it("should build cjs with minify", async () => {
    const output = await build(`${__dirname}/fixtures/class.ts`, {
      write: false,
      minify: true,
      format: "cjs",
    });

    expect(output).toMatchSnapshot();
    expect(output).toContain("module.exports=b;");
  });
});
