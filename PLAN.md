# PLAN.md — Entertainment Web App Astro Implementation Plan

## Scope

This document defines a practical, incremental implementation plan for building the Entertainment Web App as an Astro site.

It is based on:

- `DESIGN.md`;
- `SPEC.md`;
- the current GitHub repository state after re-checking the repo.

This document does **not** implement code. It does **not** define final backend behavior, database structure, production authentication, final API endpoints, or final route internals beyond what is necessary to plan the Astro UI.

The goal is to translate the current design and specification into a staged implementation path that can be executed safely without losing alignment with the visual system.

---

## 1. Current project structure assessment

Observed repository state:

| Check | Result | Planning impact |
|---|---|---|
| Repository | `ferfalcon/entertainment-web-app` exists and is public. | Continue targeting this repo. |
| Default branch | `main` is configured. | Normal branch-based workflow can now be used. |
| Commit history | Commits now exist. Latest visible commit adds an initial frontend structure with Astro starter files. | Do **not** treat the repo as uninitialized anymore. |
| Root docs | `README.md`, `DESIGN.md`, and `SPEC.md` exist at the repo root. | Keep root docs as project documentation; add `PLAN.md` beside them. |
| Astro location | Astro project exists under `frontend/`, not at the repo root. | All Astro implementation paths should be under `frontend/`. |
| Package manager | `frontend/package.json` exists and uses pnpm-compatible scripts. | Run install/dev/build commands from `frontend/` unless a root workspace is introduced later. |
| Astro version | `frontend/package.json` depends on `astro: ^7.0.7`. | Keep Astro 7; do not re-scaffold with another version unless intentionally upgrading. |
| Node requirement | `frontend/package.json` requires `node >=22.12.0`. | Development and CI should use Node 22.12+ to avoid version drift. |
| TypeScript config | `frontend/tsconfig.json` extends `astro/tsconfigs/strict`. | Preserve strict TypeScript as the project default. |
| Current page | `frontend/src/pages/index.astro` renders Astro starter `Welcome`. | Replace starter page with Entertainment Web App composition. |
| Current layout | `frontend/src/layouts/Layout.astro` is the starter layout and title is `Astro Basics`. | Replace or refactor into project `BaseLayout.astro`. |
| Current component | `frontend/src/components/Welcome.astro` is starter/demo content. | Delete or replace; do not build production UI on top of starter content. |
| Existing instructions | `frontend/AGENTS.md` says to use `astro dev --background`. | Follow this workflow when running the dev server. |
| Existing ignore file | `frontend/.gitignore` already ignores `dist/`, `.astro/`, `node_modules/`, logs, and environment files. | Reuse it; only adjust if project-level needs change. |

### Repository interpretation

The repo currently has a useful Astro shell, but it is still functionally a starter project. The implementation plan should therefore **adapt the existing `frontend/` scaffold**, not create a second Astro app at the root.

The next implementation work should remove starter/demo UI and replace it with the application structure defined in `DESIGN.md` and `SPEC.md`.

[ASSUMPTION] The `frontend/` directory is the intended app root for the Astro site.

[ASSUMPTION] Root-level `DESIGN.md`, `SPEC.md`, and `PLAN.md` should remain at the repository root rather than being duplicated inside `frontend/`.

[ASSUMPTION] No root `package.json` or workspace file should be introduced unless the project intentionally becomes a monorepo later. For now, keep package management inside `frontend/`.

[ASSUMPTION] The root `README.md` describes the project goals, while `frontend/README.md` is still Astro starter documentation and should be rewritten later.

---

## 2. Implementation goals

The implementation should produce a responsive Astro site that matches the current design intent and satisfies the product contract in `SPEC.md`.

Primary goals:

1. Replace the Astro starter screen with the Entertainment Web App UI.
2. Build the app shell and navigation system.
3. Build reusable media-card, grid, section, search, bookmark, and auth components.
4. Use the typography, color, and spacing tokens defined in `DESIGN.md`.
5. Support the known screens: Home, Search result state, Movies, TV Series, Bookmarked, Login, and Sign Up.
6. Implement responsive behavior for mobile, tablet, and desktop reference widths.
7. Implement accessible keyboard and screen-reader behavior.
8. Support live scoped search using local data.
9. Support bookmark UI persistence in a prototype-safe way until real authentication/back-end behavior is defined.
10. Keep unresolved product decisions clearly isolated behind assumptions or temporary behaviors.

---

## 3. Non-goals for this implementation plan

This plan does not cover:

- production backend authentication;
- database persistence;
- API design;
- server-side sessions;
- final media detail page design;
- final profile/account page design;
- final search algorithm beyond local scoped filtering;
- final carousel behavior beyond the agreed temporary horizontal scrolling baseline;
- deployment configuration;
- implementation code in this planning step.

---

## 4. Proposed project structure

The implementation should build inside the existing `frontend/` Astro project.

```text
entertainment-web-app/
├── README.md                         [existing; update later if needed]
├── DESIGN.md                         [existing]
├── SPEC.md                           [existing]
├── PLAN.md                           [this file]
└── frontend/
    ├── AGENTS.md                     [existing]
    ├── README.md                     [modify; replace starter README later]
    ├── astro.config.mjs              [existing; keep minimal initially]
    ├── package.json                  [existing; modify only if scripts/deps change]
    ├── pnpm-lock.yaml                [existing]
    ├── tsconfig.json                 [existing; keep strict]
    ├── public/
    │   ├── favicon.svg               [existing]
    │   ├── favicon.ico               [existing]
    │   └── assets/
    │       ├── icons/
    │       ├── images/
    │       └── fonts/                [optional; see font assumptions]
    └── src/
        ├── assets/                   [currently starter assets; replace as needed]
        ├── components/
        │   ├── app/
        │   │   ├── AppShell.astro
        │   │   └── PageHeader.astro
        │   ├── auth/
        │   │   ├── AuthCard.astro
        │   │   ├── AuthLinkRow.astro
        │   │   └── FormField.astro
        │   ├── media/
        │   │   ├── BookmarkButton.astro
        │   │   ├── ContentSection.astro
        │   │   ├── EmptyState.astro
        │   │   ├── MediaCard.astro
        │   │   ├── MediaGrid.astro
        │   │   ├── MediaMeta.astro
        │   │   ├── PlayOverlay.astro
        │   │   ├── SkeletonCard.astro
        │   │   └── TrendingRail.astro
        │   ├── navigation/
        │   │   ├── AppNav.astro
        │   │   ├── Logo.astro
        │   │   ├── NavIconLink.astro
        │   │   └── ProfileLink.astro
        │   ├── search/
        │   │   └── SearchBar.astro
        │   └── ui/
        │       ├── Icon.astro
        │       ├── PrimaryButton.astro
        │       └── VisuallyHidden.astro
        ├── data/
        │   ├── media.ts
        │   └── navigation.ts
        ├── layouts/
        │   ├── BaseLayout.astro      [replace/refactor current Layout.astro]
        │   ├── AppLayout.astro
        │   └── AuthLayout.astro
        ├── pages/
        │   ├── index.astro           [modify existing]
        │   ├── movies.astro
        │   ├── tv-series.astro
        │   ├── bookmarked.astro
        │   ├── login.astro
        │   ├── signup.astro
        │   └── search.astro          [optional; see search routing assumption]
        ├── scripts/
        │   ├── auth-forms.ts
        │   ├── bookmarks.ts
        │   ├── media-images.ts
        │   └── search.ts
        ├── styles/
        │   ├── reset.css
        │   ├── tokens.css
        │   ├── global.css
        │   ├── utilities.css
        │   └── components/
        │       ├── app-shell.css
        │       ├── auth.css
        │       ├── media.css
        │       ├── navigation.css
        │       └── search.css
        ├── types/
        │   ├── auth.ts
        │   ├── media.ts
        │   ├── navigation.ts
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
- `frontend/src/scripts/` holds progressive client-side behavior that cannot be handled by static Astro rendering alone.
- `frontend/src/styles/` holds global tokens, reset, utilities, and component CSS.

[KEY IMPLEMENTATION RISK] The project currently has a nested `frontend/` app. Future automation or deployment may assume commands run from the repo root. Mitigate by documenting command location clearly or adding root-level scripts only if needed.

---

## 5. Files to create, modify, or remove

### 5.1 Root files

| File | Action | Purpose |
|---|---|---|
| `README.md` | Modify later | Align naming/copy with Entertainment Web App once implementation stabilizes. |
| `DESIGN.md` | Keep | Visual and UX source of truth. |
| `SPEC.md` | Keep | Product/technical specification. |
| `PLAN.md` | Create/update | Implementation plan. |

Do not create a second root-level Astro project unless the repo is intentionally restructured.

### 5.2 Existing `frontend/` files

| File | Action | Purpose |
|---|---|---|
| `frontend/package.json` | Keep / minor modify | Preserve Astro 7 setup; add scripts/dependencies only when needed. |
| `frontend/pnpm-lock.yaml` | Keep | Preserve dependency lockfile. |
| `frontend/astro.config.mjs` | Keep | Minimal config is fine for the first pass. |
| `frontend/tsconfig.json` | Keep | Preserve strict Astro TypeScript config. |
| `frontend/AGENTS.md` | Keep | Follow existing background dev-server guidance. |
| `frontend/README.md` | Modify later | Replace starter Astro README with project-specific frontend README. |
| `frontend/src/pages/index.astro` | Modify | Replace starter Welcome page with Home page composition. |
| `frontend/src/layouts/Layout.astro` | Rename/refactor | Convert starter layout into `BaseLayout.astro` or replace with project layout files. |
| `frontend/src/components/Welcome.astro` | Delete/replace | Starter component should not remain in production UI. |
| `frontend/src/assets/astro.svg` | Delete if unused | Starter asset. |
| `frontend/src/assets/background.svg` | Delete if unused | Starter asset. |

### 5.3 Layout files to create

| File | Purpose |
|---|---|
| `frontend/src/layouts/BaseLayout.astro` | HTML shell, metadata, global styles, font loading. |
| `frontend/src/layouts/AppLayout.astro` | App pages with navigation, main landmark, and content slot. |
| `frontend/src/layouts/AuthLayout.astro` | Auth screens with logo and centered form card layout. |

### 5.4 Page files to create/modify

| File | Action | Purpose |
|---|---|---|
| `frontend/src/pages/index.astro` | Modify existing | Home discovery page. |
| `frontend/src/pages/movies.astro` | Create | Movie catalog page. |
| `frontend/src/pages/tv-series.astro` | Create | TV Series catalog page. |
| `frontend/src/pages/bookmarked.astro` | Create | Bookmarked media page. |
| `frontend/src/pages/login.astro` | Create | Login form screen. |
| `frontend/src/pages/signup.astro` | Create | Sign Up form screen. |
| `frontend/src/pages/search.astro` | Conditional | Dedicated search result page if route-based search is chosen. |

[ASSUMPTION] Start with page-local live search on each relevant page. Add `search.astro` only if the project chooses a dedicated search route after confirming the open question.

### 5.5 Component files to create

| Component file | Purpose |
|---|---|
| `frontend/src/components/app/AppShell.astro` | Wrap app navigation and content layout. |
| `frontend/src/components/navigation/AppNav.astro` | Responsive navigation container. |
| `frontend/src/components/navigation/NavIconLink.astro` | Single icon-only navigation link with active state. |
| `frontend/src/components/navigation/ProfileLink.astro` | Avatar/profile link. |
| `frontend/src/components/navigation/Logo.astro` | Logo mark; link behavior still TBD. |
| `frontend/src/components/search/SearchBar.astro` | Search UI and accessible search field. |
| `frontend/src/components/media/ContentSection.astro` | Section heading + state-priority rendering slot. |
| `frontend/src/components/media/MediaGrid.astro` | Regular responsive grid. |
| `frontend/src/components/media/MediaCard.astro` | Regular media card. |
| `frontend/src/components/media/TrendingRail.astro` | Horizontal trending/highlighted section. |
| `frontend/src/components/media/MediaMeta.astro` | Year/category/rating metadata. |
| `frontend/src/components/media/BookmarkButton.astro` | Bookmark control. |
| `frontend/src/components/media/PlayOverlay.astro` | Detail-page play affordance overlay/link. |
| `frontend/src/components/media/SkeletonCard.astro` | Loading placeholder. |
| `frontend/src/components/media/EmptyState.astro` | Lightweight empty-state message. |
| `frontend/src/components/auth/AuthCard.astro` | Shared auth form shell. |
| `frontend/src/components/auth/FormField.astro` | Form field with states and error association. |
| `frontend/src/components/ui/PrimaryButton.astro` | Primary CTA button. |
| `frontend/src/components/auth/AuthLinkRow.astro` | Login/Sign Up helper link row. |
| `frontend/src/components/ui/Icon.astro` | Shared icon rendering strategy. |
| `frontend/src/components/ui/VisuallyHidden.astro` | Reusable accessible-only text helper. |

### 5.6 Data, types, utilities, and scripts

| File | Purpose |
|---|---|
| `frontend/src/types/media.ts` | Media item, image asset, media category, and section types. |
| `frontend/src/types/navigation.ts` | Navigation item types. |
| `frontend/src/types/search.ts` | Search scope and search state types. |
| `frontend/src/types/auth.ts` | Auth form mode and field state types. |
| `frontend/src/data/media.ts` | Local normalized seed data. |
| `frontend/src/data/navigation.ts` | Navigation item definitions. |
| `frontend/src/utils/filterMedia.ts` | Scoped live-search filtering rules. |
| `frontend/src/utils/formatResultCount.ts` | Search result heading text. |
| `frontend/src/utils/groupBookmarked.ts` | Split saved items into movie and TV-series sections. |
| `frontend/src/utils/mediaGuards.ts` | Validate/normalize required media fields before rendering. |
| `frontend/src/utils/statePriority.ts` | Deterministic loading/error/empty/populated state priority. |
| `frontend/src/scripts/search.ts` | Live search behavior, scoped filtering, result-count updates, empty states. |
| `frontend/src/scripts/bookmarks.ts` | Prototype bookmark toggle, persistence, and UI synchronization. |
| `frontend/src/scripts/auth-forms.ts` | Client-side required-field and password-mismatch validation. |
| `frontend/src/scripts/media-images.ts` | Image loading/failure state transitions from skeleton to loaded/fallback. |

[ASSUMPTION] These scripts should be small and page-scoped. Avoid turning the whole Astro site into a single hydrated app unless future requirements demand it.

---

## 6. Proposed component structure

### 6.1 Page composition

Each app page should compose the same high-level pattern:

```text
BaseLayout
└── AppLayout
    ├── AppNav
    └── main content
        ├── SearchBar
        ├── ContentSection / TrendingRail
        └── ContentSection / MediaGrid
```

Auth pages should compose a separate pattern:

```text
BaseLayout
└── AuthLayout
    ├── Logo
    └── AuthCard
        ├── FormField(s)
        ├── PrimaryButton
        └── AuthLinkRow
```

This separation keeps dashboard pages and authentication pages visually consistent while avoiding unnecessary navigation on auth screens.

### 6.2 App-level components

#### `AppShell.astro`

Responsibilities:

- apply app-level layout class hooks;
- render navigation;
- provide content slot;
- expose app-level landmarks through child layout structure;
- avoid owning data filtering or state mutation.

#### `AppNav.astro`

Responsibilities:

- render responsive nav structure;
- expose `aria-label="Primary"` or equivalent;
- pass active state to each `NavIconLink`;
- render profile/avatar link;
- avoid direct knowledge of page content.

#### `SearchBar.astro`

Responsibilities:

- render the correct placeholder and label for the current scope;
- carry `data-search-scope` and similar hooks for progressive enhancement;
- render current query value when needed;
- avoid owning the final matching algorithm.

### 6.3 Media components

#### `ContentSection.astro`

State priority must be explicit:

1. loading;
2. error/failure;
3. empty;
4. populated.

The component should not allow contradictory states such as loading skeletons and populated cards at the same time.

#### `MediaGrid.astro`

Responsibilities:

- render regular cards in a responsive grid;
- maintain order from the data source;
- provide hooks for search filtering and bookmark updates;
- avoid sorting unless a later requirement defines sorting.

#### `MediaCard.astro`

Responsibilities:

- render an `article` or equivalent semantic container;
- render thumbnail area;
- render bookmark button as a separate control;
- render play/detail link as a separate control;
- render metadata and title;
- avoid wrapping the whole card in a link if it would create nested interactive controls.

[KEY IMPLEMENTATION RISK] Media cards have both bookmark and play actions. The implementation must avoid invalid nested links/buttons and ambiguous click targets.

#### `TrendingRail.astro`

Responsibilities:

- render highlighted/trending cards in a horizontal row;
- support overflow scrolling at smaller widths;
- preserve keyboard access to all cards;
- avoid hiding reachable content from keyboard users.

[ASSUMPTION] The first implementation should use native horizontal overflow with optional scroll snap. Do not implement custom carousel controls until the trending mechanics are confirmed.

### 6.4 Auth components

#### `AuthCard.astro`

Responsibilities:

- receive `mode = login | signup`;
- render title, fields, submit label, and helper link content based on mode;
- expose form-level validation hooks;
- keep visual states aligned with `DESIGN.md`.

#### `FormField.astro`

Responsibilities:

- render label and input association;
- support default, active, filled, and error states;
- render associated error text;
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

Recommended CSS layers/files inside `frontend/src/styles/`:

1. `reset.css` — minimal modern reset.
2. `tokens.css` — color, typography, spacing, radius, z-index, and breakpoint custom properties.
3. `global.css` — body, document defaults, font smoothing, base link/button behavior.
4. `utilities.css` — limited utilities such as `.visually-hidden`.
5. `components/*.css` — component and layout styling.

Avoid inline styles. Use CSS custom properties and classes.

[ASSUMPTION] Plain CSS is preferred over Tailwind for this project because the design already defines a compact custom token system and the goal is a precise Figma translation.

### 7.2 Existing starter CSS cleanup

The current `Welcome.astro` contains starter/demo component styles and uses the default Astro landing page structure. These styles should be removed with `Welcome.astro`, not adapted into the final UI.

The current `Layout.astro` contains only a minimal reset and starter title metadata. It should be replaced or refactored into a proper `BaseLayout.astro` with:

- correct project title;
- global stylesheet imports;
- favicon links;
- viewport meta;
- body class hooks;
- font loading strategy.

### 7.3 Design tokens

Create CSS custom properties for:

- colors:
  - `--color-white: #ffffff`;
  - `--color-black: #000000`;
  - `--color-blue-950: #10141e`;
  - `--color-blue-900: #161d2f`;
  - `--color-blue-500: #5a698f`;
  - `--color-red-500: #fc4747`;
- overlay colors:
  - transparent black;
  - black 50%/75% as needed for image overlays;
- spacing:
  - `0`, `8`, `16`, `24`, `32`, `40`, `56`, `72`, `80`;
- typography semantic tokens:
  - `type.section-title`;
  - `type.search-input`;
  - `type.featured-title`;
  - `type.featured-meta`;
  - `type.card-title`;
  - `type.card-meta`;
  - `type.form-title`;
  - `type.form-field`;
  - `type.form-error`;
  - `type.button-label`;
  - `type.auth-helper`;
  - `type.link-label`;
  - `type.empty-state`.

CSS should not use names like `Text Preset 1` or `Text Preset 2`.

### 7.4 Font strategy

Product UI must use Outfit only.

[ASSUMPTION] Use either a package-based font source or self-hosted font files. Do not rely on Plus Jakarta Sans for product UI. Any Plus Jakarta usage in the Figma style guide is documentation-only and should not be replicated in app UI.

[KEY IMPLEMENTATION RISK] Font loading can change visual measurements. Typography should be checked after the real font-loading approach is chosen.

### 7.5 Component styling conventions

Recommended conventions:

- Use predictable component class prefixes, for example:
  - `.app-shell`;
  - `.app-nav`;
  - `.search-bar`;
  - `.media-card`;
  - `.trending-rail`;
  - `.auth-card`.
- Use state classes or data attributes for visual states:
  - `[data-state="active"]`;
  - `[data-state="error"]`;
  - `[data-bookmarked="true"]`;
  - `[data-loading="true"]`.
- Use `:focus-visible` for focus treatment.
- Use `@media (prefers-reduced-motion: reduce)` to simplify transitions and remove shimmer/carousel motion.

---

## 8. Responsive implementation strategy

### 8.1 Reference widths

Design reference widths:

- mobile: `375px`;
- tablet: `768px`;
- desktop: `1440px`.

[ASSUMPTION] CSS breakpoints may use practical values around these references as long as the behavior matches the design. Start with:

- mobile-first default styles;
- tablet adjustments at `48rem` (`768px`);
- desktop sidebar layout at a larger breakpoint such as `64rem` or `75rem`, then validate at `1440px`.

[KEY IMPLEMENTATION RISK] The exact sidebar switch point is not explicitly designed. Switching too early may squeeze content; switching too late may leave desktop-like screens with tablet navigation.

### 8.2 App shell responsiveness

Mobile default:

- horizontal top navigation;
- `24px` approximate side padding;
- search below navigation;
- vertical content flow.

Tablet:

- horizontal top navigation;
- side padding around `24px–25px`;
- search below nav;
- medium content grid.

Desktop:

- vertical sidebar;
- sidebar approximately `96px` wide;
- outer offset around `32px`;
- main content begins to the right of the sidebar;
- wide content area with multi-column grids.

### 8.3 Media grid responsiveness

Plan grid behavior:

| Viewport | Grid behavior |
|---|---|
| Mobile | Two-column grid. |
| Tablet | Three-column grid, unless content width suggests otherwise. |
| Desktop | Four-column grid within main content. |

[ASSUMPTION] Four desktop columns are the safest starting point based on the observed card proportions and desktop content width. Validate against Figma screenshots after implementation.

Grid rules:

- Cards must not overflow their columns.
- Long titles should wrap or clamp without breaking card layout.
- Metadata should remain readable and not collide with title text.
- Empty, error, and skeleton states should occupy the same grid/section region.

### 8.4 Trending rail responsiveness

Initial plan:

- Use horizontal overflow for the trending/highlighted row.
- Preserve visible cards according to viewport width.
- Use scroll padding aligned with page padding.
- Optionally use CSS scroll snap if it does not introduce accessibility problems.
- Avoid custom carousel controls until the product decision is confirmed.

[OPEN QUESTION] Trending behavior remains unresolved: native scroll, snap scroll, carousel controls, or static clipped row.

### 8.5 Auth responsiveness

Rules:

- Auth pages use centered layout on desktop/tablet.
- Auth card width should match the visual design’s compact fixed-width card.
- Mobile auth card should use most of the viewport width with side margins.
- Form controls and submit button must keep comfortable touch targets.

---

## 9. Data and props implementation plan

### 9.1 Data source strategy

Use local static data for the first Astro implementation.

Recommended file:

```text
frontend/src/data/media.ts
```

This file should export normalized media items that satisfy the `SPEC.md` media contract.

[ASSUMPTION] Until a backend or external CMS exists, local data is the source of truth for media cards, search, trending, and bookmarked prototypes.

[KEY IMPLEMENTATION RISK] Earlier commits appear to have included static JSON/thumbnails, but the current usable Astro app still needs a clear `frontend/src/data/media.ts` source. Before manually recreating all data, check whether assets/data are already present in the working tree locally; if they exist, migrate them into the normalized data model instead of duplicating them.

### 9.2 Media item shape

Plan around the normalized UI data fields from `SPEC.md`:

| Field | Required for rendering | Notes |
|---|---:|---|
| `id` | Yes | Stable unique ID. If source data lacks ids, derive stable slugs from titles. |
| `title` | Yes | Display exactly as provided. |
| `year` | Yes | Display in metadata. |
| `category` | Yes | `Movie` or `TV Series`. |
| `rating` | Yes | Display as provided. |
| `thumbnail` | Yes | Regular card image path/object. |
| `trendingThumbnail` | Conditional | Required only for trending layout when different crop is needed. |
| `isBookmarked` | Normalized yes | Raw source may omit; normalize to false. |
| `isTrending` | Optional | Default false. |
| `detailHref` | Yes | Required by `Play` action. |

### 9.3 Image asset strategy

Two possible image strategies:

1. **Simple MVP strategy:** place image assets in `frontend/public/assets/images/` and reference them by path in local data.
2. **Optimized strategy:** place images in `frontend/src/assets/` and use Astro image processing once the asset list is stable.

Recommended first step: use the simple MVP strategy to keep data-driven rendering straightforward. Revisit optimization after the UI behavior is stable.

[KEY IMPLEMENTATION RISK] Public image paths are simpler but may miss Astro image optimization benefits. If performance becomes a requirement, migrate to an import map or Astro-processed image assets.

### 9.4 Search data strategy

Search should operate over normalized media data.

Initial matching behavior:

- trim query for matching;
- treat whitespace-only query as empty;
- use case-insensitive partial title matching;
- scope by page:
  - Home: all media;
  - Movies: movies only;
  - TV Series: TV series only;
  - Bookmarked: bookmarked items only.

[ASSUMPTION] Initial search should match titles only. Metadata-inclusive search, diacritic handling, and advanced ranking remain open questions.

### 9.5 Bookmark data strategy

Because production authentication is out of scope, use a prototype-safe bookmark state strategy:

- normalized media data provides initial `isBookmarked` values;
- client-side bookmark toggles are persisted in `localStorage` for the prototype;
- bookmark UI updates every visible instance of the same item;
- bookmarked page reads the same client-side bookmark state after hydration.

[ASSUMPTION] For the first Astro implementation, authentication and bookmarks are simulated on the client. Real authenticated persistence is deferred.

[KEY IMPLEMENTATION RISK] Server-rendered bookmarked content may briefly differ from client-side `localStorage` bookmark state. Mitigate by either accepting a small hydration update, marking prototype behavior clearly, or rendering Bookmarked sections from client state after initialization.

### 9.6 Auth data strategy

Auth screens should initially implement only client-side form validation for UI states:

- required email;
- required password;
- required repeat password on Sign Up;
- password mismatch on Sign Up.

[ASSUMPTION] Login/Sign Up submission does not create a real account until backend/auth requirements are defined.

[OPEN QUESTION] Exact validation rules and auth submission/loading/error behavior remain unresolved.

---

## 10. Accessibility implementation plan

### 10.1 Landmarks and page structure

- Use one clear `<main>` landmark per page.
- Use a labeled `<nav>` landmark for primary navigation.
- Place search inside a search landmark or equivalent labeled region.
- Keep heading order logical: page/section headings should not skip levels arbitrarily.

### 10.2 Navigation

- Icon-only nav links must have accessible names.
- Active route must use programmatic indication such as `aria-current="page"`.
- Logo behavior must be decided before final acceptance.
- Avatar/profile link must have an accessible name even if the visual destination is not designed yet.

[OPEN QUESTION] Should the logo act as a Home link or remain decorative/static?

### 10.3 Search

- Search input must have an accessible label independent of placeholder text.
- Live result count updates should use a polite announcement strategy.
- Avoid announcing every tiny DOM change from individual cards.
- Empty result message must be exposed as normal text.
- Long queries must not visually overflow the search input or result heading.

[KEY IMPLEMENTATION RISK] Live search can become noisy for screen readers if result updates are announced on every keystroke without restraint. Mitigate with a result-count-only polite live region and a small debounce if needed.

### 10.4 Media cards

- Use semantic grouping for each card.
- Use the visible title as the primary media label.
- Treat thumbnail images as decorative when the title is visible.
- Keep bookmark and play/detail actions as separate controls.
- Do not nest a button inside a link or a link inside a button.
- Ensure the play overlay/action appears on keyboard focus as well as hover.
- Ensure touch users can activate Play without relying only on hover.

### 10.5 Bookmark buttons

- Bookmark controls must have item-specific labels:
  - `Add {title} to bookmarks`;
  - `Remove {title} from bookmarks`.
- The bookmarked state should be exposed programmatically, for example through pressed/selected state semantics where appropriate.
- Logged-out bookmark behavior must not silently mutate state.

### 10.6 Forms

- Each field must have an associated label.
- Required fields must be communicated.
- Field-level errors must be associated with the relevant input.
- Password mismatch must be announced as a field-level error.
- Error styling must not rely on red color alone.
- Submit and auth-link interactions must be keyboard reachable.

### 10.7 Motion and reduced motion

- Use `prefers-reduced-motion` to reduce/remove:
  - thumbnail overlay transitions;
  - skeleton shimmer;
  - carousel/scroll animation;
  - page transitions if introduced later.

---

## 11. Interaction implementation plan

### 11.1 Live search

Implementation sequence:

1. Render all relevant cards statically from Astro/local data.
2. Add data attributes for search scope and searchable title.
3. Enhance with `search.ts` to filter visible cards on input.
4. Update section headings/result counts.
5. Show empty state when zero matches.
6. Preserve default page content when query is empty or whitespace-only.

[ASSUMPTION] Use client-side filtering for the first implementation instead of route navigation for every query.

### 11.2 Bookmarks

Implementation sequence:

1. Render initial bookmark state from normalized local data.
2. Add `data-media-id` and `data-bookmarked` hooks.
3. Enhance with `bookmarks.ts`.
4. Persist bookmark overrides in `localStorage`.
5. Sync every visible card instance of the same media item.
6. Update Bookmarked page sections after bookmark changes.

[OPEN QUESTION] Logged-out behavior is unresolved: hide bookmark controls, disable them, or route/prompt to login.

### 11.3 Play/detail links

Implementation sequence:

1. Require `detailHref` in normalized media data.
2. Render Play as a link or equivalent navigation control.
3. For now, link to a placeholder detail path only if the route is intentionally created.
4. If no detail page is created yet, keep the href contract documented and avoid dead UI in final acceptance.

[KEY IMPLEMENTATION RISK] `Play` is confirmed as navigation to a detail page, but the detail page is not visually designed. Avoid spending implementation time on the detail page until the design is provided or a placeholder decision is confirmed.

### 11.4 Auth forms

Implementation sequence:

1. Render Login and Sign Up forms visually.
2. Add client-side validation for required fields.
3. Add password mismatch validation on Sign Up.
4. Use field-level error states matching the component variants.
5. Do not implement real submission until backend/auth requirements are defined.

### 11.5 Image loading/failure

Implementation sequence:

1. Render skeleton placeholders before image load.
2. Mark card image as loaded when successful.
3. Replace skeleton with image.
4. On image error, replace skeleton with fallback state.
5. Preserve card dimensions in every state.

[OPEN QUESTION] Permanent thumbnail failure visual treatment is not final. Use a minimal dark fallback unless a richer design is provided.

---

## 12. Testing checklist

### 12.1 Build and basic project checks

Run from `frontend/`:

- `pnpm install` if dependencies are not installed;
- `pnpm build` for production build;
- `pnpm preview` for local production preview;
- `astro dev --background` when following the existing repo guidance.

Check:

- Astro project starts without errors.
- Build command completes successfully.
- TypeScript checks pass.
- No missing asset paths in the console.
- No unintended runtime errors from client scripts.
- Starter `Welcome` content no longer appears anywhere in the production UI.

### 12.2 Visual and responsive checks

Test these viewport widths:

- `375px` mobile;
- `768px` tablet;
- `1440px` desktop.

Check:

- desktop uses vertical sidebar;
- tablet/mobile use horizontal top nav;
- mobile media grid has two columns;
- tablet media grid uses medium grid;
- desktop media grid uses multi-column grid;
- trending content remains horizontal;
- no unintended body-level horizontal scroll;
- auth card remains centered and readable;
- long titles and long queries do not break layout;
- empty, loading, error, and populated states preserve section rhythm.

### 12.3 Component behavior checks

- Navigation active states match current page.
- Search placeholder changes by page context.
- Search filters correct scope.
- Empty query restores default content.
- Whitespace-only query behaves like empty query.
- Zero search results show empty state.
- Bookmark toggle updates all instances of the same item.
- Bookmarked page groups movies and TV series.
- Removing the last bookmark shows empty state.
- Hovering media card shows Play overlay.
- Keyboard focusing media card/play control exposes equivalent Play access.
- Image load success replaces skeleton.
- Image failure replaces skeleton with fallback.

### 12.4 Auth checks

- Login shows email and password fields.
- Sign Up shows email, password, repeat password fields.
- Empty required fields show error state.
- Sign Up password mismatch shows error state.
- Auth helper links navigate between Login and Sign Up.
- Submit button visual states match design.

### 12.5 Accessibility checks

Manual checks:

- Tab order is logical.
- All links/buttons/inputs are keyboard reachable.
- Focus indicators are visible on dark surfaces and image thumbnails.
- Icon-only controls have accessible names.
- Active nav item is programmatically indicated.
- Search input has a real accessible label.
- Live result updates are not excessively noisy.
- Bookmark button names include item titles.
- Form labels and errors are associated.
- Reduced-motion mode removes or simplifies motion.

Automated checks:

- Run an accessibility checker such as Lighthouse or axe after implementation.
- Verify color contrast for red text/errors, muted metadata, and focus indicators.

---

## 13. Key implementation risks and mitigations

### Risk 1 — Existing starter scaffold can cause drift

**Risk:** The current Astro app still contains starter components, starter metadata, starter README, and starter assets. If implementation builds around them, the app may keep irrelevant code and visual defaults.

**Mitigation:** Treat the starter only as a scaffold. Replace `Welcome.astro`, starter layout metadata, and starter README content as part of the first implementation phase.

### Risk 2 — Nested `frontend/` app may confuse commands/deployment

**Risk:** Developers or deployment tooling may run commands from the repo root, while the Astro app lives in `frontend/`.

**Mitigation:** Document `cd frontend` in README/PLAN. Add root scripts only if needed later. Keep all Astro paths in the plan prefixed with `frontend/`.

### Risk 3 — Figma assets may not be fully organized in the Astro app

**Risk:** The visual design depends heavily on thumbnails and icons. Missing or misplaced assets can block visual parity.

**Mitigation:** Audit existing asset folders locally before implementation. Migrate any existing JSON/thumbnails into `frontend/public/assets/` or `frontend/src/assets/`. Keep image dimensions stable and use placeholders only temporarily.

### Risk 4 — Bookmark behavior requires auth, but auth is not defined

**Risk:** The spec says bookmarking is authenticated, but backend auth is out of scope.

**Mitigation:** Use clearly marked prototype behavior with local client state. Do not imply production persistence. Keep real auth as a future integration point.

### Risk 5 — Search is live, but route behavior is unresolved

**Risk:** Search could be implemented as a route or an in-page state.

**Mitigation:** Start with in-page scoped filtering because it matches the live-search requirement with minimal complexity. Add route-based search only if confirmed.

### Risk 6 — Trending mechanics are unresolved

**Risk:** Custom carousel implementation may add complexity and accessibility problems.

**Mitigation:** Start with native horizontal overflow. Add carousel controls only after product confirmation.

### Risk 7 — Nested interactions in media cards

**Risk:** A full-card link plus nested bookmark button can create invalid or confusing interactions.

**Mitigation:** Keep play/detail and bookmark as separate controls. Do not wrap the entire card in a link.

### Risk 8 — Skeleton loading can become infinite

**Risk:** If image failure is not handled, the UI can show skeleton forever.

**Mitigation:** Add explicit image error handling and fallback state from the start.

### Risk 9 — Accessibility of hover/touch behavior

**Risk:** Play overlay is visually hover-based but must work for keyboard and touch.

**Mitigation:** Show overlay on focus-within. Ensure Play is always reachable by keyboard and usable on touch screens.

### Risk 10 — Data string length

**Risk:** Long titles, ratings, or queries can break grid or headings.

**Mitigation:** Add wrapping/clamping rules and test with deliberately long strings.

### Risk 11 — Font loading differences

**Risk:** Outfit loading strategy can shift layout and affect visual parity.

**Mitigation:** Choose the font strategy early, test with the actual font, and avoid fallback-only visual review.

---

## 14. Implementation sequence

### Phase 0 — Confirm unresolved decisions that affect architecture

Before implementation, confirm or consciously accept temporary assumptions for:

1. logged-out bookmark behavior;
2. whether `search.astro` is needed or search stays in-page;
3. whether the logo links to Home;
4. whether placeholder detail/profile routes should exist;
5. whether localStorage prototype behavior is acceptable for bookmarks/auth state.

This phase should be short. Do not block static UI replacement on every unresolved product detail.

### Phase 1 — Clean and reframe the existing Astro starter

Modify the existing `frontend/` app instead of creating a second app.

Actions:

- keep `frontend/package.json`, `frontend/pnpm-lock.yaml`, `frontend/astro.config.mjs`, and `frontend/tsconfig.json`;
- replace `frontend/src/pages/index.astro` starter composition;
- replace or refactor `frontend/src/layouts/Layout.astro` into `BaseLayout.astro`;
- remove `frontend/src/components/Welcome.astro` when no longer used;
- remove unused starter assets after confirming they are not referenced;
- update project title from `Astro Basics` to the Entertainment Web App title.

Acceptance for this phase:

- starter welcome screen no longer appears;
- project still builds;
- route root renders a project-controlled layout placeholder;
- no duplicate Astro scaffold exists at repo root.

### Phase 2 — Add tokens and global styling foundation

Create under `frontend/src/styles/`:

- `reset.css`;
- `tokens.css`;
- `global.css`;
- `utilities.css`.

Define color, typography, spacing, radius, focus, motion, and breakpoint custom properties.

Acceptance for this phase:

- dark background renders correctly;
- Outfit strategy is in place;
- base focus and reduced-motion rules exist;
- no final component layout yet.

### Phase 3 — Add typed local data and utilities

Create under `frontend/src/`:

- media types;
- navigation types;
- search/auth types;
- local media data;
- navigation data;
- pure utilities for filtering, grouping, formatting, and state priority.

Acceptance for this phase:

- every media item can be validated against the normalized UI contract;
- invalid items are easy to detect before rendering;
- search scopes are represented in data/types.

### Phase 4 — Build app shell and navigation

Create:

- `BaseLayout.astro`;
- `AppLayout.astro`;
- `AuthLayout.astro`;
- `AppNav.astro`;
- `NavIconLink.astro`;
- `Logo.astro`;
- `ProfileLink.astro`.

Acceptance for this phase:

- navigation displays in all viewports;
- active page state works;
- desktop/sidebar and tablet/mobile/top-nav behavior works;
- accessible names and `aria-current` are in place.

### Phase 5 — Build media display components

Create:

- `MediaCard.astro`;
- `MediaMeta.astro`;
- `BookmarkButton.astro`;
- `PlayOverlay.astro`;
- `MediaGrid.astro`;
- `TrendingRail.astro`;
- `ContentSection.astro`;
- `SkeletonCard.astro`;
- `EmptyState.astro`.

Acceptance for this phase:

- cards render static data;
- regular and trending cards are visually distinct;
- card interactions are structurally separated;
- state-priority rendering is represented;
- skeleton and empty states can be displayed manually.

### Phase 6 — Build static pages

Create or modify route pages:

- Home: `frontend/src/pages/index.astro`;
- Movies: `frontend/src/pages/movies.astro`;
- TV Series: `frontend/src/pages/tv-series.astro`;
- Bookmarked: `frontend/src/pages/bookmarked.astro`;
- Login: `frontend/src/pages/login.astro`;
- Sign Up: `frontend/src/pages/signup.astro`.

Acceptance for this phase:

- all designed screens exist as Astro pages;
- each page uses the correct layout;
- each page shows correct search placeholder and section headings;
- content matches the intended page scope.

### Phase 7 — Add live search enhancement

Create and wire `frontend/src/scripts/search.ts`.

Acceptance for this phase:

- search updates live;
- scope rules work;
- empty query restores default content;
- zero-result empty state appears;
- result-count updates are accessible but not noisy.

### Phase 8 — Add bookmark enhancement

Create and wire `frontend/src/scripts/bookmarks.ts`.

Acceptance for this phase:

- bookmark buttons toggle state in the prototype;
- state persists in browser storage;
- all item instances sync;
- Bookmarked page updates groups and empty states;
- unauthenticated behavior is clearly handled according to the temporary decision.

### Phase 9 — Add auth form enhancement

Create and wire `frontend/src/scripts/auth-forms.ts`.

Acceptance for this phase:

- required-field validation works;
- password mismatch validation works;
- field-level error states match the design;
- auth links work;
- no real backend behavior is implied.

### Phase 10 — Add image loading/failure enhancement

Create and wire `frontend/src/scripts/media-images.ts` if native image events are not enough inside components.

Acceptance for this phase:

- skeleton appears before image load;
- successful image load shows thumbnail;
- failed image load shows fallback;
- card dimensions stay stable.

### Phase 11 — Responsive and visual QA pass

Validate against:

- Figma mobile reference;
- Figma tablet reference;
- Figma desktop reference;
- `DESIGN.md` token definitions;
- `SPEC.md` acceptance criteria.

Acceptance for this phase:

- layout matches visual intent closely;
- no unintended overflow;
- responsive navigation behavior is correct;
- grids and trending rail behave correctly.

### Phase 12 — Accessibility QA pass

Validate keyboard, screen-reader labels, focus, reduced motion, touch targets, and automated a11y checks.

Acceptance for this phase:

- all interactive elements are keyboard reachable;
- focus is visible;
- icon-only controls are named;
- live search is accessible;
- forms expose labels and errors;
- reduced motion is respected.

### Phase 13 — Final review before implementation closure

Compare the finished implementation against:

- `DESIGN.md`;
- `SPEC.md`;
- this `PLAN.md`;
- unresolved open questions.

Document any deviations as intentional decisions, not accidental drift.

---

## 15. Assumptions

1. [ASSUMPTION] The existing `frontend/` directory is the intended Astro app root.
2. [ASSUMPTION] Commands should run from `frontend/` unless a root workspace is added later.
3. [ASSUMPTION] Astro 7.0.7 and Node `>=22.12.0` remain the current baseline.
4. [ASSUMPTION] Root `DESIGN.md`, `SPEC.md`, and `PLAN.md` remain the primary documentation files.
5. [ASSUMPTION] `frontend/README.md` is starter content and should be rewritten later.
6. [ASSUMPTION] Astro components plus small client-side TypeScript modules are sufficient for the first implementation.
7. [ASSUMPTION] No React/Vue/Svelte island is required initially.
8. [ASSUMPTION] Local static media data is acceptable until a backend or CMS exists.
9. [ASSUMPTION] Bookmark persistence can be prototyped with `localStorage` until real authentication/persistence is defined.
10. [ASSUMPTION] Auth forms initially validate UI states only and do not perform real authentication.
11. [ASSUMPTION] Search initially filters by title only, using trimmed, case-insensitive partial matching.
12. [ASSUMPTION] Search result presentation starts as in-page filtering unless a dedicated search route is confirmed.
13. [ASSUMPTION] Trending starts as native horizontal overflow, not a custom carousel.
14. [ASSUMPTION] A minimal dark image-failure fallback is acceptable until the permanent thumbnail failure design is confirmed.
15. [ASSUMPTION] Four desktop media-grid columns, three tablet columns, and two mobile columns are the initial implementation targets and should be visually validated against Figma.
16. [ASSUMPTION] The exact desktop sidebar switch breakpoint can be tuned during implementation while preserving the required behavior at `1440px`.

---

## 16. Open questions

These questions remain unresolved and should be confirmed before or during early implementation:

1. What is the exact trending behavior: native horizontal scroll, snap scroll, carousel controls, or static clipped row?
2. What are the exact validation rules for Login and Sign Up forms?
3. What should the auth loading state look like?
4. What should the auth submission error state look like?
5. What is the exact empty-state copy for search, bookmarked content, and empty sections?
6. What should the permanent thumbnail failure state look like?
7. What is the destination and visual design for the avatar/profile link?
8. What is the visual design for the media detail page opened from `Play`?
9. What are the exact search matching rules: title-only or broader metadata search, case handling, partial matching, and diacritic handling?
10. For unauthenticated users, should bookmark controls be hidden, disabled, or redirect/prompt login?
11. What should happen if an unauthenticated user opens the Bookmarked page?
12. Should the logo act as a Home link or remain decorative/static?
13. Should there be a section-level content error state for failed media data loading, or only thumbnail-level failure states?
14. Should placeholder detail/profile routes be created now, or should those links remain documented but unresolved until designs exist?
15. Should the project remain a nested `frontend/` app, or should a root pnpm workspace be introduced later?

---

## 17. Planning summary

The safest implementation path is now to adapt the existing `frontend/` Astro starter rather than create a new scaffold. The first implementation task should remove starter/demo UI and establish the project foundation: tokens, layouts, navigation, data contracts, and route composition.

The plan intentionally keeps the first implementation mostly static and component-driven, using small client-side scripts only where the current product behavior requires interactivity: live search, bookmark persistence, auth form validation, and image load/failure transitions.

The biggest risks are not the visual layout itself. The biggest risks are unresolved behavior decisions and starter-code drift: authenticated bookmarks without real auth, search routing versus in-page filtering, trending mechanics, future detail/profile destinations, permanent image failure treatment, and the nested `frontend/` project structure.
