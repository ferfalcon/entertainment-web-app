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

The repository already contains project documentation and an Astro starter project inside `frontend/`. The implementation should adapt the existing scaffold rather than creating a second Astro app.

| Check | Current state | Planning impact |
|---|---|---|
| Repository | `ferfalcon/entertainment-web-app` exists and is public. | Continue targeting this repo. |
| Default branch | `main` is configured. | Normal branch-based workflow can be used. |
| Commit history | The repo has commits, including an initial Astro frontend scaffold. | Do **not** treat the repo as empty. |
| Root docs | `README.md`, `DESIGN.md`, and `SPEC.md` exist at the repo root. | Keep root docs as project documentation. Keep `PLAN.md` beside them. |
| Astro app location | The Astro app is inside `frontend/`. | All implementation paths in this plan are under `frontend/`. |
| Package manager | `frontend/package.json` exists. | Run install/dev/build from `frontend/` for now. |
| Astro version | `frontend/package.json` uses `astro: ^7.0.7`. | Keep Astro 7. Do not re-scaffold or downgrade. |
| Node baseline | `frontend/package.json` requires `node >=22.12.0`. | Use Node 22.12+ locally and in CI/deployment. |
| TypeScript | `frontend/tsconfig.json` extends `astro/tsconfigs/strict`. | Preserve strict TypeScript. |
| Current home page | `frontend/src/pages/index.astro` renders starter `Welcome`. | Replace with the Entertainment Web App Home composition. |
| Current layout | `frontend/src/layouts/Layout.astro` is starter-level and still says `Astro Basics`. | Refactor or replace with project layout files. |
| Current starter component | `frontend/src/components/Welcome.astro` is Astro demo UI. | Delete or replace; do not build the product on top of it. |
| Existing dev instructions | `frontend/AGENTS.md` says to use `astro dev --background`. | Follow this workflow when running the dev server. |
| Root workspace | No root pnpm workspace is needed now. | A root workspace will be introduced later. Do not add it in the first implementation pass. |

### Repository interpretation

The repo is now a usable Astro scaffold, but most frontend code is still starter/demo code. The next implementation step should **clean and reframe the existing `frontend/` app**, then add the Entertainment Web App UI system incrementally.

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
9. [OPEN QUESTION] Should `Play` point to a temporary placeholder media-detail route now, or should detail links remain documented but visually out of scope until detail designs exist?
10. [OPEN QUESTION] What exact URL should the logo link to? The logo is confirmed as a link; Home (`/`) is the planned default unless changed.

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

The implementation should build inside the existing `frontend/` Astro project.

```text
entertainment-web-app/
├── README.md                         [existing; update later if needed]
├── DESIGN.md                         [existing]
├── SPEC.md                           [existing]
├── PLAN.md                           [this file]
└── frontend/
    ├── AGENTS.md                     [existing]
    ├── README.md                     [modify later; replace starter README]
    ├── astro.config.mjs              [existing; keep minimal initially]
    ├── package.json                  [existing; modify only if scripts/deps change]
    ├── pnpm-lock.yaml                [existing]
    ├── tsconfig.json                 [existing; keep strict]
    ├── public/
    │   ├── favicon.svg               [existing]
    │   ├── favicon.ico               [existing]
    │   └── assets/
    │       ├── icons/
    │       ├── thumbnails/
    │       └── fonts/                [optional; see font strategy]
    └── src/
        ├── assets/                   [currently starter assets; remove/replace as needed]
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
        │   ├── overlays/
        │   │   └── AuthRequiredModal.astro
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
        │   ├── BaseLayout.astro
        │   ├── AppLayout.astro
        │   └── AuthLayout.astro
        ├── pages/
        │   ├── index.astro
        │   ├── movies.astro
        │   ├── tv-series.astro
        │   ├── bookmarked.astro
        │   ├── login.astro
        │   ├── signup.astro
        │   └── profile.astro
        ├── scripts/
        │   ├── auth-required-modal.ts
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
        │       ├── modal.css
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
- `frontend/src/scripts/` holds small progressive client-side behavior.
- `frontend/src/styles/` holds global tokens, reset, utilities, and component CSS.
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
| `frontend/package.json` | Keep / minor modify | Preserve Astro 7 setup; add scripts/dependencies only when needed. |
| `frontend/pnpm-lock.yaml` | Keep | Preserve dependency lockfile. |
| `frontend/astro.config.mjs` | Keep | Minimal config is acceptable initially. |
| `frontend/tsconfig.json` | Keep | Preserve strict Astro TypeScript config. |
| `frontend/AGENTS.md` | Keep | Follow existing background dev-server guidance. |
| `frontend/README.md` | Modify later | Replace starter Astro README with project-specific frontend README. |
| `frontend/src/pages/index.astro` | Modify | Replace starter `Welcome` page with Home page composition. |
| `frontend/src/layouts/Layout.astro` | Rename/refactor | Convert starter layout into `BaseLayout.astro` or replace with project layout files. |
| `frontend/src/components/Welcome.astro` | Delete/replace | Starter component should not remain in production UI. |
| `frontend/src/assets/astro.svg` | Delete if unused | Starter asset. |
| `frontend/src/assets/background.svg` | Delete if unused | Starter asset. |

### 5.3 Route pages to create or modify

| File | Action | Purpose |
|---|---|---|
| `frontend/src/pages/index.astro` | Modify | Home discovery page. |
| `frontend/src/pages/movies.astro` | Create | Movie catalog page. |
| `frontend/src/pages/tv-series.astro` | Create | TV Series catalog page. |
| `frontend/src/pages/bookmarked.astro` | Create | Bookmarked media page. |
| `frontend/src/pages/login.astro` | Create | Login UI screen. |
| `frontend/src/pages/signup.astro` | Create | Sign Up UI screen. |
| `frontend/src/pages/profile.astro` | Create | Placeholder profile page with `User profile` message. |
| `frontend/src/pages/search.astro` | Do not create initially | Search is confirmed as in-page live filtering for the first pass. |

[ASSUMPTION] If `Play` links need non-broken URLs before the detail page is designed, create a minimal placeholder detail route later. Otherwise, keep detail page work out of this pass.

### 5.4 Component files to create

| Component file | Purpose |
|---|---|
| `frontend/src/components/app/AppShell.astro` | Wrap app navigation and content layout. |
| `frontend/src/components/navigation/AppNav.astro` | Responsive navigation container. |
| `frontend/src/components/navigation/NavIconLink.astro` | Single icon-only navigation link with active state. |
| `frontend/src/components/navigation/ProfileLink.astro` | Avatar/profile link to the profile placeholder route. |
| `frontend/src/components/navigation/Logo.astro` | Logo mark as a link, planned default target `/`. |
| `frontend/src/components/search/SearchBar.astro` | Search UI and accessible search field. |
| `frontend/src/components/media/ContentSection.astro` | Section heading + state-priority rendering slot. |
| `frontend/src/components/media/MediaGrid.astro` | Regular responsive grid. |
| `frontend/src/components/media/MediaCard.astro` | Regular media card. |
| `frontend/src/components/media/TrendingRail.astro` | Native horizontal scrolling trending/highlighted section. |
| `frontend/src/components/media/MediaMeta.astro` | Year/category/rating metadata. |
| `frontend/src/components/media/BookmarkButton.astro` | Bookmark control. |
| `frontend/src/components/media/PlayOverlay.astro` | Detail-page play affordance/link. |
| `frontend/src/components/media/SkeletonCard.astro` | Loading placeholder. |
| `frontend/src/components/media/EmptyState.astro` | Lightweight `No results` empty-state message. |
| `frontend/src/components/overlays/AuthRequiredModal.astro` | Auth-required modal for unauthenticated bookmark attempts. |
| `frontend/src/components/auth/AuthCard.astro` | Shared auth form shell. |
| `frontend/src/components/auth/FormField.astro` | Form field with visual states and error association. |
| `frontend/src/components/ui/PrimaryButton.astro` | Primary CTA button. |
| `frontend/src/components/auth/AuthLinkRow.astro` | Login/Sign Up helper link row. |
| `frontend/src/components/ui/Icon.astro` | Shared icon rendering strategy. |
| `frontend/src/components/ui/VisuallyHidden.astro` | Reusable accessible-only text helper. |

### 5.5 Data, types, utilities, and scripts

| File | Purpose |
|---|---|
| `frontend/src/types/media.ts` | Media item, image asset, media category, and section types. |
| `frontend/src/types/navigation.ts` | Navigation item types. |
| `frontend/src/types/search.ts` | Search scope and search state types. |
| `frontend/src/types/auth.ts` | Auth form mode and field visual state types. |
| `frontend/src/data/media.ts` | Local normalized seed data. |
| `frontend/src/data/navigation.ts` | Navigation item definitions. |
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
        └── ContentSection / MediaGrid
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

#### `AppShell.astro`

Responsibilities:

- apply app-level layout class hooks;
- render navigation;
- provide content slot;
- expose landmarks through child layout structure;
- avoid owning data filtering or state mutation.

#### `AppNav.astro`

Responsibilities:

- render responsive nav structure;
- expose `aria-label="Primary"` or equivalent;
- pass active state to each `NavIconLink`;
- render profile/avatar link;
- render logo as a link, planned default `/`;
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

Recommended CSS files inside `frontend/src/styles/`:

1. `reset.css` — minimal modern reset.
2. `tokens.css` — color, typography, spacing, radius, z-index, motion, and breakpoint custom properties.
3. `global.css` — body, document defaults, font smoothing, base link/button behavior.
4. `utilities.css` — limited utilities such as `.visually-hidden`.
5. `components/*.css` — component and layout styling.

Avoid inline styles. Use CSS custom properties and classes.

### 7.2 Starter CSS cleanup

The current `Welcome.astro` contains starter/demo styles and content. Remove this file once it is no longer imported.

The current `Layout.astro` should be replaced or refactored into `BaseLayout.astro` with:

- correct project title;
- global stylesheet imports;
- favicon links;
- viewport meta;
- body class hooks;
- Outfit font loading strategy.

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
- Starter `Welcome` UI is removed from the rendered app.

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
- If a temporary detail route is created, it is clearly marked as placeholder content.

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

### Phase 1 — Clean and reframe the existing Astro starter

Modify the existing `frontend/` app instead of creating a second app.

Actions:

- keep `frontend/package.json`, `frontend/pnpm-lock.yaml`, `frontend/astro.config.mjs`, and `frontend/tsconfig.json`;
- replace `frontend/src/pages/index.astro` starter composition;
- replace or refactor `frontend/src/layouts/Layout.astro` into `BaseLayout.astro`;
- remove `frontend/src/components/Welcome.astro` when no longer used;
- remove unused starter assets after confirming they are not referenced;
- update project title from `Astro Basics` to `Entertainment Web App`.

Acceptance:

- starter welcome screen no longer appears;
- project still builds;
- root route renders a project-controlled layout placeholder;
- no duplicate Astro scaffold exists at repo root.

### Phase 2 — Add tokens and global styling foundation

Create under `frontend/src/styles/`:

- `reset.css`;
- `tokens.css`;
- `global.css`;
- `utilities.css`.

Define color, typography, spacing, radius, focus, modal, motion, and breakpoint custom properties.

Acceptance:

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

Acceptance:

- every media item can be validated against the normalized UI contract;
- invalid items are easy to detect before rendering;
- search scopes are represented in data/types;
- title-only filtering utility exists.

### Phase 4 — Build layouts and navigation

Create:

- `BaseLayout.astro`;
- `AppLayout.astro`;
- `AuthLayout.astro`;
- `AppNav.astro`;
- `NavIconLink.astro`;
- `Logo.astro`;
- `ProfileLink.astro`;
- `profile.astro` placeholder.

Acceptance:

- navigation displays in all viewports;
- active page state works;
- desktop/sidebar and tablet/mobile/top-nav behavior works;
- accessible names and `aria-current` are in place;
- logo links to the planned default Home route;
- profile link opens a `User profile` placeholder.

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

Acceptance:

- cards render static data;
- regular and trending cards are visually distinct;
- trending rail uses native horizontal scroll;
- card interactions are structurally separated;
- state-priority rendering is represented;
- skeleton and empty states can be displayed manually.

### Phase 6 — Build static route pages

Create or modify:

- Home: `frontend/src/pages/index.astro`;
- Movies: `frontend/src/pages/movies.astro`;
- TV Series: `frontend/src/pages/tv-series.astro`;
- Bookmarked: `frontend/src/pages/bookmarked.astro`;
- Login: `frontend/src/pages/login.astro`;
- Sign Up: `frontend/src/pages/signup.astro`;
- Profile placeholder: `frontend/src/pages/profile.astro`.

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

### Phase 14 — Final review before implementation closure

Compare the finished implementation against:

- `DESIGN.md`;
- `SPEC.md`;
- this `PLAN.md`;
- remaining open questions.

Acceptance:

- all deviations are documented as intentional decisions;
- starter-code drift is removed;
- unresolved future behavior is not accidentally implemented as final behavior.

---

## 13. Remaining assumptions

The following assumptions remain after the latest clarification:

1. [ASSUMPTION] The auth-required modal can use a minimal design-system-consistent visual treatment until a modal design exists in Figma.
2. [ASSUMPTION] The logo links to Home (`/`) unless a different link target is later specified.
3. [ASSUMPTION] If a media detail placeholder route is needed to avoid broken `Play` links, it can be minimal and explicitly marked as placeholder.
4. [ASSUMPTION] A minimal dark image-failure fallback is acceptable until the final thumbnail failure state is designed.
5. [ASSUMPTION] Practical CSS breakpoints may differ from exact Figma reference widths if the required behavior is correct at mobile/tablet/desktop targets.
6. [ASSUMPTION] Any simulated authenticated bookmark state should be development/prototype behavior only and must not be presented as real auth.
