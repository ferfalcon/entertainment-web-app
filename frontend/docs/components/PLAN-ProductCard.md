# PLAN-ProductCard.md — Product Card Implementation Plan

## Suggested branch name

```bash
feature/product-card-component
```

## Purpose

Implement the regular grid **Product Card** component for the Entertainment Web App.

This task turns the Figma `Components > Product Card` section into reusable Astro components that can render real media-card data inside the existing app shell.

The Product Card is the reusable card pattern used in regular grids across Home, Movies, TV Series, Search results, and Bookmarked sections. It is **not** the large Trending card.

---

## Source references

This plan is based on:

- the Figma page `enter`;
- the Figma section `Components > Product Card`;
- the existing Astro frontend in `frontend/`;
- the existing NavBar implementation and app shell;
- the current design token system in `frontend/src/styles/tokens.css`;
- the previously confirmed product decisions:
  - Play is a link;
  - media detail page is still out of scope;
  - bookmark mutation requires authentication later;
  - unauthenticated bookmark behavior/modal is not part of this task;
  - local static data is acceptable for now;
  - no Tailwind should be added.

---

## Figma component summary

Relevant Figma structure:

```text
Components
└── Product Card
    ├── Product Card
    │   ├── Property 1=Default
    │   └── Property 1=Hovered
    ├── Media
    │   ├── Media=Default
    │   ├── Media=Variant2
    │   ├── Media=Variant3
    │   └── Media=Variant4
    ├── Bookmark Icon
    │   ├── State=Unselected
    │   └── State=Selected
    ├── Product Type
    │   ├── Type=Movie
    │   └── Type=TV
    ├── Play Button
    └── Oval separator
```

Default desktop Product Card reference:

```text
Card:      280 × 229
Thumbnail: 280 × 174
Gap below thumbnail: 8px
Bookmark: 32 × 32
Bookmark position: top 12px, right 12px
Metadata/title gap: 8px
```

Responsive usage from page examples:

| Viewport | Card width | Thumbnail size | Grid behavior |
|---|---:|---:|---|
| Mobile | 164px | 164 × 110 | 2 columns |
| Tablet | 220px | 220 × 140 | 3 columns |
| Desktop | 280px | 280 × 174 | 4 columns |

Important interpretation:

The standalone component shows the desktop/default size, but the real app uses the same card pattern responsively. Do **not** hardcode the component to `280px` only.

---

## Scope

### In scope

- Product Card component.
- Product metadata row.
- Product type icon and label.
- Bookmark button visual selected/unselected state.
- Play overlay hover/focus state.
- Responsive Product Card sizing.
- A small local media data set.
- A simple preview grid on the Home page.
- Local thumbnail assets.

### Out of scope

- Search behavior.
- Full Movies page implementation.
- Full TV Series page implementation.
- Full Bookmarked page implementation.
- Real bookmark persistence.
- Auth-required modal behavior.
- Real authentication.
- Real media detail page design.
- Trending cards.
- Skeleton loading.
- Final permanent image-failure design.
- API/backend integration.

---

## Existing repo constraints

The current repo already has:

- Astro app inside `frontend/`;
- `AppLayout.astro` and `BaseLayout.astro`;
- a working NavBar;
- placeholder app pages;
- global styles and design tokens;
- `@fontsource/outfit`;
- plain CSS component styling.

The Product Card implementation must follow that existing direction:

- Astro components, not React components.
- Plain CSS, not Tailwind.
- Existing design tokens, not a parallel token system.
- Local assets, not temporary Figma asset URLs.
- Keep NavBar working after any shared icon refactor.

---

## Files to create

```text
frontend/src/components/media/ProductCard.astro
frontend/src/components/media/ProductMeta.astro
frontend/src/components/media/BookmarkButton.astro
frontend/src/components/media/PlayOverlay.astro
frontend/src/components/media/ProductCardGrid.astro

frontend/src/types/media.ts
frontend/src/types/icon.ts

frontend/src/data/media.ts

frontend/src/styles/components/media.css

frontend/src/assets/media/
```

Optional if we want Play links to avoid 404s during QA:

```text
frontend/src/pages/media/[id].astro
```

---

## Files to modify

```text
frontend/src/pages/index.astro
frontend/src/layouts/BaseLayout.astro
frontend/src/components/ui/Icon.astro
frontend/src/components/navigation/NavIconLink.astro
frontend/src/data/navigation.ts
frontend/src/styles/tokens.css
```

### Modification notes

`index.astro` currently provides a safe preview surface. Replace the Home placeholder content with a Product Card preview section.

`BaseLayout.astro` should import the new component CSS file:

```ts
import '../styles/components/media.css';
```

`Icon.astro` currently supports NavBar icons only. Product Card needs additional icons for Movie, TV Series, bookmark states, and Play. Refactor carefully so NavBar does not regress.

`tokens.css` already includes colors, typography, radius, overlay color, motion, and focus tokens. Add only missing Product Card sizing tokens if they materially improve clarity.

---

## Component architecture

Recommended component hierarchy:

```text
ProductCard.astro
├── thumbnail region
│   ├── image
│   ├── PlayOverlay.astro
│   └── BookmarkButton.astro
└── content region
    ├── ProductMeta.astro
    └── title
```

Recommended rendered structure:

```html
<article class="product-card">
  <div class="product-card__media">
    <img class="product-card__image" alt="" />
    <PlayOverlay />
    <BookmarkButton />
  </div>

  <div class="product-card__content">
    <ProductMeta />
    <h2 class="product-card__title">The Great Lands</h2>
  </div>
</article>
```

Do **not** make the entire card a link. The card contains two interactive controls: Play and Bookmark. Wrapping the whole card in a link would create nested interactive-control problems.

---

## Data model

Create:

```text
frontend/src/types/media.ts
```

Recommended contract:

```ts
export type MediaCategory = 'Movie' | 'TV Series';

export interface MediaItem {
  id: string;
  title: string;
  year: string | number;
  category: MediaCategory;
  rating: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  isBookmarked: boolean;
  detailHref: string;
}
```

### Required fields

- `id`
- `title`
- `year`
- `category`
- `rating`
- `thumbnailSrc`
- `isBookmarked`
- `detailHref`

### Optional fields

- `thumbnailAlt`

For most cards, `thumbnailAlt` can be empty because the visible title already identifies the item. If the image communicates unique information not repeated in text, provide meaningful alt text.

---

## Sample data

Create:

```text
frontend/src/data/media.ts
```

Include at least six sample items so the component can be tested in a small grid.

The preview set should include:

- at least one Movie;
- at least one TV Series;
- selected and unselected bookmark states;
- ratings such as `E`, `PG`, and `18+`;
- at least one longer title;
- local thumbnail images.

Suggested titles from Figma/page examples:

```text
The Great Lands
The Diary
No Land Beyond
Earth’s Untouched
Autosport the Series
During the Hunt
```

Use local images under:

```text
frontend/src/assets/media/
```

Do not use temporary Figma asset URLs in source code.

---

## Icon strategy

Product Card needs icons for:

- Movie;
- TV Series;
- bookmark outline;
- bookmark filled;
- Play.

The existing `Icon.astro` was originally created for NavBar. Refactor it into a reusable icon component before adding Product Card icons.

Create:

```text
frontend/src/types/icon.ts
```

Recommended shared type:

```ts
export type IconName =
  | 'home'
  | 'movies'
  | 'tv-series'
  | 'bookmarked'
  | 'movie'
  | 'tv'
  | 'bookmark-outline'
  | 'bookmark-filled'
  | 'play';
```

Update:

```text
frontend/src/components/ui/Icon.astro
frontend/src/components/navigation/NavIconLink.astro
frontend/src/data/navigation.ts
```

The key refactor:

- `Icon.astro` should not hardcode `nav-icon` as its internal class.
- It should emit a generic `icon` class plus any passed class.
- NavBar should pass `class="nav-icon"`.
- Product Card should pass component-specific classes such as `product-card__type-icon` or `product-card__play-icon`.

This prevents Product Card icons from inheriting NavBar-specific `32px` sizing.

---

## ProductCard.astro responsibilities

`ProductCard.astro` should:

- receive a `MediaItem` or equivalent props;
- render a semantic `article`;
- render a thumbnail image;
- render `PlayOverlay` inside the thumbnail region;
- render `BookmarkButton` inside the thumbnail region;
- render metadata via `ProductMeta`;
- render the title;
- avoid owning bookmark mutation behavior;
- avoid owning real navigation behavior beyond the `detailHref` link;
- avoid using Figma asset URLs.

Recommended props:

```ts
interface Props {
  item: MediaItem;
  headingLevel?: 'h2' | 'h3';
}
```

`headingLevel` is optional, but useful because cards may appear under different section headings later. For this first preview grid, `h3` is probably appropriate inside a section with an `h2`.

[ASSUMPTION] If dynamic heading-level rendering feels too heavy for this first pass, use a paragraph or `h3` consistently and revisit when full content sections are implemented.

---

## ProductMeta.astro responsibilities

`ProductMeta.astro` should render:

```text
year · category · rating
```

It should:

- accept `year`, `category`, and `rating`;
- map category to the correct icon;
- display `Movie` or `TV Series`;
- render dot separators as CSS circles, not image assets;
- keep metadata order stable;
- use `type.card-meta` tokens.

Recommended props:

```ts
interface Props {
  year: string | number;
  category: 'Movie' | 'TV Series';
  rating: string;
}
```

Visual details:

- metadata gap: `8px`;
- desktop/tablet dot: `3px`;
- compact mobile dot can visually scale to `2px` if needed;
- category icon: `12px` desktop/tablet, `10px` mobile if needed for Figma parity;
- metadata color: white with reduced opacity.

---

## BookmarkButton.astro responsibilities

`BookmarkButton.astro` should:

- render a real `<button type="button">`;
- accept `isBookmarked`, `title`, and `id`;
- use `aria-pressed`;
- expose correct accessible labels;
- render selected/unselected visual states;
- include data hooks for future behavior;
- not mutate state in this task.

Recommended props:

```ts
interface Props {
  mediaId: string;
  title: string;
  isBookmarked: boolean;
}
```

Accessible labels:

```text
Add {title} to bookmarks
Remove {title} from bookmarks
```

Recommended data hooks:

```html
<button
  type="button"
  class="product-card__bookmark"
  aria-pressed="false"
  data-media-id="..."
  data-bookmark-trigger
>
```

Current task behavior:

- selected/unselected visual state comes from props;
- no click mutation;
- no auth modal yet.

---

## PlayOverlay.astro responsibilities

`PlayOverlay.astro` should:

- render a real link;
- use `href={detailHref}`;
- visually show the Figma Play pill;
- be visible on hover and focus-within through CSS;
- use visible text `Play`;
- use accessible label `View details for {title}`.

Recommended props:

```ts
interface Props {
  href: string;
  title: string;
}
```

Visual details:

```text
Pill width: 117px
Pill height: 48px
Pill radius: 100px
Pill background: white / 25% opacity
Play icon: 30 × 30
Gap icon/text: 16px
Text: type.card-title / Outfit Medium / 18px
```

[OPEN QUESTION] Should this task create a temporary `/media/[id]` placeholder route so Play links do not 404?

Recommendation: create the placeholder route only if QA requires clickable Play links to land somewhere. Otherwise, keep `detailHref` ready and document that media detail pages remain out of scope.

---

## ProductCardGrid.astro responsibilities

`ProductCardGrid.astro` is a temporary but useful preview/grid component.

It should:

- receive `items: MediaItem[]`;
- render a list of `ProductCard` components;
- enforce the responsive grid rules from Figma;
- not own section heading semantics unless we intentionally make it a full section component later.

Recommended props:

```ts
interface Props {
  items: MediaItem[];
}
```

Grid targets:

```text
Mobile:  2 columns, 164px cards, 15px column gap
Tablet:  3 columns, 220px cards, 30px column gap
Desktop: 4 columns, 280px cards, 40px column gap
```

Desktop width math:

```text
4 × 280 + 3 × 40 = 1240px
```

This matches the Figma desktop page examples.

---

## CSS plan

Create:

```text
frontend/src/styles/components/media.css
```

Import it from `BaseLayout.astro`.

### Product Card CSS responsibilities

`media.css` should define:

- preview section layout;
- Product Card grid layout;
- Product Card root;
- thumbnail region;
- image styling;
- overlay show/hide behavior;
- Play pill;
- bookmark button;
- metadata row;
- title typography;
- responsive sizing.

### Recommended token additions

Modify `tokens.css` only if useful:

```css
--size-product-card-mobile-inline: 10.25rem;   /* 164px */
--size-product-card-tablet-inline: 13.75rem;   /* 220px */
--size-product-card-desktop-inline: 17.5rem;   /* 280px */

--size-product-media-mobile-block: 6.875rem;   /* 110px */
--size-product-media-tablet-block: 8.75rem;    /* 140px */
--size-product-media-desktop-block: 10.875rem; /* 174px */

--size-product-bookmark: 2rem;                 /* 32px */
--size-product-meta-icon: 0.75rem;             /* 12px */
--size-product-meta-dot: 0.1875rem;            /* 3px */
```

[ASSUMPTION] These sizing tokens are acceptable because the Product Card has repeated, documented breakpoint dimensions. If this feels too specific for global tokens, keep them as component-level CSS custom properties inside `.product-card-grid` / `.product-card`.

### Responsive sizing

Use breakpoint-specific thumbnail heights:

```text
Mobile:  110px
Tablet:  140px
Desktop: 174px
```

This is more faithful to Figma than a single aspect ratio because the observed viewport ratios differ slightly.

### Hover/focus overlay

The overlay should be hidden by default and shown on:

```css
.product-card__media:hover .product-card__play,
.product-card__media:focus-within .product-card__play {
  opacity: 1;
}
```

Also show the dark overlay at the same time.

Use motion tokens and respect reduced motion.

---

## Page integration

Modify:

```text
frontend/src/pages/index.astro
```

Replace the current Home placeholder paragraph with a preview section:

```astro
---
import ProductCardGrid from '../components/media/ProductCardGrid.astro';
import { previewMediaItems } from '../data/media';
import AppLayout from '../layouts/AppLayout.astro';
---

<AppLayout title="Home">
  <section class="product-preview" aria-labelledby="recommended-heading">
    <h2 id="recommended-heading" class="product-preview__title">Recommended for you</h2>
    <ProductCardGrid items={previewMediaItems} />
  </section>
</AppLayout>
```

Keep Movies, TV Series, Bookmarked, and Profile as placeholders for now.

This gives enough surface to test:

- card layout;
- grid layout;
- responsive sizes;
- hover/focus overlay;
- bookmark visual state;
- Movie and TV Series metadata;
- title/metadata typography;
- NavBar still working in the app shell.

---

## Optional media detail placeholder route

If avoiding 404s is important during QA, create:

```text
frontend/src/pages/media/[id].astro
```

Minimal content:

```text
Media detail placeholder
```

Rules:

- do not implement real detail page design;
- do not add media-detail layout complexity;
- clearly mark it as placeholder content.

[ASSUMPTION] The Product Card can ship with a placeholder detail route only as a temporary route-integrity helper.

---

## Implementation sequence

### Step 1 — Add media types and sample data

Create:

```text
frontend/src/types/media.ts
frontend/src/data/media.ts
frontend/src/assets/media/
```

Acceptance:

- sample media data has at least six items;
- includes Movie and TV Series;
- includes selected and unselected bookmark states;
- includes local thumbnails;
- no Figma asset URLs are used in source code.

---

### Step 2 — Refactor Icon safely

Create:

```text
frontend/src/types/icon.ts
```

Modify:

```text
frontend/src/components/ui/Icon.astro
frontend/src/components/navigation/NavIconLink.astro
frontend/src/data/navigation.ts
```

Acceptance:

- NavBar still renders correctly;
- nav icons keep their `32px` size;
- Product Card can request smaller icons;
- Movie, TV Series, bookmark, and play icons are available.

[KEY RISK] This touches a working NavBar. Verify NavBar immediately after this step before continuing.

---

### Step 3 — Add Product Card atoms

Create:

```text
frontend/src/components/media/BookmarkButton.astro
frontend/src/components/media/PlayOverlay.astro
frontend/src/components/media/ProductMeta.astro
```

Acceptance:

- Bookmark button renders selected/unselected state;
- Bookmark button has `aria-pressed` and accessible label;
- Play overlay renders a link with visible `Play` text;
- metadata row supports Movie and TV Series;
- dot separators are CSS, not image assets.

---

### Step 4 — Build ProductCard.astro

Create:

```text
frontend/src/components/media/ProductCard.astro
```

Acceptance:

- renders thumbnail;
- renders bookmark at top-right;
- renders metadata;
- renders title;
- renders Play overlay on hover/focus-within;
- does not wrap the whole card in a link.

---

### Step 5 — Add media.css

Create:

```text
frontend/src/styles/components/media.css
```

Modify:

```text
frontend/src/layouts/BaseLayout.astro
```

Acceptance:

- desktop card matches `280 × 229`;
- tablet card matches `220 × 195`;
- mobile card matches `164 × 158`;
- thumbnail has `8px` radius;
- bookmark is `12px` from top/right;
- overlay uses `rgba(0, 0, 0, 0.5)`;
- Play pill matches Figma proportions.

---

### Step 6 — Add ProductCardGrid

Create:

```text
frontend/src/components/media/ProductCardGrid.astro
```

Acceptance:

- mobile shows 2 columns;
- tablet shows 3 columns;
- desktop shows 4 columns;
- desktop grid width can reach `1240px`;
- grid gap matches Figma: `15px / 30px / 40px` column gap.

---

### Step 7 — Show it on Home

Modify:

```text
frontend/src/pages/index.astro
```

Acceptance:

- Home page shows Product Card preview grid;
- NavBar still appears;
- Home nav item still active;
- no placeholder-only Home content remains.

---

### Step 8 — Optional detail placeholder

Only if we want clickable Play links to avoid 404:

```text
frontend/src/pages/media/[id].astro
```

Acceptance:

- clicking Play opens a placeholder detail page;
- the page clearly says it is placeholder content;
- no real detail design is attempted.

---

## Testing checklist

Run from `frontend/`:

```bash
pnpm build
pnpm astro check
```

If `astro check` tooling is not installed, do not expand the task just to add tooling unless we decide it is part of the workflow.

Manual viewport checks:

```text
375px
768px
1440px
```

Check:

- card width and thumbnail height per breakpoint;
- title and metadata typography;
- bookmark top/right position;
- selected/unselected bookmark visual state;
- Movie and TV Series metadata icons;
- hover overlay;
- keyboard focus overlay;
- Play link focus state;
- bookmark button focus state;
- no nested interactive controls;
- no global horizontal overflow;
- NavBar still works after Icon refactor.

---

## Accessibility checklist

The Product Card must support:

- keyboard-accessible Play link;
- keyboard-accessible Bookmark button;
- visible focus state;
- no nested interactive controls;
- icon-only bookmark button with accessible label;
- decorative thumbnail `alt=""` when title is visible;
- logical metadata order: year, category, rating;
- hover overlay also available on keyboard focus;
- `aria-pressed` on bookmark button.

Recommended labels:

```text
Bookmark unselected: Add {title} to bookmarks
Bookmark selected: Remove {title} from bookmarks
Play link: View details for {title}
```

Visible Play text remains:

```text
Play
```

---

## Key risks and mitigations

### Risk 1 — Breaking the working NavBar

The shared `Icon.astro` is currently used by NavBar.

Mitigation:

- refactor icons in a small isolated step;
- keep nav icon classes passed from NavBar;
- immediately verify NavBar before continuing.

### Risk 2 — Using temporary Figma asset URLs

Figma asset URLs expire.

Mitigation:

- use local image assets;
- commit thumbnails under `frontend/src/assets/media/`;
- do not paste Figma URLs into source code.

### Risk 3 — Overbuilding bookmark behavior

Real bookmark behavior depends on authentication and is not part of this task.

Mitigation:

- render visual state from props;
- add accessible labels and data hooks;
- do not mutate state yet;
- do not implement auth modal in this task.

### Risk 4 — Dead Play links

Media detail page design is out of scope.

Mitigation:

- either create a clearly marked placeholder detail route;
- or keep `detailHref` ready and accept that full Play navigation is not complete yet.

### Risk 5 — Treating desktop component as the only size

The Figma component set shows `280px`, but page examples use `164px` and `220px` too.

Mitigation:

- implement responsive grid/card sizing;
- use `164 / 220 / 280` widths;
- use `110 / 140 / 174` thumbnail heights.

### Risk 6 — Metadata wrapping or overflow

Long ratings or labels can create awkward wrapping.

Mitigation:

- do not hardcode metadata row widths from Figma;
- allow the metadata row to wrap safely;
- test Movie and TV Series labels at mobile width.

### Risk 7 — Hover-only Play affordance on touch devices

Touch devices do not have hover.

Mitigation:

- keep the Play link in the DOM;
- reveal it on focus-within;
- ensure it remains keyboard accessible;
- later evaluate whether touch devices need always-visible or tap-to-reveal behavior.

---

## Final reviewed implementation path

After reviewing the plan twice, the safest sequence is:

1. Add media types/data/assets.
2. Refactor `Icon.astro` safely and verify NavBar.
3. Build Product Card atoms.
4. Build `ProductCard.astro`.
5. Add `media.css` and import it from `BaseLayout.astro`.
6. Add `ProductCardGrid.astro`.
7. Replace Home placeholder with a preview grid.
8. Optionally add `/media/[id]` placeholder route only if needed.

The most important guardrail is to avoid turning this into full page implementation. This task should produce a strong reusable card component and a small Home preview grid, nothing more.

---

## Definition of done

This task is complete when:

- `ProductCard.astro` exists and is reusable;
- Product Card atoms exist or equivalent component structure exists;
- Product Card grid renders sample cards on Home;
- Product cards use local assets;
- Product cards are responsive: `164px / 220px / 280px` widths;
- thumbnail heights match Figma: `110px / 140px / 174px`;
- hover/focus overlay shows Play pill;
- Bookmark selected/unselected visual state works from props;
- Movie and TV Series metadata variants render;
- the whole card is not a link;
- Bookmark and Play are separate interactive controls;
- NavBar still works after any Icon refactor;
- no Tailwind is added;
- no root workspace is added;
- `pnpm build` passes from `frontend/`.
