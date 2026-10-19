# Shared UI components

- Owner: `src/_components/common/`.
- The `ohmygui` tree contains reusable React UI primitives and their theme styles.
- Route-specific demos remain under the owning page, while reusable primitives stay isolated from route entry points.

## Static asset delivery

- `public/_headers` is copied into the Cloudflare static asset output. Requests under `/_astro/*` use `Cache-Control: public, max-age=0, must-revalidate`: browser storage remains available, but responses must be revalidated before reuse. Cloudflare supplies ETags for existing assets.
- The installed Cloudflare adapter’s default wildcard immutable rule also applies to missing assets. An explicitly configured matching Cache-Control rule prevents that automatic rule from being injected, avoiding long-lived browser-cached 404s during deployment/cache mismatches.
- Publish this policy with the existing `npm run deploy` command. Changing server headers cannot retroactively invalidate an immutable response already stored by a browser; recover affected clients using DevTools Disable cache plus reload, or clear cached site files.
