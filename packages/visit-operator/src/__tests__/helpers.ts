import { readFile } from 'node:fs/promises';
import { join } from 'node:path/posix';
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yaml';

export const $dirname = (meta: any) => path.dirname(fileURLToPath(meta.url));
export const getFixture = (fileName: string) => readFile(join($dirname(import.meta), fileName), 'utf-8');
export const getYamlFixture = async (fileName: string): Promise<YAML.Document> =>
  YAML.parseDocument(await getFixture(fileName));
