# Activating self-hosted Umami

The tracking script is already wired in `app/layout.tsx` as a no-op: it only
renders when both env vars below are set, so this repo builds and deploys
fine with analytics off. Once your Umami instance exists, do this:

## 1. Create the website in Umami

Log into your self-hosted Umami dashboard → **Add website** → enter this
site's domain (e.g. `docs.plytix.com`). Copy the **Website ID** it generates.

## 2. Set the two env vars

```bash
NEXT_PUBLIC_UMAMI_SRC=https://<your-umami-host>/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<the-website-id-from-step-1>
```

**Local dev:** put these in a `.env.local` (already gitignored), then
`npm run dev`.

**Cloudflare deploy — read this carefully:** these are `NEXT_PUBLIC_*` vars,
so Next.js bakes them into the client bundle **at build time**, not at
runtime. Setting them in `wrangler.jsonc` `vars` or the Cloudflare dashboard
does **nothing** for this — that only affects server-side code. You must
export them in the shell (or CI secrets) *before* running `npm run cf:deploy`
/ `npm run cf:preview`, e.g.:

```bash
export NEXT_PUBLIC_UMAMI_SRC=https://umami.yourcompany.com/script.js
export NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
npm run cf:deploy
```

If you deploy via CI, add both as CI-level secrets/env vars on the deploy job.

## 3. Verify

After deploying, open the live site, check devtools → Network for a request
to `script.js` and to your Umami host's `/api/send`, then confirm a pageview
lands in the Umami dashboard within a minute.

## Optional: scope tracking to production only

If you also deploy preview builds and don't want them polluting production
analytics, only export the two vars in the production deploy job/environment
— preview builds without them will simply skip the script, which is already
the default behavior.
