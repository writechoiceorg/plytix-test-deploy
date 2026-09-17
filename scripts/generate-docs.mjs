import { readFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';

const openapi = createOpenAPI({
  input: ['./openapi.json'],
});

const referenceDir = './content/docs/reference';
const stagingDir = path.join(referenceDir, 'endpoints');

// Nicer group titles than the auto-generated per-tag titles (which are just
// the raw OpenAPI tag slug capitalized, e.g. "Productattributegroups").
const TAG_LABELS = {
  products: 'Products',
  assets: 'Assets',
  productcategories: 'Product Categories',
  assetcategories: 'Asset Categories',
  assetlists: 'Asset Lists',
  relationships: 'Relationships',
  productfamilies: 'Product Families',
  productattributes: 'Product Attributes',
  productattributegroups: 'Product Attribute Groups',
  pimproductlists: 'PIM Product Lists',
  channels: 'Channels',
  connections: 'Connections',
  ecatalogs: 'eCatalogs',
  importprofiles: 'Import Profiles',
  pdfcatalogs: 'PDF Catalogs',
  productfamilymodels: 'Product Family Models',
  unknown: 'Metrics',
  probes: 'Probes',
};

await generateFiles({
  input: openapi,
  output: stagingDir,
  per: 'operation',
  groupBy: 'tag',
  meta: true,
  beforeWrite(files) {
    for (const file of files) {
      if (!file.path.endsWith('.mdx')) continue;
      // Forward the preloaded OpenAPI document from the page's props down to
      // the generated <Comp .../> call, otherwise it renders with no schema.
      file.content = file.content.replace(
        /(<Comp\b[^\n]*?)\s*\/>/g,
        '$1 preloaded={props.preloaded} />',
      );
    }
  },
});

// Move each per-tag folder up to be a real page group directly under
// content/docs/reference/ (a folder, not a flattened separator) — "Endpoints"
// itself is a section header (see reference/meta.json below), but each
// resource inside it stays a collapsible group of its operation pages.
const stagingMeta = JSON.parse(await readFile(path.join(stagingDir, 'meta.json'), 'utf-8'));
const tagFolders = [];

for (const tag of stagingMeta.pages) {
  const from = path.join(stagingDir, tag);
  const to = path.join(referenceDir, tag);
  await rm(to, { recursive: true, force: true });
  await rename(from, to);

  const tagMetaPath = path.join(to, 'meta.json');
  const tagMeta = JSON.parse(await readFile(tagMetaPath, 'utf-8'));
  tagMeta.title = TAG_LABELS[tag] ?? tagMeta.title;
  await writeFile(tagMetaPath, JSON.stringify(tagMeta, null, 2) + '\n');

  tagFolders.push(tag);
}
await rm(stagingDir, { recursive: true, force: true });

// Rebuild reference/meta.json: keep whatever comes before the "Endpoints"
// section (the hand-written "Overview" pages) untouched, and replace
// everything from "Endpoints" onward with the freshly generated groups.
const referenceMetaPath = path.join(referenceDir, 'meta.json');
let referenceMeta;
try {
  referenceMeta = JSON.parse(await readFile(referenceMetaPath, 'utf-8'));
} catch {
  referenceMeta = { title: 'API Reference', root: true, pages: [] };
}
const cutIndex = referenceMeta.pages.findIndex(
  (p) => p === '---Endpoints---' || p === 'endpoints',
);
const preservedPages = cutIndex === -1 ? referenceMeta.pages : referenceMeta.pages.slice(0, cutIndex);

await writeFile(
  referenceMetaPath,
  JSON.stringify(
    { ...referenceMeta, pages: [...preservedPages, '---Endpoints---', ...tagFolders] },
    null,
    2,
  ) + '\n',
);

console.log(`Generated ${tagFolders.length} endpoint groups directly under content/docs/reference/.`);
