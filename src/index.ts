import fs from 'fs';
import path from 'path';
import { build as esbuild, BuildOptions as ESBuildOptions } from 'esbuild';

export type BuildOptions = Omit<ESBuildOptions, 'bundle' | 'entryPoints'>;

const defaultOptions = {
  write: true,
};

export const build = async (entryPoint: string, options: BuildOptions = {}) => {
  const config = { ...defaultOptions, ...options };

  const result = await esbuild({
    ...config,
    entryPoints: [entryPoint],
    bundle: true,
    write: false,
  });

  if (result.errors.length) {
    throw result.errors;
  }

  if (result.warnings.length) {
    result.warnings.forEach(console.warn);
  }

  const file = result.outputFiles[0];
  let text = file.text;

  if (config.format === 'cjs') {
    const reg = /module.exports = __toCommonJS\((\w+)\);/;
    const match = text.match(reg);

    if (!match) {
      throw new Error('Failed to find export name');
    }

    const name = match?.[1].replace('_exports', '_default');
    text = text.replace(match?.[0] || '', '') + `\nmodule.exports = ${name};`;
  }

  if (!config.write) {
    return text;
  }

  fs.mkdirSync(path.dirname(file.path));

  return !config.write ? text : fs.writeFileSync(file.path, text);
};
