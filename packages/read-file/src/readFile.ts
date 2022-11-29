import visitOperator from '@yaml-tools/visit-operator';
import fs from 'node:fs';
import { dirname, join } from 'node:path/posix';
import YAML from 'yaml';

interface Options {
  /**
   * Current working directory, defaults to `process.cwd()`. This option only
   * has effect on the `+include` operator, more specifically on the `~/` paths
   * used with it.
   */
  cwd?: string;
}

/**
 * Reads a YAML file while processing `+include: ./path/to.yaml` nodes merging
 * contents of multiple YAML files.
 *
 * Include file path must be either relative to the YAML file and start with a
 * dot `./foo` or relative to the `opts.cwd` and start with a tilde `~/foo`.
 * `opts.cwd` defaults to `process.cwd()`.
 *
 * This function is syncronous because `YAML.visit()` is syncronous.
 */
export const readFile = (fileName: string, opts: Options = {}): YAML.Document => {
  // this method has to be syncronous because YAML.visit is syncronous

  const cwd = opts?.cwd ?? process.cwd();
  const content = fs.readFileSync(fileName, 'utf-8');
  const context = dirname(fileName);

  return visitOperator(YAML.parseDocument(content), '+include', (_, node) => {
    if (!YAML.isScalar(node.value) || typeof node.value.value !== 'string') {
      throw new Error('+include value must be a string');
    }

    const includePath = node.value.value;
    const includeFileName = includePath.startsWith('~/')
      ? includePath.replace(/^~\//, cwd + '/')
      : join(context, includePath);

    return readFile(includeFileName, { cwd }).contents as any;
  });
};
