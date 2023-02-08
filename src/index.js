const fs = require('fs');
const path = require('path');
const { build: esbuild } = require('esbuild');

export const build = async (entryPoint, config = {}) => {
  const out = await esbuild({
    ...config,
    entryPoints: [entryPoint],
    bundle: true,
    write: false,
  });

  const file = out.outputFiles[0];
  const name = file.text
    .match(/\__toCommonJS\((\w+)\)/)?.[1]
    ?.replace('_exports', '_default');

  const body =
    config?.format === 'cjs'
      ? file.text.replace(/\__toCommonJS\(\w+\)/, name)
      : file.text;

  return !config.write ? body : fs.writeFileSync(file.path, body);
};
