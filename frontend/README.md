# Entertainment Web App Frontend

Astro frontend for the Entertainment Web App. The app currently has the project-owned base layout, global styling foundation, Outfit font setup, and a temporary home placeholder while the remaining implementation phases are built.

## Project Structure

```text
frontend/
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       ├── global.css
│       ├── reset.css
│       ├── tokens.css
│       └── utilities.css
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

Future phases will add app/auth layouts, navigation, data, media components, route pages, and client-side enhancements under `src/`.

## Commands

Run commands from this `frontend/` directory.

| Command | Action |
| :-- | :-- |
| `pnpm install` | Install dependencies from the lockfile |
| `pnpm dev` | Start the Astro dev server |
| `pnpm astro dev --background` | Start Astro in background mode for agent workflows |
| `pnpm astro dev status` | Check the background dev server |
| `pnpm astro dev logs` | Read background dev server logs |
| `pnpm astro dev stop` | Stop the background dev server |
| `pnpm build` | Build the production site to `dist/` |
| `pnpm preview` | Preview the production build locally |

## Implementation Notes

- Astro version is managed through `package.json`; keep the existing Astro 7 setup.
- Node must satisfy `>=22.12.0`.
- Product UI typography uses Outfit via `@fontsource/outfit`.
- Global design tokens live in `src/styles/tokens.css`.
- Do not reintroduce Astro starter assets or starter demo components.
