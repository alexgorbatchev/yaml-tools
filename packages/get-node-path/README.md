# @yaml-tools/get-node-path

A utility for the [yaml](https://github.com/eemeli/yaml) package that converts an array
of nodes to a simple path to node represented via an array of strings or numbers.
Would most be commonly used in `YAML.visit()`.

```ts
import getNodePath from `@yaml-tools/get-node-path`;

YAML.visit(yaml, (key, node, path) => {
  console.log(getNodePath(path));
});

// ['this', 'is', 'node', 'path']
```
