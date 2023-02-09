import { build } from '../src';

describe('build', () => {
  it('should build esm', async () => {
    const output = await build(`${__dirname}/fixtures/class.ts`, {
      write: false,
    });

    expect(output).toMatchSnapshot();
  });

  it('should build cjs', async () => {
    const output = await build(`${__dirname}/fixtures/class.ts`, {
      write: false,
      format: 'cjs',
    });

    expect(output).toMatchSnapshot();
    expect(output).toContain('module.exports = class_default');
  });

  it('should work with entryPoint as property', async () => {
    const output = await build({
      entry: `${__dirname}/fixtures/class.ts`,
      write: false,
    });

    expect(output).toMatchSnapshot();
  });
});
