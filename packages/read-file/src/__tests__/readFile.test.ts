import { join } from 'node:path/posix';

import { readFile } from '../readFile.js';
import { $dirname } from './helpers.js';

const cwd = join($dirname(import.meta), 'fixtures');

test('readFile', () => {
  const yaml = readFile(join($dirname(import.meta), 'fixtures/subfolder/readFile.yaml'), { cwd });
  expect(yaml.toString()).toMatchSnapshot();
});
