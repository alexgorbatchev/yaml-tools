import yaml from '@yaml-tools/inline';
import YAML from 'yaml';

import { getNodePath } from '../getNodePath.js';

const getPath = (yaml: YAML.Document) => {
  let result: [unknown, readonly (YAML.Node | YAML.Document | YAML.Pair)[]] = [] as any;

  YAML.visit(yaml, {
    Scalar(_key, node, path) {
      if (String(node.value) === 'tslib') {
        result = [node, path];
      }
    },
  });

  return result;
};

test('getNodePath', async () => {
  const doc = yaml`
    this:
      is:
        - deep:
            - $types/node: ^16.11.6
            - eslint: ../local/path
            - tslib: next
  `;

  const [node, path] = getPath(doc)!;
  const actual = getNodePath([...path, node]);
  expect(actual).toMatchObject(['this', 'is', 0, 'deep', 2, 'tslib']);
});
