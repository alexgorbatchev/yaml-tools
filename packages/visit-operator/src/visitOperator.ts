import YAML from 'yaml';

type NodePath = readonly (YAML.Node<unknown> | YAML.Document<YAML.Node<unknown>> | YAML.Pair<unknown, unknown>)[];

/**
 * A utility for the [yaml](https://github.com/eemeli/yaml) to process special
 * nodes, lets call them operators, with the purpose of making plain YAML a
 * little bit smarter.
 *
 * With this visitor, you can implement YAML file inclusion or node substitution
 * for example. Visitors can return a new map, sequence, scalar or undefined.
 */
export const visitOperator = (
  doc: YAML.Document,
  operator: string,
  cb: (args: readonly string[], node: YAML.Pair, path: NodePath) => YAML.Pair | YAML.Pair[] | undefined | void,
): YAML.Document => {
  const results = doc.clone();

  YAML.visit(results, {
    Pair(key, node, path) {
      if (!YAML.isScalar(node.key) || !String(node.key.value).startsWith(operator)) return;

      const [, ...args] = String(node.key.value).slice(1).split(/\s+/);
      const result = cb(args, node, path);

      if (typeof result === 'undefined') return;

      if (YAML.isPair(result)) {
        return result;
      }

      if (Array.isArray(result)) {
        const parent = path[path.length - 1];

        if (YAML.isMap(parent)) {
          const before = parent.items.slice(0, Number(key));
          const after = parent.items.slice(Number(key) + 1);
          parent.items = [...before, ...result, ...after];
        }

        return;
      }

      const parentMap = path[path.length - 1];

      if (YAML.isMap(parentMap) && YAML.isMap(result)) {
        const additions = result.items;
        const before = parentMap.items.slice(0, Number(key));
        const after = parentMap.items.slice(Number(key) + 1);
        parentMap.items = [...before, ...additions, ...after];
        return;
      }

      const parentSeq = path[path.length - 2];

      if (YAML.isSeq(parentSeq) && YAML.isSeq(result)) {
        const index = parentSeq.items.indexOf(parentMap);
        const additions = result.items;
        const before = parentSeq.items.slice(0, index);
        const after = parentSeq.items.slice(index + 1);
        parentSeq.items = [...before, ...additions, ...after];
        return;
      }
    },
  });

  return results;
};
