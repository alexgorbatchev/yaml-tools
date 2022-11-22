import YAML from 'yaml';

import { getNodePath } from '../getNodePath.js';
import { getYamlFixture } from './helpers.js';

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
  const yaml = await getYamlFixture('fixtures/getNodePath.yaml');
  const [node, path] = getPath(yaml)!;
  const actual = getNodePath([...path, node]);
  expect(actual).toMatchObject(['this', 'is', 0, 'deep', 2, 'tslib']);
});
