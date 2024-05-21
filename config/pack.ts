import Bun, { $ } from 'bun';
import AdmZip from 'adm-zip';
import manifest from '../public/manifest.json';

import './cwd';

await $`bun run ./config/build.ts`;

const packName = manifest.name.toLowerCase().replace(/[\s\W]+/g, '-');

const { version } = manifest;

const folderToCompress = './build';
const outputArchive = `./release/${packName}-v${version}.zip`;

const zip = new AdmZip();

zip.addLocalFolder(folderToCompress);

zip.writeZip(outputArchive);

console.log(`Folder compressed into ${outputArchive}`);
