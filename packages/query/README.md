# @yaml-tools/query

A utility for the [yaml](https://github.com/eemeli/yaml) that lets you query a YAML document using simple object syntax. This module is a simplified fork of the [yaml-doc-query](https://github.com/Xiphe/yaml-doc-query).

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
// hello world

selector.two[0].three();
// 4
```
