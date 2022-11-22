import YAML from 'yaml';

import { visitOperator } from '../visitOperator.js';
import { getYamlFixture } from './helpers.js';

test('visitOperator', async () => {
  let yaml: YAML.Document = await getYamlFixture('fixtures/visitOperator.yaml');

  yaml = visitOperator(yaml, '+dependencies', (args, node) => {
    if (!YAML.isMap(node.value)) return;
    const key = new YAML.Scalar(args[0]);
    const pair = yaml.createPair(key, node.value.items);
    return pair;
  });

  yaml = visitOperator(yaml, '+with', (_args, node) => {
    if (!YAML.isSeq(node.value)) return;
    const pairs = node.value.items.map((item, index) => yaml.createPair(item, index));
    return pairs;
  });

  expect(yaml.toString()).toMatchSnapshot();
});
