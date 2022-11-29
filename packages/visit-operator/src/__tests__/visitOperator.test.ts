import yaml from '@yaml-tools/inline';
import YAML from 'yaml';

import { visitOperator } from '../visitOperator.js';

test('visitOperator', async () => {
  let doc: YAML.Document = yaml`
    deps:
      +dependencies linting:
        linting-1: ^2.4.2
        linting-2: ^5.8.0
        linting-3: ^8.5.0

      +dependencies testing:
        testing-1: ^27.0.3
        # comments should be ok
        testing-2: ^27.4.5
        testing-3: ^27.1.2

    here:
      too:
        +dependencies nested:
          nested-1: ^16.11.6
          nested-2: next

    +remove: value

    # comments
    results:
      set1:
          +with: [ nested, testing ]
          pkg: latest

      set2:
        +with: [ nested ]
  `;

  doc = visitOperator(doc, '+remove', () => {
    return YAML.visit.REMOVE;
  });

  doc = visitOperator(doc, '+dependencies', (args, node) => {
    if (!YAML.isMap(node.value)) return;
    const key = new YAML.Scalar(args[0]);
    const pair = doc.createPair(key, node.value.items);
    return pair;
  });

  doc = visitOperator(doc, '+with', (_args, node) => {
    if (!YAML.isSeq(node.value)) return;
    const pairs = node.value.items.map((item, index) => doc.createPair(item, index));
    return pairs;
  });

  expect(doc.toString()).toMatchInlineSnapshot(`
    "deps:
      linting:
        - linting-1: ^2.4.2
        - linting-2: ^5.8.0
        - linting-3: ^8.5.0
      testing:
        - testing-1: ^27.0.3
        - # comments should be ok
          testing-2: ^27.4.5
        - testing-3: ^27.1.2

    here:
      too:
        nested:
          - nested-1: ^16.11.6
          - nested-2: next

    # comments
    results:
      set1:
        nested: 0
        testing: 1
        pkg: latest

      set2:
        nested: 0
    "
  `);
});
