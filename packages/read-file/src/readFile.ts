import visitOperator, { VisitorResults } from '@yaml-tools/visit-operator';
import fs from 'fs';
import { dirname, join } from 'path';
import YAML from 'yaml';

interface Options {
  /**
   * Current working directory, defaults to `process.cwd()`. This option only
   * has effect on the `+include` operator, more specifically on the `~/` paths
   * used with it.
   *
   * @default process.cwd()
   */
  cwd?: string;

  /**
   * When `true`, `readFile` won't process `+include` operators.
   *
   * @default false
   */
  disableIncludes?: boolean;

  /**
   * When `true`, `readFile` won't inject `filePath` into each `YAML.Node`.
   *
   * @default false
   */
  disableFilePathInjection?: boolean;
}

/**
 * A `YAML.Node` will conform to `WithFilePath` unless `disableFilePathInjection: true`
 * was passed via options argument.
 */
export interface WithFilePath {
  filePath: string;
}

/**
 * A type predicate helper function to check if a `YAML.Node` has `filePath`.
 */
export const hasFilePath = <T extends YAML.Node>(value: T): value is T & WithFilePath =>
  value && typeof (value as any as WithFilePath).filePath === 'string' ? true : false;

/**
 * Returns a `YAML.Node & WithFilePath` variety if passed value is a `YAML.Node` with `filePath`
 * property attached.
 */
export const withFilePath = <T extends YAML.Node>(value: T): (T & WithFilePath) | undefined =>
  hasFilePath(value) ? value : undefined;

/**
 * This helper function is the core for the `+include` operator processing.
 */
export const forEachIncludeOperator = (
  doc: YAML.Document,
  filePath: string,
  cwd: string,
  cb: (filePath: string) => VisitorResults,
): YAML.Document => {
  const context = dirname(filePath);

  return visitOperator(doc, '+include', (_, node) => {
    if (!YAML.isScalar(node.value) || typeof node.value.value !== 'string') {
      throw new Error('+include value must be a string');
    }

    const includePath = node.value.value;
    const includeFileName = includePath.startsWith('~/')
      ? includePath.replace(/^~\//, cwd + '/')
      : join(context, includePath);

    return cb(includeFileName);
  });
};

const injectFilePath = (doc: YAML.Document, filePath: string) => {
  const results = doc.clone();
  YAML.visit(results, (_, node) => {
    (node as WithFilePath).filePath = filePath;
  });
  return results;
};

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
export const readFile = (filePath: string, opts: Options = {}): YAML.Document => {
  const rawDoc = YAML.parseDocument(fs.readFileSync(filePath, 'utf-8'));
  const doc = opts.disableFilePathInjection ? rawDoc : injectFilePath(rawDoc, filePath);

  if (opts.disableIncludes) {
    return doc;
  }

  const cwd = opts?.cwd ?? process.cwd();

  return forEachIncludeOperator(doc, filePath, cwd, filePath => {
    const results = readFile(filePath, opts).contents as any;
    return opts.disableFilePathInjection ? results : injectFilePath(results, filePath);
  });
};
