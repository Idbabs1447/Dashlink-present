# Dashlink — Digital Presence Proposal

Presentation microsite for Dashlink, built with Figma Make (React 19 + Vite 8 + Tailwind CSS v4).

## Local development

Toolchain (see `.mise.toml`): Node 22, pnpm 10.34.3.

```bash
pnpm install          # install dependencies (uses pnpm-lock.yaml)
pnpm dev              # dev server on http://localhost:8443 (set PORT to change)
pnpm build            # production build -> dist/
pnpm preview          # serve the production build locally
```

## Deploying to Vercel

Everything Vercel needs is in `vercel.json`, so no dashboard settings are required — just import the
GitHub repository in Vercel and deploy (values in `vercel.json` override the project settings):

| Setting          | Value                                                   |
| ---------------- | ------------------------------------------------------- |
| Framework        | `vite`                                                  |
| Install command  | `npx --yes pnpm@10.34.3 install --frozen-lockfile`      |
| Build command    | `vite build`                                            |
| Output directory | `dist`                                                  |
| Node.js          | 22.x (pinned via `engines.node` in `package.json`)      |

`vercel.json` also adds a single-page-app rewrite (every unknown URL serves `index.html`) and
long-lived immutable caching for the content-hashed `/assets/*.js` and `/assets/*.css` files.

### About the `public` folder

`public/` is Vite's static folder, **not** the deploy output. Files in it are copied unchanged to the root of
the built site, so `public/assets/dashlink-logo-white.png` is served at `/assets/dashlink-logo-white.png`
(which is how `src/App.tsx` references every image). The deploy output is `dist/`, which `vite build`
generates (and `vercel.json` points Vercel at). Do not set `public` as the output directory.

### Site metadata

Title, description and language for the HTML shell live in `.figma/make/site.json`; `vite.config.ts`
reads it at build time and fills the `<!-- figma:* -->` placeholders in `index.html`.
