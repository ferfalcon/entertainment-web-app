# Repository Guidelines

## Project Structure & Module Organization

This repository contains documentation, source assets, and an Astro frontend for the Entertainment web app.

- `frontend/` is the active Astro application. Source code lives in `frontend/src/`, with pages in `frontend/src/pages/`, reusable components in `frontend/src/components/`, layouts in `frontend/src/layouts/`, and bundled assets in `frontend/src/assets/`.
- `frontend/public/` stores static files served from the site root, such as favicons.
- `docs/assets/` contains reference HTML screens, SVG icons, thumbnails, and `data.json` from the design/source material.
- `README.md`, `SPEC.md`, `DESIGN.md`, and `PLAN.md` describe project goals, requirements, design direction, and implementation planning.

## Build, Test, and Development Commands

Run frontend commands from `frontend/`, where `package.json` and `pnpm-lock.yaml` are located.

- `pnpm install` installs dependencies using the locked package versions.
- `pnpm dev` starts the local Astro development server.
- `pnpm astro dev --background` starts Astro in background mode for agent workflows; use `pnpm astro dev status`, `pnpm astro dev logs`, and `pnpm astro dev stop` to manage it.
- `pnpm build` builds the production site into `frontend/dist/`.
- `pnpm preview` serves the production build locally for final checks.

## Coding Style & Naming Conventions

The frontend uses Astro with strict TypeScript settings via `astro/tsconfigs/strict`. Keep modules as ES modules, match existing `.astro` formatting, and prefer semantic HTML with mobile-first CSS. Use CSS custom properties where shared values emerge, and lean on Grid/Flexbox for layout. Name Astro components in PascalCase, for example `MediaCard.astro`, and route files with lowercase or kebab-case names.

## Testing Guidelines

No automated test suite is currently configured. Treat `pnpm build` as the minimum validation before submitting changes. If tests are added, add the test runner and scripts in `frontend/package.json`, keep test files close to the code they cover or in a clearly named test directory, and use `.test.ts` or `.spec.ts` suffixes.

## Commit & Pull Request Guidelines

Recent commits use short imperative summaries, sometimes with a Conventional Commit prefix such as `feat:`. Keep commit subjects focused and under roughly 72 characters, for example `feat: add media card layout` or `Add bookmarked page assets`. Pull requests should include a concise description, linked issue or task when available, validation steps such as `pnpm build`, and screenshots or recordings for visible UI changes.

## Agent-Specific Instructions

Follow the more specific `frontend/AGENTS.md` instructions when working under `frontend/`. Do not commit generated build output, dependency directories, or local editor state unless explicitly requested.
