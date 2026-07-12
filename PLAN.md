# PLAN.md — Entertainment Web App Astro Implementation Plan

## Scope

This document defines a practical, incremental implementation plan for building the Entertainment Web App as an Astro site.

It is based on:

- the current `DESIGN.md`;
- the current `SPEC.md`;

This document does **not** implement code. It does **not** define production backend behavior, database structure, production authentication, final API endpoints, or final route internals beyond what is necessary to plan the Astro UI.

The goal is to translate the current design and specification into a staged implementation path that can be executed safely without losing alignment with the visual system.

---

## 1. Current project structure assessment

Latest repo re-check shows that the repository has moved beyond the original Astro starter state. The implementation should continue from the existing `frontend/` foundation rather than re-scaffolding or repeating cleanup that has already happened.

| Check | Current state | Planning impact |
|---|---|---|
| Repository | `ferfalcon/entertainment-web-app` exists, is public, and now has active commits. | Continue targeting this repo and branch from the current `main` state. |
| Default branch | `main` is configured. | Normal branch-based workflow can be used. |
| Latest visible repo activity | The responsive Product Card system and Home preview grid are implemented on `feature/product-card-component`. | Continue from the reusable media-card foundation instead of recreating card, grid, icon, or seed-data work. |
| Root docs | `README.md`, `DESIGN.md`, `SPEC.md`, and `PLAN.md` exist at the repo root. | Keep root docs as the project-level documentation set. |
| Astro app location | The Astro app is inside `frontend/`. | All Astro implementation paths in this plan remain under `frontend/`. |
| Package manager | `frontend/package.json` exists. | Run install/dev/build from `frontend/` for now. Do not add a root workspace yet. |
| Astro version | `frontend/package.json` uses `astro: ^7.0.7`. | Keep Astro 7. Do not re-scaffold or downgrade. |
| Font dependency | `frontend/package.json` now includes `@fontsource/outfit`. | Outfit loading is already started; keep this approach unless intentionally changed. |
| Node baseline | `frontend/package.json` requires `node >=22.12.0`. | Use Node 22.12+ locally and in CI/deployment. |
| TypeScript | `frontend/tsconfig.json` extends `astro/tsconfigs/strict`. | Preserve strict TypeScript. |
| Current home page | `frontend/src/pages/index.astro` uses `AppLayout` and renders a six-item Product Card preview grid. | Extend this composition later with search and Trending; do not replace the implemented Product Card grid. |
| Current app shell | `AppLayout.astro` composes the skip link, responsive `AppNav`, and main landmark. | Reuse this shell for app routes; do not introduce a parallel `AppShell` component. |
| Current base layout | `frontend/src/layouts/BaseLayout.astro` imports Outfit, the global foundation, and app-shell/navigation/media component CSS. | Refine this layout rather than recreating the base shell from scratch. |
| Starter layout/component | `frontend/src/layouts/Layout.astro` and `frontend/src/components/Welcome.astro` are no longer present. | Remove old cleanup tasks from the plan; avoid reintroducing starter files. |
| Foundation styles | `reset.css`, `tokens.css`, `global.css`, and `utilities.css` exist under `frontend/src/styles/`. | Audit and extend the existing style foundation instead of creating duplicate token files. |
| Existing dev instructions | `frontend/AGENTS.md` says to use `astro dev --background`. | Follow this workflow when running the dev server. |
| Frontend README | `frontend/README.md` still contains Astro starter documentation. | Rewrite later; this is documentation drift, not an app blocker. |
| Root workspace | No root pnpm workspace is needed now. | A root workspace will be introduced later. Do not add it in this implementation pass. |

### Current milestone status

Completed through `feature/product-card-component`:

- responsive NavBar component system and typed navigation data;
- mobile and tablet top navigation plus desktop sidebar behavior;
- Figma-derived inline logo/navigation icons and a locally bundled avatar;
- active route, profile current state, skip link, accessible names, and focus-visible behavior;
- Home, Movies, TV Series, Bookmarked, and Profile placeholder routes;
- reusable `ProductCard`, `ProductMeta`, `BookmarkButton`, `PlayOverlay`, and `ProductCardGrid` Astro components;
- strict media/icon types and a six-item local media data set with 18 responsive bundled thumbnails;
- responsive Product Card layouts at `164px`, `220px`, and `280px`, including desktop hover/focus and touch-visible Play treatments;
- generalized inline icon support for navigation, media categories, bookmark states, and Play;
- Home Product Card preview grid and six generated `/media/[id]` placeholder routes;
- production validation with `pnpm build`, responsive browser checks at 375px/768px/1440px, and HTTP `200` checks for all Play destinations.

The current implementation phase remains media display work. The regular Product Card milestone is complete; Trending, shared content-state components, search, and full route compositions remain.

---

## 2. Open questions still remaining

The following items are still unresolved and should remain visible during implementation:

1. [OPEN QUESTION] What should the auth loading state look like?
2. [OPEN QUESTION] What should the auth submission error state look like?
3. [OPEN QUESTION] What should the permanent thumbnail failure state look like beyond the temporary minimal fallback?
4. [OPEN QUESTION] What is the final destination and visual design for the avatar/profile page beyond the placeholder?
5. [OPEN QUESTION] What is the visual design for the media detail page opened from `Play`?
6. [OPEN QUESTION] What should happen if an unauthenticated user opens the Bookmarked page directly?
7. [OPEN QUESTION] Should there be a section-level content error state for failed media data loading, or only thumbnail-level failure states?
8. [OPEN QUESTION] What is the final visual design of the auth-required bookmark modal? The behavior and copy are confirmed, but no modal component exists in Figma.

---

## 3. Non-goals for this implementation pass

This plan does not cover:

- production backend authentication;
- database persistence;
- API design;
- server-side sessions;
- real account creation;
- real login/logout behavior;
- final auth validation rules;
- final media detail page design;
- final profile/account page design beyond the `User profile` placeholder;
- custom carousel behavior;
- dedicated route-based search;
- final permanent image-failure design;
- deployment configuration;
- root pnpm workspace setup;
- implementation code in this planning step.

---

## 4. Proposed project structure

The implementation should build inside the existing `frontend/` Astro project and reuse the current foundation files already committed there.

```text
entertainment-web-app/
├── README.md                         [existing; update later if needed]
├── DESIGN.md                         [existing]
├── SPEC.md                           [existing]
├── PLAN.md                           [this file]
└── frontend/
    ├── AGENTS.md                     [existing]
    ├── README.md                     [modify later; replace stale starter README]
    ├── astro.config.mjs              [existing; keep minimal initially]
    ├── package.json                  [existing; Astro + @fontsource/outfit]
    ├── pnpm-lock.yaml                [existing]
    ├── tsconfig.json                 [existing; keep strict]
    ├── public/
    │   ├── favicon.svg               [existing]
    │   └── favicon.ico               [existing]
    └── src/
        ├── assets/
        │   ├── media/                [implemented responsive Product Card thumbnails]
        │   └── navigation/
        │       └── image-avatar.png  [implemented build-time asset]
        ├── components/
        │   ├── auth/
        │   │   ├── AuthCard.astro
        │   │   ├── AuthLinkRow.astro
        │   │   └── FormField.astro
        │   ├── media/
        │   │   ├── ContentSection.astro
        │   │   ├── EmptyState.astro
        │   │   ├── ProductCard.astro  [implemented]
        │   │   ├── ProductCardGrid.astro [implemented]
        │   │   ├── ProductMeta.astro  [implemented]
        │   │   ├── BookmarkButton.astro [implemented static state]
        │   │   ├── PlayOverlay.astro  [implemented]
        │   │   ├── SkeletonCard.astro
        │   │   └── TrendingRail.astro
        │   ├── navigation/           [implemented]
        │   │   ├── AppNav.astro
        │   │   ├── Logo.astro
        │   │   ├── NavIconLink.astro
        │   │   └── ProfileLink.astro
        │   ├── overlays/
        │   │   └── AuthRequiredModal.astro
        │   ├── search/
        │   │   └── SearchBar.astro
        │   └── ui/
        │       ├── Icon.astro         [implemented shared icon system]
        │       └── PrimaryButton.astro
        ├── data/
        │   ├── media.ts               [implemented Product Card preview data]
        │   └── navigation.ts         [implemented; includes navigation types]
        ├── layouts/
        │   ├── BaseLayout.astro      [existing; refine]
        │   ├── AppLayout.astro       [implemented]
        │   └── AuthLayout.astro      [create]
        ├── pages/
        │   ├── index.astro            [implemented Product Card preview]
        │   ├── movies.astro           [implemented placeholder]
        │   ├── tv-series.astro        [implemented placeholder]
        │   ├── bookmarked.astro       [implemented placeholder]
        │   ├── login.astro
        │   ├── signup.astro
        │   ├── profile.astro          [implemented placeholder]
        │   └── media/
        │       └── [id].astro         [implemented static placeholders]
        ├── scripts/
        │   ├── auth-required-modal.ts
        │   ├── bookmarks.ts
        │   ├── media-images.ts
        │   └── search.ts
        ├── styles/
        │   ├── reset.css             [existing; audit/refine]
        │   ├── tokens.css            [existing; audit/refine]
        │   ├── global.css            [existing; audit/refine]
        │   ├── utilities.css         [existing; audit/refine]
        │   └── components/
        │       ├── app-shell.css      [implemented]
        │       ├── auth.css
        │       ├── media.css
        │       ├── modal.css
        │       ├── navigation.css     [implemented]
        │       └── search.css
        ├── types/
        │   ├── auth.ts
        │   ├── icon.ts                [implemented]
        │   ├── media.ts               [implemented Product Card contract]
        │   └── search.ts
        └── utils/
            ├── filterMedia.ts
            ├── formatResultCount.ts
            ├── groupBookmarked.ts
            ├── mediaGuards.ts
            └── statePriority.ts
```

### Structure notes

- `frontend/src/pages/` owns route-level composition.
- `frontend/src/layouts/` owns shared page shells.
- `frontend/src/components/` owns reusable UI units.
- `frontend/src/data/` owns temporary local data until a real source exists.
- `frontend/src/types/` defines UI contracts that mirror `SPEC.md`.
- `frontend/src/utils/` holds pure data transformation and state-priority helpers.
- `frontend/src/scripts/` holds small progressive client-side behavior.
- `frontend/src/styles/` already contains the global foundation; add component CSS without duplicating existing tokens.
- No `search.astro` route is planned for the first pass because in-page live filtering is confirmed.
- No root `package.json`/workspace is planned for this pass because a root pnpm workspace will be introduced later.

[KEY IMPLEMENTATION RISK] The Astro app lives in `frontend/`, while docs live at the repo root. Command location and documentation paths must stay explicit until the root workspace is introduced later.

---

## 5. Files to create, modify, or remove

### 5.1 Root files

| File | Action | Purpose |
|---|---|---|
| `README.md` | Modify later | Keep as project overview; update only when frontend implementation stabilizes. |
| `DESIGN.md` | Keep | Visual and UX source of truth. |
| `SPEC.md` | Keep | Product/technical specification. |
| `PLAN.md` | Update | Implementation plan aligned with repo and clarified decisions. |

### 5.2 Existing `frontend/` files

| File | Action | Purpose |
|---|---|---|
| `frontend/package.json` | Keep / minor modify | Preserve Astro 7, Node baseline, scripts, and `@fontsource/outfit`; add dependencies only when needed. |
| `frontend/pnpm-lock.yaml` | Keep | Preserve dependency lockfile after the Outfit dependency addition. |
| `frontend/astro.config.mjs` | Keep | Minimal config is acceptable initially. |
| `frontend/tsconfig.json` | Keep | Preserve strict Astro TypeScript config. |
| `frontend/AGENTS.md` | Keep | Follow existing background dev-server guidance. |
| `frontend/README.md` | Modify later | Replace outdated Astro starter README with project-specific frontend README. |
| `frontend/src/pages/index.astro` | Implemented / refine later | Uses `AppLayout` and renders the Product Card preview grid; add Trending/search later. |
| `frontend/src/layouts/BaseLayout.astro` | Implemented / refine | Imports Outfit, global foundation styles, and app-shell/navigation/media styles. |
| `frontend/src/styles/reset.css` | Keep / audit | Existing reset foundation. Adjust only if app needs require it. |
| `frontend/src/styles/tokens.css` | Extended / audit | Includes NavBar sizing/radius tokens; extend only when later components expose missing shared values. |
| `frontend/src/styles/global.css` | Keep / audit | Existing global defaults and focus-visible rule. |
| `frontend/src/styles/utilities.css` | Keep / audit | Existing `.visually-hidden` utility. |
| `frontend/src/layouts/Layout.astro` | No action | File is no longer present. Do not reintroduce it. |
| `frontend/src/components/Welcome.astro` | No action | File is no longer present. Do not reintroduce it. |
| `frontend/src/assets/astro.svg` / `background.svg` | No action | Starter assets are no longer present. Do not reintroduce them. |

### 5.3 Route pages to create or modify

| File | Action | Purpose |
|---|---|---|
| `frontend/src/pages/index.astro` | Product Card preview implemented | Home shell with six responsive recommended items; add remaining discovery content later. |
| `frontend/src/pages/movies.astro` | Placeholder implemented | Movie route shell; add catalog content later. |
| `frontend/src/pages/tv-series.astro` | Placeholder implemented | TV Series route shell; add catalog content later. |
| `frontend/src/pages/bookmarked.astro` | Placeholder implemented | Bookmarked route shell; add grouped content later. |
| `frontend/src/pages/login.astro` | Create | Login UI screen. |
| `frontend/src/pages/signup.astro` | Create | Sign Up UI screen. |
| `frontend/src/pages/profile.astro` | Placeholder implemented | App shell with the `User profile` placeholder. |
| `frontend/src/pages/media/[id].astro` | Placeholder implemented | Generates six valid Product Card Play destinations from local media data. |
| `frontend/src/pages/search.astro` | Do not create initially | Search is confirmed as in-page live filtering for the first pass. |

The temporary media-detail route is intentionally minimal. Final detail-page behavior and visual design remain out of scope.

### 5.4 Component files to create or maintain

| Component file | Purpose |
|---|---|
| `frontend/src/layouts/AppLayout.astro` | Implemented app shell with skip link, navigation, and main content slot. |
| `frontend/src/components/navigation/AppNav.astro` | Implemented responsive navigation container. |
| `frontend/src/components/navigation/NavIconLink.astro` | Implemented icon-only navigation link with active state. |
| `frontend/src/components/navigation/ProfileLink.astro` | Implemented avatar/profile link and profile current state. |
| `frontend/src/components/navigation/Logo.astro` | Implemented logo link targeting `/`. |
| `frontend/src/components/search/SearchBar.astro` | Search UI and accessible search field. |
| `frontend/src/components/media/ContentSection.astro` | Section heading + state-priority rendering slot. |
| `frontend/src/components/media/ProductCardGrid.astro` | Implemented regular responsive Product Card grid. |
| `frontend/src/components/media/ProductCard.astro` | Implemented regular media card with separate Play and bookmark controls. |
| `frontend/src/components/media/TrendingRail.astro` | Native horizontal scrolling trending/highlighted section. |
| `frontend/src/components/media/ProductMeta.astro` | Implemented year/category/rating metadata. |
| `frontend/src/components/media/BookmarkButton.astro` | Implemented prop-driven static bookmark control and future behavior hooks. |
| `frontend/src/components/media/PlayOverlay.astro` | Implemented accessible detail-page Play link. |
| `frontend/src/components/media/SkeletonCard.astro` | Loading placeholder. |
| `frontend/src/components/media/EmptyState.astro` | Lightweight `No results` empty-state message. |
| `frontend/src/components/overlays/AuthRequiredModal.astro` | Auth-required modal for unauthenticated bookmark attempts. |
| `frontend/src/components/auth/AuthCard.astro` | Shared auth form shell. |
| `frontend/src/components/auth/FormField.astro` | Form field with visual states and error association. |
| `frontend/src/components/ui/PrimaryButton.astro` | Primary CTA button. |
| `frontend/src/components/auth/AuthLinkRow.astro` | Login/Sign Up helper link row. |
| `frontend/src/components/ui/Icon.astro` | Implemented shared inline icon system for navigation and Product Card icons. |

### 5.5 Data, types, utilities, and scripts

| File | Purpose |
|---|---|
| `frontend/src/types/icon.ts` | Implemented shared icon-name contract. |
| `frontend/src/types/media.ts` | Implemented Product Card media item, responsive image asset, and category contracts. |
| `frontend/src/types/search.ts` | Search scope and search state types. |
| `frontend/src/types/auth.ts` | Auth form mode and field visual state types. |
| `frontend/src/data/media.ts` | Implemented six-item normalized seed data with responsive local image imports. |
| `frontend/src/data/navigation.ts` | Implemented navigation item definitions and their colocated type contracts. |
| `frontend/src/utils/filterMedia.ts` | Title-only scoped live-search filtering. |
| `frontend/src/utils/formatResultCount.ts` | Search result heading text, if needed. |
| `frontend/src/utils/groupBookmarked.ts` | Split saved items into movie and TV-series sections. |
| `frontend/src/utils/mediaGuards.ts` | Validate/normalize required media fields before rendering. |
| `frontend/src/utils/statePriority.ts` | Deterministic loading/error/empty/populated state priority. |
| `frontend/src/scripts/search.ts` | Live title-only search behavior, result count, and empty states. |
| `frontend/src/scripts/bookmarks.ts` | Prototype bookmark state and blocked unauthenticated behavior. |
| `frontend/src/scripts/auth-required-modal.ts` | Modal open/close, focus restoration, Escape handling. |
| `frontend/src/scripts/media-images.ts` | Image loading/failure state transitions from skeleton to loaded/fallback. |

[ASSUMPTION] These scripts should stay small and page-scoped. Avoid turning the Astro site into a single hydrated app unless future requirements demand it.

---

## 6. Proposed component structure

### 6.1 Page composition

App pages should compose the same high-level pattern:

```text
BaseLayout
└── AppLayout
    ├── AppNav
    └── main content
        ├── SearchBar
        ├── ContentSection / TrendingRail
        └── ContentSection / ProductCardGrid
```

Auth pages should use a separate pattern:

```text
BaseLayout
└── AuthLayout
    ├── Logo
    └── AuthCard
        ├── FormField(s)
        ├── PrimaryButton
        └── AuthLinkRow
```

The profile placeholder should be intentionally minimal:

```text
BaseLayout
└── AppLayout
    └── main
        └── PageHeader or simple heading: User profile
```

### 6.2 App-level components

#### `AppLayout.astro`

Responsibilities:

- compose `BaseLayout` and app-level layout class hooks;
- render the skip link and navigation;
- provide the main content slot and labeled main landmark;
- avoid owning data filtering or state mutation.

#### `AppNav.astro`

Responsibilities:

- render responsive nav structure;
- expose `aria-label="Primary"` or equivalent;
- pass active state to each `NavIconLink`;
- render profile/avatar link;
- render the logo as a link to `/`;
- avoid direct knowledge of page content.

#### `SearchBar.astro`

Responsibilities:

- render the correct placeholder and label for the current scope;
- carry data hooks for progressive enhancement;
- render current query value when needed;
- avoid owning the matching algorithm.

### 6.3 Media components

#### `ContentSection.astro`

State priority must be explicit:

1. loading;
2. error/failure;
3. empty;
4. populated.

The component should not allow contradictory states such as loading skeletons and populated cards at the same time.

#### `ProductCardGrid.astro` — Implemented

Responsibilities:

- render regular cards in a responsive grid;
- maintain order from the data source;
- render repeated cards as a semantic list;
- avoid sorting unless a later requirement defines sorting.

#### `ProductCard.astro` — Implemented

Responsibilities:

- render an `article` or equivalent semantic container;
- render thumbnail area;
- render bookmark button as a separate control;
- render play/detail link as a separate control;
- render metadata and title;
- avoid wrapping the whole card in a link if it would create nested interactive controls.

[KEY IMPLEMENTATION RISK] Media cards have both bookmark and play actions. The implementation must avoid invalid nested links/buttons and ambiguous click targets.

The implemented regular-card system also includes:

- `ProductMeta.astro` for year/category/rating metadata and Movie/TV icons;
- `BookmarkButton.astro` with static prop-driven state, `aria-pressed`, and future behavior data hooks;
- `PlayOverlay.astro` with a valid placeholder detail destination;
- responsive local `<picture>` sources and fixed reference geometry at mobile, tablet, and desktop sizes;
- a 44px bookmark hit target while preserving the Figma 32px visual control;
- desktop hover/focus and touch-visible overlay behavior.

#### `TrendingRail.astro`

Responsibilities:

- render highlighted/trending cards in a native horizontal scroll container;
- preserve keyboard access to all cards;
- avoid custom carousel controls in the first pass;
- avoid scroll snapping unless intentionally added later.

### 6.4 Bookmark modal component

#### `AuthRequiredModal.astro`

Responsibilities:

- appear when an unauthenticated user tries to bookmark an item;
- display the confirmed copy: `You need to be logged in to bookmark items.`;
- provide two actions: `Login` and `Sign up`;
- include a dismiss/close affordance;
- trap focus while open or use native `<dialog>` behavior where appropriate;
- restore focus to the bookmark button that opened it;
- support Escape key close;
- avoid mutating bookmark state while the modal is shown.

[ASSUMPTION] Because no modal design exists in Figma, the first modal should use the existing dark design system: `Blue 900` surface, white text, red primary action, and accessible focus treatment.

### 6.5 Auth components

#### `AuthCard.astro`

Responsibilities:

- receive `mode = login | signup`;
- render title, fields, submit label, and helper link content based on mode;
- expose visual states for default, active, filled, and error;
- avoid implying real account creation or real login behavior.

#### `FormField.astro`

Responsibilities:

- render label and input association;
- support default, active, filled, and error states;
- render associated error text when the field is intentionally shown in error state;
- avoid placeholder-only labeling.

#### `PrimaryButton.astro`

Responsibilities:

- render red default style;
- render white hover/active style;
- support future disabled/loading state;
- avoid deciding auth submission behavior.

---

## 7. Styling strategy

### 7.1 CSS approach

Use plain CSS with design tokens and component-scoped class naming.

Existing CSS files inside `frontend/src/styles/`:

1. `reset.css` — minimal modern reset.
2. `tokens.css` — color, typography, spacing, radius, focus, modal, motion, and viewport reference custom properties.
3. `global.css` — document defaults, app background, Outfit font usage, base link/button behavior, and focus-visible rule.
4. `utilities.css` — currently includes `.visually-hidden`.

Add component-level CSS under `frontend/src/styles/components/` as the UI system grows.

Avoid inline styles. Use CSS custom properties and classes.

### 7.2 Existing foundation cleanup

The old Astro starter `Welcome.astro` and `Layout.astro` files are no longer present. The current foundation is now:

- `BaseLayout.astro` with project title handling;
- `@fontsource/outfit` imports for weights `300` and `500`;
- global stylesheet imports;
- dark color scheme metadata;
- placeholder `index.astro` smoke-test screen.

Next styling work should focus on extending this foundation, not recreating it.

### 7.3 Design tokens

Create CSS custom properties for:

- colors: `#ffffff`, `#000000`, `#10141e`, `#161d2f`, `#5a698f`, `#fc4747`;
- overlay colors for thumbnail hover and modal backdrop;
- spacing: `0`, `8`, `16`, `24`, `32`, `40`, `56`, `72`, `80`;
- semantic typography tokens from `DESIGN.md`;
- radius values for nav/card/modal/form surfaces;
- focus-ring token;
- motion durations and reduced-motion fallback.

### 7.4 Font strategy

Use Outfit only for product UI.

[ASSUMPTION] The first implementation may use a package-based or self-hosted Outfit strategy. Do not use Plus Jakarta Sans for product UI. Any Plus Jakarta usage in the Figma style guide is documentation-only.

### 7.5 Modal styling

The auth-required modal should use the existing visual system:

- dark overlay/backdrop;
- `Blue 900` modal surface;
- white title/body text;
- red primary `Login` action;
- secondary `Sign up` action using either red text or a secondary button treatment;
- visible focus ring;
- mobile-safe width with side margins.

[KEY IMPLEMENTATION RISK] The modal is a confirmed behavior but not designed in Figma. Keep it minimal and consistent with the token system; do not invent a decorative modal style.

---

## 8. Responsive implementation strategy

Reference viewports:

- Mobile: `375px`;
- Tablet: `768px`;
- Desktop: `1440px`.

Confirmed initial targets:

| Feature | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navigation | Horizontal top nav | Horizontal top nav | Vertical sidebar |
| Search | Below top nav | Below top nav | Top of main content beside sidebar |
| Trending | Native horizontal scroll | Native horizontal scroll | Native horizontal row/scroll if overflow exists |
| Regular grid | 2 columns | 3 columns | 4 columns |
| Bookmarked sections | Stacked | Stacked | Stacked |
| Auth card | Full-ish width with margins | Centered | Centered |
| Profile placeholder | App layout + simple heading | App layout + simple heading | App layout + simple heading |
| Auth-required modal | Centered within viewport | Centered within viewport | Centered within viewport |

Implementation guidance:

- Use mobile-first CSS.
- Use CSS Grid for regular media grids.
- Use native `overflow-x: auto` for trending/highlighted content.
- Do not implement custom carousel controls in the first pass.
- Prevent global horizontal overflow.
- Give the trending rail accessible keyboard reachability and visible focus states.
- Keep modal width fluid on mobile and capped on larger viewports.

[ASSUMPTION] Practical CSS breakpoints may differ from the exact Figma reference widths if the behavior is correct at `375px`, `768px`, and `1440px`.

---

## 9. Data / props implementation

### 9.1 Local data source

Use local static data in `frontend/src/data/media.ts` for the first implementation.

The normalized UI model should include:

| Field | Requirement |
|---|---|
| `id` | Required stable string. Generate if the source only has titles. |
| `title` | Required. Display exactly as provided. |
| `year` | Required. Display in metadata. |
| `category` | Required: `Movie` or `TV Series`. |
| `rating` | Required. Display as provided. |
| `thumbnail` | Required image paths for regular cards. |
| `trendingThumbnail` | Optional image paths for trending cards. |
| `isBookmarked` | Required in normalized UI data; default `false` if omitted. |
| `isTrending` | Optional; default `false`. |
| `detailHref` | Required for playable items if detail links are active. |

### 9.2 Search rules

Search should be implemented as title-only filtering.

Confirmed first-pass rules:

- trim leading/trailing whitespace for matching;
- treat whitespace-only query as an empty query;
- match against `title` only;
- use case-insensitive partial matching;
- do not search metadata, category, or rating;
- do not implement ranking or fuzzy matching;
- show `No results` when no items match.

### 9.3 Search presentation

Search result presentation starts as in-page filtering.

- Home searches all movies and TV series.
- Movies searches only movie items.
- TV Series searches only TV-series items.
- Bookmarked searches only bookmarked items.
- Clearing the query restores the default section content.
- No `search.astro` route is needed initially.

### 9.4 Bookmark state

Bookmarking requires authentication.

First-pass behavior:

- When the user is unauthenticated and activates a bookmark button, show `AuthRequiredModal`.
- Do not mutate bookmark state while unauthenticated.
- The modal provides `Login` and `Sign up` actions.
- If a simulated authenticated state is introduced for prototyping, bookmark state may persist in `localStorage`.
- All item instances must synchronize when bookmark state changes in a simulated authenticated state.

[KEY IMPLEMENTATION RISK] The app has no real authentication yet. Keep unauthenticated behavior explicit so bookmark buttons do not silently toggle state in a way that contradicts the product rule.

### 9.5 Auth state

Auth screens are UI-only for now.

- Login and Sign Up pages should render visually correct forms.
- Fields should have accessible labels.
- Error visual states should be supported by the component API.
- Do not implement real authentication.
- Do not implement final validation logic yet.
- Do not imply successful account creation.

[ASSUMPTION] If a visible demo error state is needed for development/testing, it can be exposed through component props or a story/demo page later rather than through real validation logic now.

---

## 10. Accessibility implementation

### 10.1 Landmarks and structure

- Use one `main` landmark per page.
- Use a labeled `nav` landmark for primary navigation.
- Use semantic section headings for content sections.
- Keep heading order logical.
- Use `aria-current="page"` for the active nav item.

### 10.2 Icon-only controls

All icon-only controls must have accessible names:

- Home;
- Movies;
- TV Series;
- Bookmarked;
- Profile;
- Add/remove bookmark;
- Search icon if it is interactive; otherwise decorative.

### 10.3 Media card interactions

- Avoid nested interactive controls.
- Do not wrap the entire card in a link if the card contains a bookmark button.
- Make `Play` a clear link/control.
- Make the hover overlay available on keyboard focus.
- Ensure bookmark controls and Play links have separate focus states.

### 10.4 Search accessibility

- The search input needs an accessible label independent from placeholder text.
- Live result updates should be announced politely.
- Result announcements should not fire on every keystroke in a disruptive way.
- Empty state `No results` must be available to assistive technology.

### 10.5 Modal accessibility

For `AuthRequiredModal`:

- use native `<dialog>` where practical, or implement equivalent `role="dialog"` / `aria-modal="true"` behavior;
- move focus into the modal when opened;
- restore focus to the triggering bookmark button when closed;
- support Escape key close;
- include a visible close option;
- ensure `Login` and `Sign up` actions are keyboard reachable;
- prevent background content from being operated while the modal is open.

### 10.6 Auth form accessibility

- Each input needs an associated label.
- Required fields should be communicated when validation is introduced.
- Error messages must be associated with fields when error states are shown.
- Error state must not rely on red alone.

### 10.7 Motion and focus

- Respect `prefers-reduced-motion`.
- Avoid mandatory animation for skeleton, overlay, and modal transitions.
- Ensure focus treatment works on dark backgrounds and image thumbnails.
- Touch targets should remain comfortable on mobile and tablet.

---

## 11. Testing checklist

### 11.1 Repository/build checks

- Run commands from `frontend/`.
- `pnpm install` succeeds.
- `pnpm build` succeeds.
- `pnpm astro check` succeeds if available.
- No root workspace is introduced in this pass.
- Astro starter `Welcome` / `Layout` files are not reintroduced.

### 11.2 Visual/responsive checks

Test at:

- `375px` mobile;
- `768px` tablet;
- `1440px` desktop.

Checklist:

- desktop uses vertical sidebar;
- tablet/mobile use top nav;
- mobile grid uses two columns;
- tablet grid uses three columns;
- desktop grid uses four columns;
- trending uses native horizontal scroll;
- auth card is centered and responsive;
- modal is usable on mobile and desktop;
- no unintended global horizontal overflow.

### 11.3 Search checks

- Home search filters all titles.
- Movies search filters movie titles only.
- TV Series search filters TV-series titles only.
- Bookmarked search filters bookmarked titles only.
- Whitespace-only query behaves as empty.
- Search is case-insensitive.
- Search does not match category/rating/year.
- No matches shows `No results`.
- Clearing query restores default content.

### 11.4 Bookmark checks

- Bookmark buttons render with accessible labels.
- Unauthenticated bookmark click opens the auth-required modal.
- Modal copy reads: `You need to be logged in to bookmark items.`
- Modal includes `Login` and `Sign up` actions.
- Modal close restores focus to the triggering bookmark button.
- Bookmark state does not mutate while unauthenticated.
- If simulated authentication is enabled later, item instances sync across pages.

### 11.5 Auth UI checks

- Login page renders email/password fields, CTA, and Sign Up link.
- Sign Up page renders email/password/repeat-password fields, CTA, and Login link.
- Form fields have labels.
- Visual error state can be represented by the field component.
- No real authentication or final validation is implied.

### 11.6 Profile/detail checks

- `/profile` exists and displays a simple `User profile` message.
- Avatar/profile link points to the profile placeholder.
- Media detail visual design remains out of scope.
- Six temporary `/media/[id]` routes are generated from Product Card data and clearly marked as placeholder content.

### 11.7 Accessibility checks

- All links, buttons, inputs, bookmark controls, modal controls, and Play controls are keyboard reachable.
- Focus is visible.
- Icon-only controls have accessible names.
- Current nav item is communicated with `aria-current`.
- Search has an accessible label.
- Live search results are announced politely.
- Modal behavior is accessible.
- Reduced-motion preferences are respected.

---


## 12. Incremental implementation sequence

### Phase 0 — Apply confirmed decisions to planning — Completed

Actions:

- Treat all previously numbered assumptions as confirmed decisions.
- Use native horizontal scroll for trending.
- Use in-page title-only search.
- Use `No results` as first empty-state copy.
- Plan auth-required bookmark modal.
- Plan profile placeholder route.
- Keep root workspace out of this pass.

Acceptance:

- `PLAN.md` no longer blocks on resolved assumptions.
- Remaining open questions are limited to genuinely unresolved behavior/design.

### Phase 1 — Validate and refine the current Astro foundation — Completed

Continue from the current repo state instead of redoing starter cleanup.

Actions:

- run commands from `frontend/`;
- verify install/build with the current `package.json` and lockfile;
- keep `@fontsource/outfit`, Astro 7, and Node `>=22.12.0`;
- keep `BaseLayout.astro` as the base shell;
- use the original placeholder `index.astro` only as a foundation smoke test before replacing it in Phase 4;
- confirm old starter files are not reintroduced;
- document that `frontend/README.md` is stale and should be rewritten later.

Acceptance:

- the foundation smoke-test page built successfully before the Phase 4 route-shell replacement;
- global styles load through `BaseLayout.astro`;
- Outfit renders from the existing dependency;
- no duplicate `Layout.astro` or `Welcome.astro` appears;
- no root Astro scaffold or root pnpm workspace is added.

### Phase 2 — Audit and extend the existing style foundation — Completed

Work from existing files under `frontend/src/styles/`:

- `reset.css`;
- `tokens.css`;
- `global.css`;
- `utilities.css`.

Actions:

- compare existing tokens against `DESIGN.md` and `SPEC.md`;
- add only missing tokens needed by upcoming components;
- keep the current focus-visible and reduced-motion strategy;
- prepare component CSS files under `frontend/src/styles/components/`;
- avoid duplicating token names or creating parallel style systems.

Acceptance:

- dark background renders correctly;
- Outfit strategy remains in place;
- base focus and reduced-motion rules exist;
- token names stay aligned with `DESIGN.md`;
- no final component layout is added in this phase.

### Phase 3 — Add typed local data and utilities

Status: navigation data, shared icon types, Product Card media types, responsive image contracts, and six-item local media data are implemented. Search/auth types and pure utility work remain.

Create under `frontend/src/`:

- media types; **implemented for the Product Card contract**
- shared icon types; **implemented**
- navigation types; **implemented in `data/navigation.ts`**
- search/auth types;
- local media data; **implemented with six preview items and 18 local responsive thumbnails**
- navigation data; **implemented**
- pure utilities for filtering, grouping, formatting, and state priority.

Acceptance:

- every media item can be validated against the normalized UI contract;
- invalid items are easy to detect before rendering;
- search scopes are represented in data/types;
- title-only filtering utility exists.

### Phase 4 — Build layouts and navigation — Completed 2026-07-12

Implemented:

- `BaseLayout.astro` — refine existing base shell only if needed;
- `AppLayout.astro`;
- `AppNav.astro`;
- `NavIconLink.astro`;
- `Logo.astro`;
- `ProfileLink.astro`;
- `profile.astro` placeholder.

`AuthLayout.astro` remains part of Phase 10 because it is not required by the app NavBar shell.

Acceptance:

- navigation displays in all viewports;
- active page state works;
- desktop/sidebar and tablet/mobile/top-nav behavior works;
- accessible names and `aria-current` are in place;
- logo links to the Home route (`/`);
- profile link opens a `User profile` placeholder.

Validation completed:

- `pnpm build` succeeds with five generated routes;
- `/`, `/movies`, `/tv-series`, `/bookmarked`, and `/profile` return HTTP `200`;
- generated pages contain the correct primary/profile `aria-current="page"` state;
- generated output contains no client scripts or temporary Figma asset URLs.

### Phase 5 — Build media display components — In progress

Product Card milestone completed on `feature/product-card-component`:

- `ProductCard.astro`;
- `ProductMeta.astro`;
- `BookmarkButton.astro` with static prop-driven state;
- `PlayOverlay.astro`;
- `ProductCardGrid.astro`;
- shared icon support and responsive local thumbnail data;
- Home preview integration and placeholder Play destinations.

Remaining in this phase:

- `TrendingRail.astro`;
- `ContentSection.astro`;
- `SkeletonCard.astro`;
- `EmptyState.astro`.

Completed Product Card acceptance:

- cards render static data;
- card interactions are structurally separated;
- responsive card geometry matches `164×110`, `220×140`, and `280×174` thumbnail references;
- responsive image sources, bookmark states, Movie/TV metadata, hover/focus, and touch states are verified;
- `pnpm build` succeeds and all six Play destinations return HTTP `200`.

Remaining phase acceptance:

- regular and trending cards are visually distinct;
- trending rail uses native horizontal scroll;
- state-priority rendering is represented;
- skeleton and empty states can be displayed manually.

### Phase 6 — Build static route pages — In progress

Create or modify:

- Home: `frontend/src/pages/index.astro`; **Product Card preview implemented; Trending/search remain**
- Movies: `frontend/src/pages/movies.astro`;
- TV Series: `frontend/src/pages/tv-series.astro`;
- Bookmarked: `frontend/src/pages/bookmarked.astro`;
- Login: `frontend/src/pages/login.astro`;
- Sign Up: `frontend/src/pages/signup.astro`;
- Profile placeholder: `frontend/src/pages/profile.astro`.
- Media detail placeholders: `frontend/src/pages/media/[id].astro`; **six static routes implemented**

Acceptance:

- all first-pass screens exist as Astro pages;
- each page uses the correct layout;
- each page shows correct search placeholder and section headings;
- content matches the intended page scope;
- no dedicated `search.astro` route is created initially.

### Phase 7 — Add live search enhancement

Create and wire `frontend/src/scripts/search.ts`.

Acceptance:

- search updates live;
- search matches title only;
- scope rules work;
- empty query restores default content;
- zero-result state shows `No results`;
- result-count updates are accessible but not noisy.

### Phase 8 — Add auth-required bookmark modal

Create and wire:

- `AuthRequiredModal.astro`;
- `frontend/src/scripts/auth-required-modal.ts`;
- modal trigger behavior in `bookmarks.ts`.

Acceptance:

- unauthenticated bookmark attempts open the modal;
- modal copy and actions match confirmed behavior;
- modal is keyboard accessible;
- focus is restored on close;
- bookmark state does not mutate while unauthenticated.

### Phase 9 — Add optional prototype bookmark persistence

Only after Phase 8 is stable, add localStorage bookmark persistence for a simulated authenticated state.

Acceptance:

- bookmark buttons can toggle only when a simulated authenticated state is active;
- state persists in browser storage;
- all item instances sync;
- Bookmarked page updates groups and empty states;
- unauthenticated behavior remains modal-first.

### Phase 10 — Build auth UI screens

Create and wire `AuthCard`, `FormField`, `PrimaryButton`, and `AuthLinkRow`.

Acceptance:

- Login UI matches design intent;
- Sign Up UI matches design intent;
- fields are accessible;
- error visual state is supported by components;
- no real validation/authentication is implied.

### Phase 11 — Add image loading/failure enhancement

Create and wire `frontend/src/scripts/media-images.ts` if native image events are not enough inside components.

Acceptance:

- skeleton appears before image load;
- successful image load shows thumbnail;
- failed image load shows fallback;
- card dimensions stay stable.

### Phase 12 — Responsive and visual QA pass

Validate against:

- Figma mobile reference;
- Figma tablet reference;
- Figma desktop reference;
- `DESIGN.md` token definitions;
- `SPEC.md` acceptance criteria.

Acceptance:

- layout matches visual intent closely;
- no unintended overflow;
- responsive navigation behavior is correct;
- grids and native trending rail behave correctly;
- modal behaves correctly at mobile and desktop sizes.

Product Card checkpoint completed:

- exact 2/3/4-column Product Card layouts verified at 375px, 768px, and 1440px;
- reference card and thumbnail dimensions match at each target viewport;
- no horizontal overflow occurs;
- production output selects the intended small/medium/large thumbnail source.

### Phase 13 — Accessibility QA pass

Validate keyboard, screen-reader labels, focus, reduced motion, touch targets, modal behavior, and automated a11y checks.

Acceptance:

- all interactive elements are keyboard reachable;
- focus is visible;
- icon-only controls are named;
- live search is accessible;
- modal is accessible;
- forms expose labels and supported error associations;
- reduced motion is respected.

Product Card checkpoint completed:

- Play and bookmark remain separate native controls with visible focus;
- bookmark controls expose title-specific names and `aria-pressed`;
- repeated cards use list/article/heading semantics;
- desktop keyboard focus reveals Play, while touch-only devices keep Play visible;
- bookmark hit targets are 44px and decorative thumbnails/icons are hidden appropriately from assistive technology.

### Phase 14 — Final review before implementation closure

Compare the finished implementation against:

- `DESIGN.md`;
- `SPEC.md`;
- this `PLAN.md`;
- remaining open questions.

Acceptance:

- all deviations are documented as intentional decisions;
- placeholder/starter drift is removed;
- unresolved future behavior is not accidentally implemented as final behavior.

---

## 13. Remaining assumptions

The following assumptions remain after the latest clarification:

1. [ASSUMPTION] The auth-required modal can use a minimal design-system-consistent visual treatment until a modal design exists in Figma.
2. [ASSUMPTION] A minimal dark image-failure fallback is acceptable until the final thumbnail failure state is designed.
3. [ASSUMPTION] Practical CSS breakpoints may differ from exact Figma reference widths if the required behavior is correct at mobile/tablet/desktop targets.
4. [ASSUMPTION] Any simulated authenticated bookmark state should be development/prototype behavior only and must not be presented as real auth.
