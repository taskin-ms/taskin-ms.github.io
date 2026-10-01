import Eleventy from '@11ty/eleventy';
import { rm } from 'node:fs/promises';
import { resolve,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../',import.meta.url)));
const output = resolve(root,'_site');
if(dirname(output) !== root) throw new Error('Build output must remain inside this repository');
// A clean output prevents deleted notes remaining in the next deployment.
await rm(output,{recursive:true,force:true});
await new Eleventy('content','_site').write();
