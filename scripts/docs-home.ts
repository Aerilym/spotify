import fs from 'fs';
import { parse } from 'node-html-parser';

const v1DocHome = fs.readFileSync('docs/tmp/index.html', 'utf8');
let homepage = fs.readFileSync('docs/components/index.html', 'utf8');

const readme = parse(v1DocHome).querySelector('.tsd-panel') ?? '';
homepage = homepage.replace('<!-- READ ME TEMPLATE COMPONENT HERE -->', readme.toString());

fs.writeFileSync('docs/index.html', homepage);
