# DESIGN.md — Entertainment Web App

## Scope

This document defines the visual and UX direction for the Entertainment Web App based strictly on the examples. It focuses on design intent, layout, responsive behavior, interaction states, accessibility, and unresolved design questions. It does not define implementation architecture, data fetching, routing, or code structure yet.

The examples contain responsive screens, component variants, hover/active examples, and a style guide. The examples should be treated as the current visual source of truth for this project.

`SPEC.md` should remain aligned with this document. When a behavior is visually implied but not fully designed, this document records the design intent and `SPEC.md` records the product/technical contract.

---

## 1. Product purpose

The product is a dark-themed entertainment browsing app for discovering, searching, filtering, opening, and bookmarking movies and TV series.

The core user experience is centered around five actions:

1. Browse trending and recommended media.
2. Search for movies or TV series.
3. Filter the catalog by content type: Movies or TV Series.
4. Bookmark content and revisit saved items later.
5. Open a media item through the `Play` affordance and navigate to a detail page.

The interface is intentionally minimal. It avoids heavy chrome and gives priority to media thumbnails, titles, metadata, and quick actions.

### Primary user flows represented in the design

- Home discovery flow
- Search results flow
- Movies category flow
- TV Series category flow
- Bookmarked content flow
- Login flow
- Sign-up flow

### Primary user flows implied but not visually designed yet

- Media detail page reached from the `Play` overlay
- Profile/account page reached from the avatar link
- Authenticated bookmarking behavior

### Screens present in the Figma page

| Section | Responsive frames present | Purpose |
|---|---:|---|
| Home | Mobile, Tablet, Desktop | Main discovery page with search, trending, and recommended content |
| Search | Mobile, Tablet, Desktop | Search results for a query such as `Earth` |
| Movies | Mobile, Tablet, Desktop | Movie-only listing |
| TV Series | Mobile, Tablet, Desktop | TV-series-only listing |
| Bookmarked | Mobile, Tablet, Desktop | Saved content grouped by Movies and TV Series |
| Login | Mobile, Tablet, Desktop | Existing-user authentication |
| Sign Up | Mobile, Tablet, Desktop | Account creation |
| Components | Component variants | Reusable UI component definitions |
| Style Guide | Design tokens | Colors, typography, and spacing |
| Highlighted Content | Desktop, Tablet, Mobile examples | Trending/highlighted card behavior across viewport sizes |
| Hover/Active states | Desktop examples | Interaction state references |

---

## 2. Component/system purpose

This design is not a single isolated component. It is a small application UI system composed of reusable components:

- App shell
- Navigation
- Search bar
- Media card
- Trending/highlighted media card
- Bookmark button
- Thumbnail/play overlay
- Media grid
- Empty state message
- Skeleton loading state
- Auth card
- Form input
- Button

Together, these components define a compact entertainment dashboard experience.

### UX principles

- **Media-first:** thumbnails and titles carry the experience.
- **Low-friction navigation:** category switching should be immediately visible and easy to reach.
- **Context-aware search:** placeholder, scope, and result copy adapt to the current section.
- **Live feedback:** search results update as the user types.
- **Fast bookmarking:** bookmarking is exposed directly on each card after authentication.
- **Responsive continuity:** the same mental model is preserved across desktop, tablet, and mobile, while navigation changes from sidebar to top bar.
- **Minimal visual noise:** dark background, subtle surfaces, muted metadata, and one strong red accent.
- **Progressive state visibility:** empty, loading, and error states should be clear without introducing unnecessary UI complexity.

---

## 3. Visual anatomy

### 3.1 App shell

The app shell consists of:

1. Main dark background.
2. Persistent navigation region.
3. Search region.
4. Main content area.
5. Content sections and grids.
6. State messaging when content is empty, loading, or unavailable.

Desktop uses a two-column dashboard layout:

```text
[ Sidebar navigation ] [ Main content ]
```

Tablet and mobile use a stacked layout:

```text
[ Top navigation ]
[ Search ]
[ Content ]
```

### 3.2 Navigation

The navigation is icon-led and minimal.

Visual elements:

- Brand/logo icon at the start of the nav.
- Category icons for Home, Movies, TV Series, and Bookmarked.
- User/avatar icon at the opposite end.
- Active icon state uses white.
- Inactive icon state uses muted blue-gray.
- Desktop navigation sits inside a dark blue surface.

Desktop nav characteristics:

- Vertical sidebar.
- Approximate designed width: `96px`.
- Positioned with generous outer margin, around `32px` from the top and left.
- Rounded dark surface.

Tablet/mobile nav characteristics:

- Horizontal top bar.
- Full-width container aligned within the page side margins.
- Icons distributed horizontally.
- Avatar aligned to the right edge.

Navigation behavior:

- Category icons are navigation links.
- The avatar is also a link to a separate page.
- Active route is shown with the white icon state.
- Inactive route hover does **not** need a separate visual state beyond the defined default/active behavior.

### 3.3 Search bar

The search bar appears near the top of content pages and changes placeholder by context:

- Home: `Search for movies or TV series`
- Movies: `Search for movies`
- TV Series: `Search for TV series`
- Bookmarked: `Search for bookmarked shows`
- Search result state: query value shown, for example `Earth`

Visual anatomy:

- Search icon on the left.
- Large, light text input.
- Minimal underline appears in active state.
- Background remains visually integrated into the page background.
- Active state uses a bottom rule and visible typed text.

Search behavior:

- Search updates live as the user types.
- Search is scoped to the current section context.
- On Home, search covers movies and TV series.
- On Movies, search only covers movies.
- On TV Series, search only covers TV series.
- On Bookmarked, search only covers bookmarked content.
- When no results are found, the page should show an empty state message.
- Clearing the query should return the current page to its default content state.
- A search-result view is a UI state for the active scope; this design does not require or prohibit a dedicated search route.

[ASSUMPTION] Exact empty-state copy is not defined in the examples. The message should be clear, short, and contextual, for example `No results found` or `No bookmarked shows found`.

### 3.4 Content sections

Content sections use simple headings and card groups.

Examples:

- `Trending`
- `Recommended for you`
- `Movies`
- `TV Series`
- `Bookmarked Movies`
- `Bookmarked TV Series`
- `Found 2 results for ‘Earth’`

Section headings are large, light-weight, and white. They create hierarchy without needing boxes, tabs, or extra separators.

When a section has no content, the section should not collapse silently. It should show a clear empty state message in the content area.

### 3.5 Media card

The media card is the core reusable content object.

Visual anatomy:

1. Thumbnail image.
2. Bookmark action in the top-right corner of the image.
3. Metadata row.
4. Title.

Metadata consists of:

- Year, for example `2019`.
- Category, either `Movie` or `TV Series`.
- Category icon.
- Rating, for example `PG`, `E`, or `18+`.

Example content pattern:

```text
2019 · Movie · PG
Beyond Earth
```

Card behavior:

- Default state shows the image, bookmark button, metadata, and title.
- Hover state adds a dark overlay and centered `Play` affordance on the thumbnail.
- Bookmark state changes the bookmark icon from empty/default to filled/active.
- The `Play` affordance is interactive and navigates to a media detail page.
- The `Play` affordance must be reachable through keyboard focus, not only mouse hover.
- Bookmarking is only available after authentication; the exact logged-out affordance is not visually defined yet.
- Ratings and titles are data-driven strings.
- Title capitalization should be displayed exactly as provided by the data source for now.

### 3.6 Trending/highlighted card

Trending cards are visually larger than regular recommended cards.

Visual differences:

- Larger thumbnail area.
- Metadata and title appear over the image near the lower-left area.
- Bookmark icon remains in the top-right area.
- Cards are arranged horizontally.
- On smaller viewports, trending/highlighted content should scroll horizontally.

[OPEN QUESTION] The exact trending interaction model is still TBD: true carousel, native horizontal scroll, snap scrolling, or static clipped row.

### 3.7 Auth card

The Login and Sign Up screens use a centered authentication card.

Visual anatomy:

1. Logo above the card.
2. Dark blue form container.
3. Screen title: `Login` or `Sign Up`.
4. Form fields.
5. Full-width primary action button.
6. Secondary text link below the button.

Login fields:

- Email address
- Password

Sign Up fields:

- Email address
- Password
- Repeat Password

Auth card visual characteristics:

- Form card uses the secondary dark blue surface.
- Card is rounded.
- Inputs are minimal, using underline styling rather than boxed fields.
- Primary CTA is red by default.
- Primary CTA hover/active treatment is white with dark text.
- Secondary link uses the red accent.

Auth state behavior:

- Required field errors use the red underline and red helper/error text shown in the component set.
- Password mismatch should show an error state.
- Exact validation rules are still TBD.
- Loading and submission error states are still TBD.

---

## 4. Layout structure

### 4.1 Desktop layout

Desktop frames use `1440px` viewport width.

Observed desktop frame sizes:

| Screen | Desktop frame |
|---|---:|
| Home | `1440 × 2105` |
| Search | `1440 × 1024` |
| Movies | `1440 × 1261` |
| TV Series | `1440 × 1261` |
| Bookmarked | `1440 × 1363` |
| Login | `1440 × 810` |
| Sign Up | `1440 × 810` |

Desktop app layout characteristics:

- Main app background fills the viewport with `Blue 950`.
- Sidebar is fixed visually at the left.
- Main content starts to the right of the sidebar, around `164px` from the left edge in several desktop screens.
- Main content width is around `1240px–1276px` depending on the screen.
- Search appears at the top of the main content area.
- Content flows vertically below search.
- Regular content grids appear in multiple columns.
- Trending content uses a horizontal row.

### 4.2 Tablet layout

Tablet frames use `768px` viewport width.

Observed tablet frame sizes:

| Screen | Tablet frame |
|---|---:|
| Home | `768 × 2351` |
| Search | `768 × 1024` |
| Movies | `768 × 1024` |
| TV Series | `768 × 1024` |
| Bookmarked | `768 × 1223` |
| Login | `768 × 1024` |
| Sign Up | `768 × 1024` |

Tablet layout characteristics:

- Sidebar becomes a horizontal top navigation bar.
- Page uses side margins of approximately `24px–25px`.
- Search sits below the top navigation.
- Content grids use more columns than mobile but fewer than desktop.
- The Home page remains long because both trending and recommended sections are shown.

### 4.3 Mobile layout

Mobile frames use `375px` viewport width.

Observed mobile frame sizes:

| Screen | Mobile frame |
|---|---:|
| Home | `375 × 2467` |
| Search | `375 × 667` |
| Movies | `375 × 667` |
| TV Series | `375 × 667` |
| Bookmarked | `375 × 1446` |
| Login | `375 × 667` |
| Sign Up | `375 × 667` |

Mobile layout characteristics:

- Top navigation bar replaces desktop sidebar.
- Horizontal side padding is approximately `24px`.
- Search appears below navigation.
- Regular content cards form a compact two-column grid.
- Trending cards remain horizontally oriented and scroll.
- Vertical spacing is compact but still airy.
- Pages scroll vertically when content exceeds the viewport.

---

## 5. Responsive behavior

### Navigation behavior

| Viewport | Navigation pattern |
|---|---|
| Desktop | Vertical left sidebar |
| Tablet | Horizontal top navigation |
| Mobile | Horizontal top navigation |

### Content behavior

| Content type | Desktop | Tablet | Mobile |
|---|---|---|---|
| Search bar | Wide, left-aligned in main content | Below top nav | Below top nav |
| Trending cards | Horizontal row | Horizontal scroll | Horizontal scroll |
| Regular media grid | Multi-column grid | Medium grid | Compact two-column grid |
| Empty states | Message inside content region | Message inside content region | Message inside content region |
| Skeleton loading | Preserves card/grid layout | Preserves card/grid layout | Preserves card/grid layout |
| Auth card | Centered on page | Centered, same card width where possible | Fuller width, reduced side margins |

### Breakpoint guidance from design frames

The Figma source explicitly defines these design targets:

- Mobile: `375px`
- Tablet: `768px`
- Desktop: `1440px`

[ASSUMPTION] These should be treated as design reference widths, not necessarily exact CSS breakpoint values. Practical breakpoints can be decided later in the implementation spec.

---

## 6. Typography

The product UI uses **Outfit only**.

The latest Figma inspection still shows some **Plus Jakarta Sans** usage inside style-guide documentation labels, but that font should not be used in the product UI or in the project design tokens. For the app itself, all typography should be represented with Outfit.

### Typography token naming

Typography tokens use semantic names. Token names describe the role of the text in the interface, not the original Figma preset number.

Avoid names such as `Text Preset 1`, `Text Preset 2 Medium`, or `Text Preset 1 Mobile` in implementation-facing documentation. Those names describe the order of the original Figma style-guide rows, not the purpose of the text.

Use one semantic token with responsive values instead of creating separate desktop/mobile token names. For example, use `type.section-title` with desktop and mobile values, not `type.section-title-desktop` and `type.section-title-mobile`.

[FIGMA NOTE] The Figma style-guide rows now use semantic names. Rows that represent mobile values are marked with `/ mobile` or `/ compact-mobile` only to make the reference table readable inside Figma. Those suffixes describe the row context; they should not be treated as separate implementation token names.

### Typography tokens

| Token | Font | Desktop value | Mobile value | Use |
|---|---|---:|---:|---|
| `type.section-title` | Outfit Light | `32px / 125%`, `-0.5px` | `20px / 125%`, `-0.3px` | Main content headings such as `Trending`, `Recommended for you`, `Movies`, `TV Series`, `Bookmarked Movies`, and search-result headings |
| `type.search-input` | Outfit Light | `24px / 125%`, `0px` | `16px / 125%`, `0px` | Search placeholders and typed search queries |
| `type.featured-title` | Outfit Medium | `24px / 125%`, `0px` | `15px / 125%`, `0px` | Titles inside trending/highlighted cards |
| `type.featured-meta` | Outfit Light | `15px / 125%`, `0px` | `12px / 125%`, `0px` | Metadata inside trending/highlighted cards |
| `type.card-title` | Outfit Medium | `18px / 125%`, `0px` | `15px / 125%`, `0px` | Regular media card titles |
| `type.card-meta` | Outfit Light | `13px / 125%`, `0px` | `11px–12px / 125%`, `0px` | Regular media card metadata: year, category, rating |
| `type.form-title` | Outfit Light | `32px / 125%`, `-0.5px` | `32px / 125%`, `-0.5px` | Auth card titles: `Login`, `Sign Up` |
| `type.form-field` | Outfit Light | `15px / 125%`, `0px` | `15px / 125%`, `0px` | Form inputs and placeholders |
| `type.form-error` | Outfit Light | `13px / 125%`, `0px` | `13px / 125%`, `0px` | Validation messages such as `Can’t be empty` |
| `type.button-label` | Outfit Light | `15px / 125%`, `0px` | `15px / 125%`, `0px` | Primary CTA buttons |
| `type.auth-helper` | Outfit Light | `15px / 125%`, `0px` | `15px / 125%`, `0px` | Auth helper copy such as `Don’t have an account?` and `Already have an account?` |
| `type.link-label` | Outfit Light | `15px / 125%`, `0px` | `15px / 125%`, `0px` | Text links such as `Sign Up` and `Login` |
| `type.empty-state` | Outfit Light | `18px / 125%`, `0px` | `15px / 125%`, `0px` | Empty-state messages |

### Mapping from original Figma preset names

| Original Figma label | Semantic token |
|---|---|
| `Text Preset 1` | `type.section-title` |
| `Text Preset 2 (Medium)` | `type.featured-title` |
| `Text Preset 2 (Light)` | `type.search-input` |
| `Text Preset 3` | `type.card-title` |
| `Text Preset 4` | `type.featured-meta` |
| `Text Preset 5` | `type.card-meta` |
| `Text Preset 1 (Mobile)` | mobile value for `type.section-title` |
| `Text Preset 2 (Mobile)` | mobile value for `type.search-input` |
| `Text Preset 3 (Mobile)` | mobile value for `type.card-title` and `type.featured-title` |
| `Text Preset 4 (Mobile)` | mobile emphasized label value; use only where the Figma design shows the 14px medium treatment |
| `Text Preset 5 (Mobile)` | mobile value for `type.featured-meta` or compact metadata |
| `Text Preset 6 (Mobile)` | compact mobile value for `type.card-meta` |

### Typographic personality

- Headings use light weight, giving the UI a modern and calm feeling.
- Card titles use medium weight for scanability.
- Metadata uses light weight and smaller size, keeping attention on the media title and image.
- The red accent is not overused in typography; it appears mainly for actions and errors.

---

## 7. Colors

The product uses a compact dark color palette.

| Token | Hex | Role |
|---|---|---|
| White | `#FFFFFF` | Main text, active icons, high-contrast foreground |
| Black | `#000000` | Overlay foundation |
| Blue 950 | `#10141E` | Main app background |
| Blue 900 | `#161D2F` | Sidebar, form card, elevated surfaces |
| Blue 500 | `#5A698F` | Muted text, inactive icons, placeholder/field lines |
| Red 500 | `#FC4747` | Primary action, brand accent, validation error |
| Black 0% opacity | `rgba(0, 0, 0, 0)` | Gradient/overlay start |
| Black 75% opacity | `rgba(0, 0, 0, 0.75)` | Gradient/overlay end |

### Color application

- The app background should stay consistently dark blue (`Blue 950`).
- Surfaces such as the sidebar and auth forms use `Blue 900`.
- Text defaults to white.
- Metadata and inactive states use `Blue 500`.
- Red is reserved for high-signal moments: primary buttons, links, caret/active input accent, and validation errors.
- Hover overlays use black opacity over thumbnails.
- Skeleton states should stay within the dark palette and should not introduce bright placeholder blocks.

### Color risks

- Red error text should be checked for contrast against the dark background.
- White hover/active buttons with dark text should be checked for contrast and visual consistency.
- Focus indicators still need a visible color treatment that works both on dark backgrounds and over image thumbnails.

---

## 8. Spacing

The Figma style guide defines a simple spacing scale:

| Token | Value |
|---|---:|
| `spacing-0` | `0px` |
| `spacing-100` | `8px` |
| `spacing-200` | `16px` |
| `spacing-300` | `24px` |
| `spacing-400` | `32px` |
| `spacing-500` | `40px` |
| `spacing-700` | `56px` |
| `spacing-900` | `72px` |
| `spacing-1000` | `80px` |

### Spacing behavior observed

- Mobile horizontal page padding is approximately `24px`.
- Desktop sidebar offset is approximately `32px` from top/left.
- Desktop main content starts after the sidebar with generous spacing.
- Auth cards use internal spacing that feels close to `24px–32px`.
- Large vertical gaps between search, section headings, and content grids use the upper range of the spacing scale.

### Spacing principles

- Use the spacing scale consistently instead of ad hoc values.
- Preserve generous breathing room on desktop.
- Compress vertical rhythm on mobile without making tap targets too small.
- Keep section headings close enough to their content to preserve grouping.
- Empty state messages should align with the same content grid and section rhythm, rather than appearing as disconnected centered alerts.
- Skeleton states should preserve the same spacing and dimensions as the final loaded content.

---

## 9. Imagery, icons, and decorative elements

### Imagery

Media thumbnails are a dominant visual element.

Characteristics:

- Poster/cinematic thumbnail imagery.
- Rounded corners.
- Cropped to fill the thumbnail container.
- Different image crops/sizes for trending and regular cards.
- Dark overlay appears in hover/play state.

Image behavior requirements from a design perspective:

- Images should preserve aspect ratio while filling their cards.
- Cropping should feel intentional and cinematic.
- Missing or still-loading images should not break the card layout.
- A skeleton placeholder should be shown until thumbnail loading succeeds or a permanent image-failure fallback state is chosen.
- Decorative thumbnail images should not repeat the visible title as redundant screen-reader content.

[ASSUMPTION] Permanent image-load failure behavior beyond the skeleton is not fully defined. If an image never loads, the safest visual fallback is to keep the card structure intact and show an error/fallback treatment rather than a broken image icon.

### Icons

Icon types present in the design:

- App logo.
- Home icon.
- Movie icon.
- TV Series icon.
- Bookmark icon.
- User/avatar icon.
- Search icon.
- Play icon.
- Category icons inside card metadata.

Icon behavior:

- Inactive nav icons use muted blue-gray.
- Active nav icon uses white.
- Inactive nav icons do not require a separate hover state for now.
- Bookmark icon has default, hover, and active/fill states.
- Play icon appears inside thumbnail hover overlay.
- Avatar icon behaves as a link to another page.

### Decorative elements

Decorative elements are minimal:

- Dark surfaces.
- Rounded cards/surfaces.
- Image overlays.
- Underline rules for form fields.
- Skeleton placeholders during loading.
- No ornamental dividers or illustrations are used.

---

## 10. Interaction states

The Figma Components and Hover/Active sections define several explicit states. Stakeholder answers also define several missing states that should be included in the design specification.

### State priority

When multiple content states could apply, the visual priority should be:

1. Loading/skeleton state.
2. Content error or permanent image-failure fallback state.
3. Empty state.
4. Populated content state.

This prevents contradictory states, such as showing an empty message while a section is still loading, or keeping a skeleton visible forever after an image has definitively failed.

### Search bar states

| State | Visual behavior |
|---|---|
| Empty | Search icon + placeholder text |
| Active | Typed value visible, bottom underline visible |
| Filled | Typed value remains visible without active caret treatment |
| No results | Empty state message in the content area |

Search interaction rules:

- Results update live as the user types.
- Search is scoped to the current section context.
- Empty-result feedback should be contextual to the active page.

### Input form states

| State | Visual behavior |
|---|---|
| Default | Placeholder text, muted underline |
| Filled | User-entered text, muted underline |
| Active | User-entered text, white underline, red caret/accent |
| Error | Error message in red, red underline |

Error copy shown in Figma:

```text
Can’t be empty
```

Password mismatch behavior:

- Should use the same error-state language: red underline + red helper/error message.
- Exact mismatch copy is TBD.

### Button states

| State | Visual behavior |
|---|---|
| Primary/default | Red filled button with white text |
| Hover/active | White filled button with dark text |

The Figma component names are ambiguous because `Property1=Active` is red and `Property1=Default` is white. The confirmed product interpretation is:

- Red = primary/default CTA.
- White = hover/active CTA treatment.

### Navigation states

| State | Visual behavior |
|---|---|
| Default/inactive | Muted blue-gray icon |
| Active/current page | White icon |
| Hover | No distinct hover state required for now |

### Bookmark states

| State | Visual behavior |
|---|---|
| Default | Circular dark translucent control with empty bookmark icon |
| Hover | Contrast/foreground changes to indicate interactivity |
| Active | Filled bookmark icon state |
| Unavailable/logged out | Bookmarking should not be available until authentication |

Bookmarked state persists across screens after authentication.

### Thumbnail states

| State | Visual behavior |
|---|---|
| Loading | Skeleton placeholder preserves thumbnail/card layout until the image succeeds or failure is determined |
| Failure | Card layout remains intact and uses a fallback/error thumbnail treatment; exact visual is TBD |
| Default | Thumbnail image, with bookmark control |
| Hover | Dark overlay + centered `Play` pill/control |
| Play action | Navigates to a media detail page |

The play overlay includes:

- Darkened image overlay.
- Centered pill/rounded control.
- Play icon.
- Text label `Play`.

### Empty states

Empty state messages are required for:

- Search with zero results.
- Bookmarked page with no bookmarked movies or TV series.
- Any scoped content section that has no items.

[ASSUMPTION] Empty states should be lightweight text states, not large illustration-based states, because the visual system is minimal and no empty-state illustrations are present in Figma.

### Auth form states

Login and Sign Up screens show default form states. The Hover/Active section shows active and error examples.

Auth interaction should support:

- Empty required fields.
- Active focus state.
- Filled state.
- Error state.
- Password mismatch error state.
- CTA hover/active state.
- Auth link hover/focus state.

[OPEN QUESTION] Exact auth validation rules are TBD.

[OPEN QUESTION] Auth loading and submission error states are TBD.

---

## 11. Accessibility considerations

### Color and contrast

The core contrast appears strong because white text is used on dark blue backgrounds. Red text/errors should be checked against dark backgrounds and against any white button state before final implementation.

### Keyboard access

All interactive elements must be reachable and usable with keyboard. The page should also expose clear landmarks for navigation, search, and main content.


- Navigation links.
- Avatar/profile link.
- Search input.
- Bookmark buttons.
- Play controls.
- Auth form fields.
- Submit buttons.
- Login/Sign Up text links.

The Figma page does not need to add keyboard focus states before implementation, but the product experience still requires visible focus states.

[ASSUMPTION] Focus states should be added during specification/implementation using a visible outline that works on dark backgrounds and image thumbnails.

### Search accessibility

The search input should not rely only on placeholder text. It needs an accessible label that reflects the current context.

Examples:

- `Search for movies or TV series`
- `Search for movies`
- `Search for TV series`
- `Search bookmarked shows`

Because search updates live, result-count changes or empty states should be communicated without being disruptive. A polite live region or equivalent announcement strategy should be considered so screen-reader users understand result changes without hearing excessive updates on every keystroke.

### Navigation accessibility

- Current page icon should be identifiable beyond color.
- The active route should be communicated programmatically.
- Icon-only links need accessible names.
- Avatar/profile link needs an accessible label.

### Media card accessibility

- Each card should expose a clear media title.
- Bookmark controls need item-specific accessible names:
  - `Add Beyond Earth to bookmarks`
  - `Remove Beyond Earth from bookmarks`
- The play control must be keyboard accessible because it navigates to the detail page.
- Bookmark and play controls should remain separate interactive targets to avoid ambiguous or nested interactions.
- Metadata should be readable in a logical order: year, category, rating.
- Thumbnail images may be decorative if the visible card title already names the item.

### Forms accessibility

- Inputs need associated labels.
- Error text needs to be associated with the relevant input.
- Error state must not rely on red alone.
- Required fields should be communicated clearly.
- Password mismatch should be announced as an error state.

### Empty/loading accessibility

- Empty state messages should be available to assistive technology.
- Skeleton loading should not create noisy repeated announcements.
- Once content is loaded, the visible result count or section content should update clearly.

### Touch targets

Mobile and tablet interactive targets should be large enough for touch use. Icon buttons should visually remain compact, but the actual hit area should be comfortable.

[ASSUMPTION] Minimum target size should be treated as approximately `44px × 44px`, even where the visible icon is smaller.

### Motion and hover

Hover overlays should not be the only way to discover or activate play/bookmark functionality. Motion should be subtle and should respect reduced-motion preferences.

Reduced-motion behavior is required. Any overlay fade, skeleton shimmer, carousel movement, or page transition should either be removed or simplified when reduced motion is preferred.

---

## 12. Content and copy notes

### Important visible copy

Search/context copy:

- `Search for movies or TV series`
- `Search for movies`
- `Search for TV series`
- `Search for bookmarked shows`
- `Found 2 results for ‘Earth’`

Section headings:

- `Trending`
- `Recommended for you`
- `Movies`
- `TV Series`
- `Bookmarked Movies`
- `Bookmarked TV Series`

Auth copy:

- `Login`
- `Sign Up`
- `Email address`
- `Password`
- `Repeat Password`
- `Login to your account`
- `Create an account`
- `Don’t have an account?`
- `Already have an account?`

State copy:

- Empty search results require a message.
- Empty bookmarked sections require a message.
- Exact empty-state copy is TBD.
- Exact auth validation copy is TBD beyond the visible `Can’t be empty` example.

### Copy normalization

The canonical Sign Up secondary copy should be:

```text
Already have an account?
```

Media titles are data-driven and should be displayed as provided. Capitalization normalization is out of scope for now.

---

## 13. Design risks before implementation planning

The following risks should be resolved or consciously accepted before planning implementation:

1. **Hover-only affordances:** `Play` appears visually on hover, but the same action must be available through keyboard focus and touch-friendly behavior.
2. **Nested interactions in media cards:** bookmark and play actions are separate controls. Planning should avoid creating a card structure where buttons are nested inside links or where one click target masks another.
3. **Live search accessibility:** live updates can become noisy for assistive technology if result counts are announced too aggressively.
4. **Skeleton versus failure state:** skeletons are confirmed while loading, but permanent image failure needs a fallback so loading does not appear endless.
5. **Unauthenticated bookmarking:** bookmarking requires authentication, but the logged-out visual/interaction treatment is not defined.
6. **Future routes:** `Play` and avatar are links to future pages whose visual designs are not included yet.
7. **Trending mechanics:** horizontal trending behavior is visually present, but carousel/scroll mechanics are unresolved.
8. **Data-driven content:** titles, ratings, and categories come from data. The UI needs enough flexibility for longer strings without breaking the grid.

---

## 14. Remaining assumptions

The following assumptions remain because they are reasonable design interpretations but are not fully visible in the Figma page:

1. [ASSUMPTION] Exact CSS breakpoints may differ from the examples reference widths, as long as the responsive behavior matches the design intent.
2. [ASSUMPTION] Empty states should be lightweight text states unless future designs introduce richer empty-state visuals.
3. [ASSUMPTION] Permanent image-load failure should preserve the card layout and avoid broken image icons, even though the confirmed state is skeleton until successful load.
4. [ASSUMPTION] Focus states will be designed during specification/implementation rather than added directly in examples at this stage.
5. [ASSUMPTION] The detail page and profile/account page are future routes implied by the current page, but their visual design is not included in this Figma page.
6. [ASSUMPTION] Search result presentation may be implemented as a route or as an in-page result state, as long as scoped live search behavior and visual hierarchy remain aligned with the examples.
7. [ASSUMPTION] If unauthenticated bookmark controls are visible, they must not change bookmark state; the exact logged-out behavior remains unresolved.
8. [ASSUMPTION] State priority should be loading, then error/failure, then empty, then populated content.

---

## 15. Open questions

The following questions remain unresolved after the latest clarification:

1. What is the exact trending behavior: native horizontal scroll, snap scroll, carousel controls, or static clipped row?
2. What are the exact validation rules for Login and Sign Up forms?
3. What should the auth loading state look like?
4. What should the auth submission error state look like?
5. What is the exact empty-state copy for search, bookmarked content, and empty sections?
6. What should the permanent thumbnail failure state be if an image never loads successfully?
7. What is the destination and visual design for the avatar/profile link?
8. What is the visual design for the media detail page opened from `Play`?
9. What are the exact search matching rules: title-only or broader metadata search, case handling, partial matching, and diacritic handling?
10. For unauthenticated users, should bookmark controls be hidden, disabled, or redirect/prompt login?
11. What should happen if an unauthenticated user opens the Bookmarked page?
12. Should the logo act as a Home link or remain decorative/static?

---

## 16. Design summary

The design defines a polished, compact entertainment dashboard with a strong dark visual identity. The system is visually consistent, with clear tokens for color, typography, and spacing. The strongest components are the media card, search bar, navigation, bookmark action, and auth form system.

The latest clarification resolves most of the product behavior: search is live and scoped to context, bookmarks require authentication, `Play` goes to a detail page, empty results use empty-state messages, thumbnails use skeleton loading, and the product uses only Outfit typography.

The remaining design risk is not visual consistency; it is unresolved behavior/state definition. The next specification/planning pass should define trending mechanics, exact auth validation, loading/submission errors, empty-state copy, permanent image failure, unauthenticated bookmark behavior, the Bookmarked page for logged-out users, the profile/account destination, and the detail page experience.
