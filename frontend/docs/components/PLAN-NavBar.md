# PLAN-NavBar.md — NavBar Component Implementation Plan

## Suggested branch name

```bash
feature/navbar-placeholder-pages
```

Alternative if you prefer more explicit naming:

```bash
feature/navbar-component-placeholder-pages
```

Recommended branch: **`feature/navbar-placeholder-pages`**.

---

## 1. Task scope

The next implementation task is to build the reusable **NavBar** component from the Figma `Components > NavBar` section and create the minimum placeholder pages required to verify it works across routes.

This is the first real UI component task. The goal is not to build the full app yet. The goal is to make the navigation shell real, reusable, responsive, accessible, and aligned with the Figma component.

### In scope

- `NavBar` component system.
- Navigation data model.
- Local icon strategy for the four primary nav icons.
- Logo link.
- Profile/avatar link.
- Responsive app shell layout.
- Placeholder pages for route testing.
- Active, enabled, hover, and focus states.
- Basic visual QA at mobile, tablet, and desktop widths.

### Out of scope

- Search bar.
- Media cards.
- Trending rail.
- Bookmark modal.
- Auth screens.
- Real profile page content.
- Real media detail pages.
- Data fetching.
- Root pnpm workspace.
- Tailwind or any new styling framework.

---

## 2. Source of truth

The source component is the Figma section:

```text
Components
└── NavBar
    ├── Navbar
    │   ├── Layout=Mobile
    │   ├── Layout=Tablet
    │   └── Layout=Desktop
    ├── Avatar
    ├── Logo
    ├── NavBar / Button
    │   ├── State=Enabled
    │   ├── State=Active
    │   └── State=Hovered
    └── Icon
        ├── Name=Bookmarked
        ├── Name=Movies
        ├── Name=TV Series
        └── Name=Home
```

Important Figma-derived behavior:

| State | Color intent |
|---|---|
| Enabled | Muted blue-gray / `Blue 500` |
| Active | White |
| Hovered | Red accent / `Red 500` |

Important implementation correction:

- The Figma `NavBar / Button` component **does include a distinct hover state**.
- Hover state should not be ignored.
- The docs may later need a follow-up update if they still imply nav hover has no distinct visual state.

---

## 3. Current repo assumptions

The implementation should continue from the existing Astro app under `frontend/`.

Confirmed baseline:

- Astro app lives in `frontend/`.
- Project uses Astro and plain CSS.
- `BaseLayout.astro` already exists.
- Global styles and tokens already exist.
- Outfit is already part of the frontend dependency setup.
- Commands should be run from `frontend/`.
- No root pnpm workspace should be introduced for this task.

[ASSUMPTION] The implementation should be done in the current `frontend/` app without re-scaffolding Astro.

[ASSUMPTION] The current placeholder `index.astro` can be replaced with an `AppLayout`-based Home placeholder.

---

## 4. Target routes for this task

Create or update these pages:

| Route | Page file | Purpose | Active nav item |
|---|---|---|---|
| `/` | `frontend/src/pages/index.astro` | Home placeholder | Home |
| `/movies` | `frontend/src/pages/movies.astro` | Movies placeholder | Movies |
| `/tv-series` | `frontend/src/pages/tv-series.astro` | TV Series placeholder | TV Series |
| `/bookmarked` | `frontend/src/pages/bookmarked.astro` | Bookmarked placeholder | Bookmarked |
| `/profile` | `frontend/src/pages/profile.astro` | Profile placeholder | None |

Placeholder content should be intentionally minimal:

```text
Home
Movies
TV Series
Bookmarked
User profile
```

The purpose of these pages is to validate navigation, routing, active state, and responsive layout. They are not final screen implementations.

---

## 5. Files to create

### Layout

```text
frontend/src/layouts/AppLayout.astro
```

### Navigation components

```text
frontend/src/components/navigation/AppNav.astro
frontend/src/components/navigation/NavIconLink.astro
frontend/src/components/navigation/Logo.astro
frontend/src/components/navigation/ProfileLink.astro
```

### UI components

```text
frontend/src/components/ui/Icon.astro
```

### Data

```text
frontend/src/data/navigation.ts
```

### Styles

```text
frontend/src/styles/components/app-shell.css
frontend/src/styles/components/navigation.css
```

### Placeholder pages

```text
frontend/src/pages/movies.astro
frontend/src/pages/tv-series.astro
frontend/src/pages/bookmarked.astro
frontend/src/pages/profile.astro
```

---

## 6. Files to modify

```text
frontend/src/pages/index.astro
frontend/src/styles/tokens.css
frontend/src/layouts/BaseLayout.astro
```

### `index.astro`

Replace the current generic placeholder with an `AppLayout`-based Home placeholder.

### `tokens.css`

Add only missing nav-specific tokens if needed.

Suggested additions:

```css
--radius-nav: 1.25rem;              /* 20px */
--size-nav-desktop-inline: 6rem;    /* 96px */
--size-nav-mobile-block: 3.625rem;  /* 58px */
--size-nav-tablet-block: 5.625rem;  /* 90px */
--size-avatar: 2.5rem;              /* 40px */
--size-nav-icon: 2rem;              /* 32px */
--size-logo-inline: 3rem;           /* 48px */
```

Do not over-tokenize every Figma measurement. Keep highly component-specific positioning values inside component CSS.

### `BaseLayout.astro`

Only modify if needed to import the new component CSS files globally.

Recommended import additions:

```astro
import '../styles/components/app-shell.css';
import '../styles/components/navigation.css';
```

[ASSUMPTION] For now, importing component CSS globally from `BaseLayout.astro` is acceptable because the project is small and this is the first UI system layer. If the project later grows, CSS organization can be revisited.

---

## 7. Files not to touch in this task

Avoid creating or modifying these unless a build error forces a small adjustment:

```text
frontend/src/components/auth/*
frontend/src/components/media/*
frontend/src/components/search/*
frontend/src/scripts/*
frontend/src/pages/login.astro
frontend/src/pages/signup.astro
```

Do not create:

```text
frontend/src/pages/search.astro
frontend/src/pages/[media].astro
frontend/src/pages/media/[id].astro
```

Media detail and search routes are out of scope.

---

## 8. Proposed component hierarchy

Target hierarchy for app pages:

```text
BaseLayout
└── AppLayout
    ├── AppNav
    │   ├── Logo
    │   ├── primary nav list
    │   │   ├── NavIconLink
    │   │   │   └── Icon
    │   │   ├── NavIconLink
    │   │   │   └── Icon
    │   │   ├── NavIconLink
    │   │   │   └── Icon
    │   │   └── NavIconLink
    │   │       └── Icon
    │   └── ProfileLink
    └── main
        └── placeholder page content
```

This keeps layout, navigation, route data, and icon rendering separated.

---

## 9. Navigation data model

Create `frontend/src/data/navigation.ts`.

Recommended type:

```ts
type NavItem = {
  id: 'home' | 'movies' | 'tv-series' | 'bookmarked';
  label: string;
  href: string;
  icon: 'home' | 'movies' | 'tv-series' | 'bookmarked';
};
```

Recommended data order:

```ts
export const primaryNavItems = [
  { id: 'home', label: 'Home', href: '/', icon: 'home' },
  { id: 'movies', label: 'Movies', href: '/movies', icon: 'movies' },
  { id: 'tv-series', label: 'TV Series', href: '/tv-series', icon: 'tv-series' },
  { id: 'bookmarked', label: 'Bookmarked', href: '/bookmarked', icon: 'bookmarked' },
] as const;
```

Do not use the standalone Figma icon catalogue order. The implementation order should be:

```text
Home → Movies → TV Series → Bookmarked
```

---

## 10. `AppLayout.astro` plan

Create `frontend/src/layouts/AppLayout.astro`.

Responsibilities:

- Import and wrap `BaseLayout`.
- Render `AppNav`.
- Render one `main` landmark.
- Accept page title props.
- Provide a consistent placeholder page shell.
- Own app-shell layout classes.

Suggested props:

```ts
interface Props {
  title: string;
  heading?: string;
}
```

Behavior:

- `title` is passed to `BaseLayout`.
- `heading` defaults to `title`.
- `main` uses `aria-labelledby="page-title"`.
- Pages can slot simple placeholder content below the heading.

Structure concept:

```astro
<BaseLayout title={title}>
  <div class="app-shell">
    <AppNav />
    <main class="app-shell__main" aria-labelledby="page-title">
      <h1 id="page-title" class="app-shell__title">{heading ?? title}</h1>
      <slot />
    </main>
  </div>
</BaseLayout>
```

---

## 11. `AppNav.astro` plan

Create `frontend/src/components/navigation/AppNav.astro`.

Responsibilities:

- Render the responsive navigation surface.
- Render logo link.
- Render primary nav list.
- Render profile/avatar link.
- Determine active primary route from `Astro.url.pathname`.
- Use semantic `<nav aria-label="Primary">`.

Route matching rules for this first pass:

| Path | Active item |
|---|---|
| `/` | Home |
| `/movies` | Movies |
| `/tv-series` | TV Series |
| `/bookmarked` | Bookmarked |
| `/profile` | None |

Use exact path matching. Do not implement nested route matching yet.

[ASSUMPTION] Exact path matching is enough until media detail routes or nested sections exist.

---

## 12. `NavIconLink.astro` plan

Create `frontend/src/components/navigation/NavIconLink.astro`.

Responsibilities:

- Render one icon-only nav link.
- Receive `href`, `label`, `icon`, and `isActive`.
- Set `aria-label`.
- Set `aria-current="page"` when active.
- Render `Icon` inside.
- Allow color to be controlled by `currentColor`.

Suggested props:

```ts
interface Props {
  href: string;
  label: string;
  icon: 'home' | 'movies' | 'tv-series' | 'bookmarked';
  isActive?: boolean;
}
```

HTML behavior:

```astro
<a
  class:list={['nav-icon-link', { 'is-active': isActive }]}
  href={href}
  aria-label={label}
  aria-current={isActive ? 'page' : undefined}
>
  <Icon name={icon} />
</a>
```

Do not implement hover with JavaScript. Hover belongs in CSS.

---

## 13. `Icon.astro` plan

Create `frontend/src/components/ui/Icon.astro`.

Responsibilities:

- Render the correct inline SVG for the requested icon.
- Use `currentColor` for fill/stroke.
- Hide decorative SVGs from assistive tech when the parent link already has an accessible label.
- Support only the four NavBar icons for this task.

Suggested props:

```ts
interface Props {
  name: 'home' | 'movies' | 'tv-series' | 'bookmarked';
  class?: string;
}
```

Implementation notes:

- Use inline SVG, not remote Figma asset URLs.
- Use `aria-hidden="true"` on the SVG.
- Use `focusable="false"` on the SVG.
- Use fixed visual size through CSS: `32px × 32px`.

[KEY IMPLEMENTATION RISK] Figma asset URLs are temporary and expire. Do not use them in the component.

---

## 14. `Logo.astro` plan

Create `frontend/src/components/navigation/Logo.astro`.

Responsibilities:

- Render the app logo as a link.
- Link to `/`.
- Use accessible label: `Entertainment Web App home`.
- Match Figma visual size: approximately `48px × 41.6px`.

Recommended implementation:

- Inline SVG if possible.
- Use `var(--color-accent)` or `currentColor` with the link color set to red.

Suggested props:

```ts
interface Props {
  href?: string;
}
```

Default:

```ts
href = '/'
```

---

## 15. `ProfileLink.astro` plan

Create `frontend/src/components/navigation/ProfileLink.astro`.

Responsibilities:

- Render avatar/profile link.
- Link to `/profile`.
- Accessible label: `User profile`.
- Visual size: `40px × 40px`.
- Circular avatar style.

Asset strategy:

1. Preferred: use a local avatar image exported from Figma.
2. Temporary acceptable fallback: render a circular placeholder using app colors.

For this task, a placeholder is acceptable if the asset is not yet present, but it should be isolated so replacing it with the real avatar is easy.

[ASSUMPTION] If no exported avatar asset exists locally, use a temporary CSS/avatar placeholder rather than blocking the NavBar implementation.

---

## 16. CSS implementation plan

Create:

```text
frontend/src/styles/components/navigation.css
frontend/src/styles/components/app-shell.css
```

### `navigation.css`

Owns:

- `.app-nav`
- `.app-nav__inner`
- `.app-nav__logo`
- `.app-nav__list`
- `.app-nav__item`
- `.nav-icon-link`
- `.profile-link`
- `.profile-link__avatar`

### `app-shell.css`

Owns:

- `.app-shell`
- `.app-shell__main`
- `.app-shell__title`
- `.app-shell__placeholder-text`

Do not put all styles inside `.astro` component `<style>` blocks for this task. Since the project already has global CSS imports in `BaseLayout`, component CSS files will keep the implementation easier to inspect and modify.

---

## 17. Responsive CSS plan

### Mobile target

Figma reference:

```text
Width: 375px
Nav height: 58px
Nav padding: 8px vertical / 16px horizontal
Icon gap: 8px
Background: #161D2F
Radius: 20px
```

Implementation:

- `AppLayout` flows vertically.
- Nav is horizontal at top.
- Logo left.
- Primary icon list centered.
- Profile link right.
- Main content appears below nav.
- Avoid global horizontal overflow.

### Tablet target

Figma reference:

```text
Width: 720px
Nav height: 90px
Nav padding: 24px
Icon gap: 32px
Background: #161D2F
Radius: 20px
```

Implementation:

- App shell gets page padding.
- Nav stretches across available content width.
- Nav remains horizontal.
- Main content appears below nav.

### Desktop target

Figma reference:

```text
Nav width: 96px
Nav height: 960px in the 1024px-high desktop frame
Top/left offset: 32px
Background: #161D2F
Radius: 20px
Vertical icon gap: 40px
```

Implementation:

- App shell becomes two-column layout.
- Nav becomes vertical sidebar.
- Sidebar width: `96px`.
- Sidebar height: `calc(100svh - 64px)`.
- App shell padding: `32px`.
- Main content starts to the right of nav.
- Desktop gap between nav and main: `36px`, derived from Figma desktop layout.

Keep `36px` local to `app-shell.css` with a comment, because it is Figma-derived and not currently part of the spacing scale.

---

## 18. Nav state CSS plan

State behavior:

| UI state | CSS behavior |
|---|---|
| Enabled | `color: var(--color-text-muted)` or `var(--color-blue-500)` |
| Active | `color: var(--color-text-primary)` or `var(--color-white)` |
| Hover | `color: var(--color-accent)` or `var(--color-red-500)` |
| Focus visible | visible outline + red icon color |

Recommended active + hover behavior:

```text
Active default → white
Active hover → red
Active focus-visible → red + outline
```

Reason:

- Figma defines red as hover state.
- `aria-current="page"` preserves current-route meaning even when the icon changes to red on hover.

---

## 19. Accessibility plan

Required semantics:

```html
<nav aria-label="Primary">
  <a aria-label="Entertainment Web App home" href="/">...</a>
  <ul>
    <li><a aria-label="Home" aria-current="page" href="/">...</a></li>
    <li><a aria-label="Movies" href="/movies">...</a></li>
    <li><a aria-label="TV Series" href="/tv-series">...</a></li>
    <li><a aria-label="Bookmarked" href="/bookmarked">...</a></li>
  </ul>
  <a aria-label="User profile" href="/profile">...</a>
</nav>
```

Keyboard order:

1. Logo.
2. Home.
3. Movies.
4. TV Series.
5. Bookmarked.
6. User profile.

Accessibility requirements:

- All nav items are real links.
- Icon-only links have accessible names.
- Active page uses `aria-current="page"`.
- SVG icons are decorative and `aria-hidden="true"`.
- Focus is visible on the dark nav surface.
- Touch targets should be at least `44px × 44px` where practical.
- Keyboard focus should get an equivalent or stronger visual treatment than hover.

---

## 20. Placeholder page structure

Each placeholder page should use `AppLayout`.

Example concept:

```astro
---
import AppLayout from '../layouts/AppLayout.astro';
---

<AppLayout title="Movies">
  <p class="app-shell__placeholder-text">Movies page placeholder.</p>
</AppLayout>
```

Suggested placeholder text:

| Page | Heading | Body |
|---|---|---|
| Home | `Home` | `Home page placeholder.` |
| Movies | `Movies` | `Movies page placeholder.` |
| TV Series | `TV Series` | `TV Series page placeholder.` |
| Bookmarked | `Bookmarked` | `Bookmarked page placeholder.` |
| Profile | `User profile` | `User profile placeholder.` |

---

## 21. Implementation sequence

### Step 1 — Create navigation data and icon system

Create:

```text
frontend/src/data/navigation.ts
frontend/src/components/ui/Icon.astro
```

Acceptance:

- Nav item data exists in the correct order.
- Icon component renders the four needed icons.
- Icons use `currentColor`.
- No remote Figma asset URLs are used.

---

### Step 2 — Create nav atoms

Create:

```text
frontend/src/components/navigation/Logo.astro
frontend/src/components/navigation/ProfileLink.astro
frontend/src/components/navigation/NavIconLink.astro
```

Acceptance:

- Logo links to `/`.
- Profile links to `/profile`.
- Nav links receive accessible labels.
- Active nav links can render `aria-current="page"`.

---

### Step 3 — Create `AppNav`

Create:

```text
frontend/src/components/navigation/AppNav.astro
frontend/src/styles/components/navigation.css
```

Acceptance:

- Nav renders logo, four primary links, and profile link.
- Active route is detected from `Astro.url.pathname`.
- Nav is semantic: `<nav aria-label="Primary">`.
- Basic horizontal mobile layout works.

---

### Step 4 — Create `AppLayout`

Create:

```text
frontend/src/layouts/AppLayout.astro
frontend/src/styles/components/app-shell.css
```

Modify if needed:

```text
frontend/src/layouts/BaseLayout.astro
```

Acceptance:

- App pages can render with NavBar plus main content.
- Main landmark exists.
- Placeholder heading is connected with `aria-labelledby`.
- Mobile/tablet/desktop shell structure exists.

---

### Step 5 — Replace Home placeholder

Modify:

```text
frontend/src/pages/index.astro
```

Acceptance:

- Home uses `AppLayout`.
- Home nav item is active at `/`.
- Old scaffold placeholder is gone.

---

### Step 6 — Add placeholder pages

Create:

```text
frontend/src/pages/movies.astro
frontend/src/pages/tv-series.astro
frontend/src/pages/bookmarked.astro
frontend/src/pages/profile.astro
```

Acceptance:

- All routes render without 404.
- Movies activates Movies.
- TV Series activates TV Series.
- Bookmarked activates Bookmarked.
- Profile activates no primary item.
- Profile shows `User profile`.

---

### Step 7 — Tune responsive layout

Modify:

```text
frontend/src/styles/components/navigation.css
frontend/src/styles/components/app-shell.css
frontend/src/styles/tokens.css
```

Acceptance:

- Mobile nav matches 58px height target.
- Tablet nav matches 90px height target.
- Desktop sidebar matches 96px width target.
- Desktop sidebar height uses viewport-based calculation.
- Icon gaps match Figma intent.
- No horizontal overflow.

---

### Step 8 — QA and cleanup

Run checks and clean up.

Acceptance:

- `pnpm build` passes from `frontend/`.
- No unused imports.
- No leftover scaffold placeholder styles.
- No Tailwind dependency added.
- No root workspace added.

---

## 22. Testing checklist

Run from:

```bash
cd frontend
```

### Build checks

```bash
pnpm install
pnpm build
```

Optional if configured:

```bash
pnpm astro check
```

### Route checks

Visit:

```text
/
/movies
/tv-series
/bookmarked
/profile
```

Confirm:

- Every route renders.
- NavBar appears on all placeholder app pages.
- Logo links to `/`.
- Profile avatar links to `/profile`.
- Primary active state is correct.
- `/profile` does not activate a primary nav item.

### Responsive checks

Test:

```text
375px
768px
1440px
```

Confirm:

- Mobile nav is horizontal and compact.
- Tablet nav is horizontal and taller.
- Desktop nav is vertical sidebar.
- Avatar sits near bottom on desktop.
- Main content starts to the right of desktop nav.
- No body-level horizontal scroll.

### State checks

Confirm:

- Enabled icons are muted blue-gray.
- Active icon is white.
- Hovered icon is red.
- Focus-visible is visible.
- Active + hover uses red icon while retaining `aria-current="page"`.

### Accessibility checks

Confirm:

- `<nav aria-label="Primary">` exists.
- Icon links have accessible names.
- Logo has accessible name.
- Profile has accessible name.
- Only the active primary route has `aria-current="page"`.
- Keyboard tab order is logical.
- Focus is visible on dark surface.
- SVG icons are decorative.

---

## 23. Key risks and mitigations

### Risk 1 — Figma asset URLs expire

Do not use remote Figma image URLs for icons or logo.

Mitigation:

- Use inline SVG or local assets.
- Use `currentColor` for nav icon coloring.

### Risk 2 — Desktop height gets hardcoded incorrectly

The Figma desktop NavBar is `960px` because the desktop frame is `1024px` tall with `32px` top and bottom offset.

Mitigation:

```css
block-size: calc(100svh - (var(--space-400) * 2));
```

### Risk 3 — Mobile NavBar is cramped

The mobile Figma bar fits logo, four icons, and avatar inside `375px × 58px`.

Mitigation:

- Keep mobile icon gap compact.
- Keep icon visual size at `32px`.
- Use touch target sizing carefully so it does not force layout overflow.

### Risk 4 — Active and hover states conflict

Figma defines active and hover separately, but not active+hover.

Mitigation:

- Use white for active default.
- Use red for hover, including active hover.
- Preserve active meaning with `aria-current="page"`.

### Risk 5 — Placeholder pages become accidental final pages

The placeholder pages are only there to verify NavBar behavior.

Mitigation:

- Keep placeholder content intentionally simple.
- Avoid adding page-specific layout or future component behavior.

### Risk 6 — CSS duplication

The project already has tokens, reset, global styles, and utilities.

Mitigation:

- Add only component CSS files.
- Avoid new resets or parallel token systems.
- Do not add Tailwind.

---

## 24. Definition of done

This task is complete when:

- `feature/navbar-placeholder-pages` branch exists.
- NavBar is implemented as reusable Astro components.
- Home, Movies, TV Series, Bookmarked, and Profile placeholder pages exist.
- NavBar appears on all placeholder app pages.
- Logo links to `/`.
- Avatar/profile links to `/profile`.
- Active primary nav state works.
- Enabled state uses Blue 500.
- Active state uses White.
- Hover state uses Red 500.
- Focus-visible state is visible.
- Desktop layout uses vertical sidebar.
- Tablet/mobile layout uses horizontal top bar.
- Component uses local SVG/assets, not expiring Figma URLs.
- No Tailwind dependency is added.
- No root workspace is added.
- `pnpm build` passes from `frontend/`.

---

## 25. Documentation follow-up after implementation

After implementation, update the docs if needed:

- `DESIGN.md`: ensure NavBar hover state is documented as Red 500.
- `SPEC.md`: ensure NavBar states include enabled, active, hover, and focus-visible.
- `PLAN.md`: mark NavBar implementation phase as completed or update the next implementation target.

