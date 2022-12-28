# @yaml-tools/read-file

A utility for the [yaml](https://github.com/eemeli/yaml) package to read YAML
files which can include other YAML files via a special `+include` operator. Each
included files can also include other files. No circular inclusion check is
done, so don't do it or else... In addition, each `YAML.Node` gets a new property
called `filePath` which contains full path to the originating YAML file.

Include file path must be either relative to the YAML file and start with a
dot `./foo` or relative to the `opts.cwd` and start with a tilde `~/foo`.

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
import readFile, { hasFilePath, withFilePath } from `@yaml-tools/read-file`;

const doc = readFile('./file.yaml', { cwd: process.cwd() });
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

hasFilePath(doc.contents!);
// true

withFilePath(doc.contents!).filePath;
// /home/alex/test/file.yaml
```

## Options

* `opts.cwd` -- defaults to `process.cwd()`.
* `disableIncludes` -- when `true`,  `readFile` won't process `+include` operators, default `false`.
* `disableFilePathInjection` -- when `true`,  `readFile` won't inject `filePath` into each `YAML.Node`, default `false`.

## Helpers

* `hasFilePath` -- type predicate helper function to check if a `YAML.Node` has `filePath`.
* `withFilePath` -- returns a `YAML.Node & WithFilePath` variety if passed value is a `YAML.Node` with `filePath`.
* `WithFilePath` -- TypeScript interface.
