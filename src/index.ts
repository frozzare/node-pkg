import fs from 'fs';
import { build as esbuild, BuildOptions } from 'esbuild';

export const build = async (
  entryPoint: string,
  config: Omit<BuildOptions, 'bundle' | 'entryPoints'> = {}
) => {
  const out = await esbuild({
    ...config,
    entryPoints: [entryPoint],
    bundle: true,
    write: false,
  });

  const file = out.outputFiles[0];
  let text = file.text;

  if (config.format === 'cjs') {
    const reg = /module.exports = \__toCommonJS\((\w+)\);/;
    const match = text.match(reg);
    const name = match[1].replace('_exports', '_default');

    text = text.replace(match[0], '') + `\nmodule.exports = ${name}`;
  }

  return !config.write ? text : fs.writeFileSync(file.path, text);
};
