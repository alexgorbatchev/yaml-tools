# @yaml-tools/visit-operator

A utility for the [yaml](https://github.com/eemeli/yaml) package to process special
nodes, lets call them operators, with the purpose of making plain YAML a little
bit smarter.

With this visitor, you can implement YAML file inclusion or node substitution for
example. Visitors can return a new map, sequence, scalar or undefined.

## Basic example

```yaml
+with:
  - hello
```

```ts
import visitOperator from `@yaml-tools/visit-operator`;

const newYaml = visitOperator(yaml, '+with', (args, node) => {
  // args === []
  return ...
});
```

## Arguments example

```yaml
+with a b c:
  - hello
```

```ts
const newYaml = visitOperator(yaml, '+with', (args, node) => {
  // args === ['a', 'b', 'c']
  return ...
});
```
