# @yaml-tools/read-file

A utility for the [yaml](https://github.com/eemeli/yaml) to read YAML files
which can include other YAML files via a special `+include` operator. Each
included files can also include other files. No circular inclusion check is
done, so don't do it or else...

Include file path must be either relative to the YAML file and start with a
dot `./foo` or relative to the `opts.cwd` and start with a tilde `~/foo`.

`opts.cwd` defaults to `process.cwd()`.

```yaml
anchors:
  map:
    +include: ~/getNodePath.yaml
  sequence:
    - 0
    - +include: ../readYAMLFile-sequence.yaml
    - 1
  another: value
  boo: 10
```

```ts
readFile('./file.yaml', { cwd: process.cwd() });

// anchors:
//   map:
//     this:
//       is:
//         deep:
//           foo: value
//           bar: next
//   sequence:
//     - 0
//     - a
//     - b
//     - c
//     - 1
//   another: value
//   boo: 10
```
