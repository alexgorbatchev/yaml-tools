import path from 'path';
import { fileURLToPath } from 'url';

export const $dirname = (meta: any) => path.dirname(fileURLToPath(meta.url));
