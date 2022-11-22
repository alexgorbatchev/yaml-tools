import YAML from 'yaml';

export type NodePath = Array<string | number>;

/**
 * A utility for the [yaml](https://github.com/eemeli/yaml) that converts an
 * array of nodes to a simple path to node represented via an array of strings
 * or numbers. Would most commonly used in `YAML.visit()`.
 *
 * @param path A list of YAML nodes.
 */
export const getNodePath = (path: readonly (YAML.Node | YAML.Document | YAML.Pair | unknown)[]): NodePath => {
  const results: NodePath = [];

  for (let index = 1; index < path.length; index += 1) {
    const previous = path[index - 1];
    const current = path[index];

    if (YAML.isSeq(previous)) {
      results.push(previous.items.indexOf(current));
      continue;
    }

    if (YAML.isPair(current)) {
      if (YAML.isScalar(current.key)) {
        results.push(current.key.value as string);
      }
    }
  }

  return results;
};
