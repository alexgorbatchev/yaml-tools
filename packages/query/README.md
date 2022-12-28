# @yaml-tools/query

A utility for the [yaml](https://github.com/eemeli/yaml) package that lets you query a YAML document using simple object syntax. This module is a simplified fork of the [yaml-doc-query](https://github.com/Xiphe/yaml-doc-query).

```ts
import yaml from '@yaml-tools/inline';
import query from '@yaml-tools/query';

const doc = yaml`
  one: hello world
  two:
    - three: 4
    - five: 5
`;

const selector = query(doc);

selector.one();
// Scalar {
//   value: 'hello world',
//   range: [ 8, 19, 20 ],
//   source: 'hello world',
//   type: 'PLAIN'
// }

selector.two[0].three();
// Scalar {
//   value: 4,
//   range: [ 40, 41, 42 ],
//   source: '4',
//   type: 'PLAIN'
// }
```
