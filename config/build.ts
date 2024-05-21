import Bun, { $ } from 'bun';

import './cwd';
import manifest from '../public/manifest.json';

const outdir = './build';

const {
  content_scripts,
  background: { service_worker },
} = manifest;

const scripts = content_scripts.flatMap((obj) => obj.js);

const resolveEntryPoints = (entrypoints: string[]) => {
  return entrypoints.map((entrypoint) => `./src/${entrypoint}`);
};

await $`rm -rf ${outdir}`;

await $`cp -R ./public ${outdir}`;

await Bun.build({
  target: 'browser',
  entrypoints: resolveEntryPoints([
    ...scripts,
    service_worker,
    'options.js',
    'popup.js',
  ]),
  outdir,
  splitting: true,
});
