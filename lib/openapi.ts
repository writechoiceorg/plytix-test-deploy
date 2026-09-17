import { createOpenAPI } from 'fumadocs-openapi/server';
import openapiSchema from '@/openapi.json';

// Cloudflare Workers have no filesystem, so `input: ['./openapi.json']` (which
// reads the file at request time) fails there with "Failed to resolve input".
// Importing the JSON directly bundles it at build time instead.
export const openapi = createOpenAPI({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: {
    './openapi.json': openapiSchema as any,
  },
});
