import fs from 'fs';
import path from 'path';
import { build as esbuild, BuildOptions as ESBuildOptions } from 'esbuild';
import { omit } from './utils';

export type BuildOptions = Omit<ESBuildOptions, 'bundle' | 'entryPoints'>;

const defaultOptions = {
  write: true,
};

export const build = async (
  entry: string | (BuildOptions & { entry: string }),
  options: BuildOptions = {}
) => {
  const config = omit(['entry'], {
    ...defaultOptions,
    ...(typeof entry === 'object' ? entry : options),
  });

  const result = await esbuild({
    ...config,
    entryPoints: [typeof entry === 'string' ? entry : entry.entry],
    bundle: true,
    write: false,
  });

  if (result.errors.length) {
    throw result.errors;
  }

  if (result.warnings.length) {
    result.warnings.forEach(console.warn);
  }

  if (!result.outputFiles?.length) {
    throw new Error('No outfile defined');
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
