import { join } from 'node:path';
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dist = join(fileURLToPath(import.meta.url), '..', '..', 'dist');

const copy = (from, to) => {
    copyFileSync(join(dist, from), join(dist, to));
};

copy('node/index.d.ts', 'node/index.d.cts');