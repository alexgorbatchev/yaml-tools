import { join } from 'node:path/posix';

import { readFile } from '../readFile.js';
import { $dirname } from './helpers.js';

const __dirname = $dirname(import.meta);
const cwd = join(__dirname, 'fixtures');

test('readFile', () => {
  const yaml = readFile(join(__dirname, 'fixtures/subfolder/readFile.yaml'), { cwd });
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
