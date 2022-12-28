import query from '@yaml-tools/query';
import { join } from 'path';

import { hasFilePath, readFile, withFilePath } from '../readFile.js';
import { $dirname } from './helpers.js';

const __dirname = $dirname(import.meta);
const cwd = join(__dirname, 'fixtures');
const fixturePath = join(__dirname, 'fixtures/subfolder/readFile.yaml');

describe('readFile', () => {
  test('processes +include', () => {
    const yaml = readFile(fixturePath, { cwd });

    expect(yaml.toString()).toMatchInlineSnapshot(`
      "anchors:
        map:
          this:
            is:
              - deep:
                  - $types/node: ^16.11.6
                  - eslint: ../local/path
                  - tslib: next
        sequence:
          - 0
          - a
          - b
          - c
          - 1
        another: value
        boo: 10
      "
    `);
  });

  test('does not process +include', () => {
    const yaml = readFile(fixturePath, { cwd, disableIncludes: true });

    expect(yaml.toString()).toMatchInlineSnapshot(`
      "anchors:
        map:
          +include: ~/map.yaml
        sequence:
          - 0
          - +include: ../sequence.yaml
          - 1
        another: value
        boo: 10
      "
    `);
  });

  test('adds `filePath`', () => {
    const yaml = readFile(fixturePath, { cwd });
    const selector = query(yaml);
    const getFilePath = (v: any) => withFilePath(v)?.filePath.replace(`${cwd}/`, '');

    expect(getFilePath(yaml.contents)).toBe('subfolder/readFile.yaml');
    expect(getFilePath(selector.anchors.map.this.is())).toBe(`map.yaml`);
    expect(getFilePath(selector.anchors.sequence[1]())).toBe(`sequence.yaml`);
  });

  test('does not add `filePath`', () => {
    const yaml = readFile(fixturePath, { cwd, disableFilePathInjection: true });
    expect(hasFilePath(yaml.contents!)).toBe(false);
  });
});
