# @yaml-tools/get-node-path

A utility for the [yaml](https://github.com/eemeli/yaml) that converts an array
of nodes to a simple path to node represented via an array of strings or numbers.
Would most commonly used in `YAML.visit()`.

```ts
YAML.visit(yaml, (key, node, path) => {
  console.log(getNodePath(path));
});

// ['this', 'is', 'node', 'path']
```
