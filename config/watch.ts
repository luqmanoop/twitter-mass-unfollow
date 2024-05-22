import Bun, { $ } from 'bun';
import { parseArgs } from 'util';
import { watch } from 'fs';
import type { FSWatcher } from 'fs';

import './cwd';

const {
  values: { dir },
} = parseArgs({
  args: Bun.argv,
  strict: true,
  allowPositionals: true,
  options: {
    dir: {
      type: 'string',
    },
  },
});

const directoriesToWatch = dir?.split(',').map((dir) => `./${dir}`) || [];

const watchers: FSWatcher[] = [];

await $`bun run config/build.ts`;

console.log(
  `Watching for ${directoriesToWatch.join(', ')} directories for changes...`
);

for (const directory of directoriesToWatch) {
  const watcher = watch(directory, async (event, filename) => {
    console.log(`Detected ${event} in ${filename}`);
    await $`bun run config/build.ts`;
  });

  watchers.push(watcher);
}

process.on('SIGINT', () => {
  watchers.forEach((watcher) => watcher.close());
  process.exit(0);
});
