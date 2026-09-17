# Plytix API Documentation

Fumadocs (Next.js) project for the Plytix API docs. This is a test/preview build — see `comments-1.md` and `comments-2.md` for the infra conversation this answers, and `documentation-structure.md` for the source information architecture.

## Requirements

- Node.js **22.x** (see `.nvmrc`; tested on 22.21.1)
- npm

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000/docs.

## Content structure

Pages live in `content/docs/`, split into three top-level sections (each a root folder in Fumadocs, rendered as tabs in the top navbar — Notebook layout, `tabMode="navbar"`, matching the earlier `plytix-docs/docs-fumadocs` preview):

- `guides/` — Get Started (real content ported from the preview: Overview, Quickstart), Plytix MCP, Integration Guides
- `reference/` — API Reference Overview (real content: overview, authentication, errors/status codes, rate limits), Endpoints (generated from `openapi.json`, see below)
- `legacy/` — API v1/v2 Reference

Pages without a source in the earlier preview (data model, choosing an API version, MCP setup, the 8 integration guides, filtering/pagination/updates reference, legacy v1/v2) are still placeholder stubs.

## Branding

Ported from `plytix-docs/docs-fumadocs`: Plytix purple (`--color-fd-primary: #7a52ff` in `app/global.css`), Figtree font, and `public/logo/{light,dark}.svg` + `public/favicon.svg`.

## OpenAPI reference

`openapi.json` (copied from the preview) drives the `reference/endpoints/` pages via `fumadocs-openapi`. Regenerate after the spec changes:

```bash
npm run generate:api
```

**Cloudflare-specific fix:** `lib/openapi.ts` imports `openapi.json` directly (`import openapiSchema from '@/openapi.json'`) instead of passing a file path to `createOpenAPI({ input: [...] })`. Workers have no filesystem, so the file-path form fails at request time with `[OpenAPI] Failed to resolve input`. If you copy this pattern elsewhere, keep the direct import.

## MCP server

Enabled via `app/api/mcp/route.ts` (added with `npx @fumadocs/cli feature mcp`). Once deployed, an MCP-compatible assistant can connect with:

```json
{ "mcpServers": { "docs": { "url": "https://<your-deploy-url>/api/mcp" } } }
```

## Analytics

Self-hosted Umami is wired as a no-op placeholder — set `NEXT_PUBLIC_UMAMI_SRC` and `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (see `.env.example`) once an instance exists.

## Deploying (Cloudflare via OpenNext)

This is a standard Next.js server app — **not** a static export — because the MCP route needs a live API endpoint.

```bash
npm run build       # verify the Next.js build
npm run cf:preview  # opennextjs-cloudflare build + local wrangler preview
npm run cf:deploy   # opennextjs-cloudflare build + wrangler deploy (requires `wrangler login`)
```

**Bundle size note:** the built Worker script is ~6.7 MB gzip (the OpenAPI spec adds a few MB), already over Cloudflare's free-tier 3 MiB Worker size limit. Deploying this needs the **Workers Paid plan** (10 MiB limit, ~$5/mo) — flag this with Infra before they provision the free tier.
