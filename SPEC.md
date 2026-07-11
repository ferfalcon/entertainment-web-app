# SPEC.md — Entertainment Web App

## Scope

This document translates `DESIGN.md` and the inspected examples into a technical product specification for the Entertainment Web App UI system.

This specification defines component responsibilities, content requirements, data contracts, layout rules, responsive behavior, accessibility requirements, interaction behavior, edge cases, non-goals, assumptions, open questions, and acceptance criteria.

This document does **not** plan implementation architecture. It does **not** define routing internals, data fetching strategy, backend behavior, framework structure, file structure, or component code.

The examples and `DESIGN.md` remain the visual source of truth. This document is the product/technical contract that implementation should later satisfy. Search result presentation may be implemented as a route or an in-page result state; routing internals are intentionally out of scope for this specification.

---

## 1. Product/system definition

The Entertainment Web App is a dark-themed media browsing interface for movies and TV series. The app supports discovery, scoped live search, category browsing, authenticated bookmarking, authentication screens, and navigation toward future detail/profile pages.

The design should be treated as a small app UI system, not a single isolated component.

### Screens in scope

| Screen | Purpose | Required content regions |
|---|---|---|
| Home | Main discovery page | Navigation, search, trending section, recommended section |
| Search | Live search results page/state | Navigation, active search query, result-count heading, results grid or empty state |
| Movies | Movie-only catalog | Navigation, scoped search, Movies heading, movie grid or empty state |
| TV Series | TV-series-only catalog | Navigation, scoped search, TV Series heading, series grid or empty state |
| Bookmarked | Saved media | Navigation, scoped search, Bookmarked Movies section, Bookmarked TV Series section, empty states |
| Login | Existing-user authentication | Logo, auth card, email field, password field, submit button, Sign Up link |
| Sign Up | Account creation | Logo, auth card, email field, password field, repeat-password field, submit button, Login link |

### Reusable components in scope

- App shell
- Navigation
- Search bar
- Content section
- Media grid
- Media card
- Trending/highlighted media card
- Bookmark button
- Thumbnail/play overlay
- Skeleton state
- Empty state message
- Auth card
- Form input
- Primary button
- Auth helper/link row

---

## 2. Component responsibilities

### 2.1 App shell

The app shell is responsible for arranging the global navigation and page content according to the current viewport.

Responsibilities:

- Provide the dark app background.
- Render persistent navigation.
- Reserve the main content area.
- Expose appropriate page landmarks for navigation, search, and main content.
- Switch layout pattern between desktop sidebar and tablet/mobile top navigation.
- Preserve consistent spacing between navigation, search, and content regions.
- Prevent unintended horizontal page overflow, except where horizontal scrolling is explicitly required for trending/highlighted content.

The app shell is not responsible for filtering media, validating forms, fetching data, or mutating bookmarks.

### 2.2 Navigation

Navigation is responsible for exposing global app routes and showing the active destination.

Responsibilities:

- Render the app logo.
- Render navigation links for Home, Movies, TV Series, and Bookmarked.
- Render the avatar/profile link.
- Indicate the current route using the active icon state.
- Provide accessible names for icon-only links.
- Preserve the visual layout defined by viewport:
  - desktop: vertical sidebar;
  - tablet/mobile: horizontal top navigation.

Navigation is not responsible for route implementation or profile-page content.

### 2.3 Search bar

The search bar is responsible for accepting a text query and communicating its scoped search context.

Responsibilities:

- Display the correct placeholder for the current section.
- Display the current query value when present.
- Support empty, active, and filled visual states.
- Trigger live search updates as the user types.
- Use an accessible label that matches the current search context.
- Avoid relying on placeholder text as the only label.

The search bar is not responsible for choosing the route structure, fetching results, or deciding the final matching algorithm.

### 2.4 Content section

A content section is responsible for grouping media cards under a heading.

Responsibilities:

- Render a section heading.
- Render a grid, horizontal row, skeleton state, or empty state depending on content state.
- Keep the empty state aligned with the section rhythm.
- Preserve layout dimensions during loading where skeletons are shown.

Content sections are not responsible for data retrieval.

### 2.5 Media grid

The media grid is responsible for arranging regular media cards.

Responsibilities:

- Display regular media cards in the correct responsive column pattern.
- Preserve card spacing across breakpoints.
- Maintain the same content order provided by the data source.
- Support loading, empty, and populated states.

The media grid is not responsible for sorting or normalizing media titles unless future product requirements define that behavior.

### 2.6 Media card

The media card is the primary reusable content component for a movie or TV series.

Responsibilities:

- Display the media thumbnail.
- Display bookmark control when the user is authenticated.
- Display metadata: year, category, rating.
- Display the media title exactly as provided by the data source.
- Display the category icon that corresponds to the media category.
- Display skeleton loading until the thumbnail is successfully loaded or a permanent failure state is determined.
- Provide hover/focus access to the `Play` affordance.
- Navigate to a media detail page when `Play` is activated.
- Support bookmarked and unbookmarked visual states.

The media card is not responsible for creating the detail page, defining the detail-page layout, or normalizing capitalization.

### 2.7 Trending/highlighted media card

The trending/highlighted media card is a larger variation of the media card.

Responsibilities:

- Display a larger thumbnail treatment.
- Overlay metadata and title near the lower-left of the image.
- Keep the bookmark action in the top-right of the image.
- Participate in a horizontal row or horizontal scrolling region.
- Support the same play, bookmark, loading, and image behavior as a regular media card.

[OPEN QUESTION] The exact trending mechanism is still unresolved: native horizontal scroll, snap scroll, carousel controls, or static clipped row.

### 2.8 Bookmark button

The bookmark button is responsible for visually and interactively representing the saved state of a media item.

Responsibilities:

- Show default/unbookmarked state.
- Show hover/focus affordance.
- Show active/bookmarked state.
- Expose item-specific accessible names.
- Toggle bookmark state only when bookmarking is available to the current user.

Bookmarking is only available after authentication.

[ASSUMPTION] When the user is not authenticated, the bookmark action should not mutate bookmark state. The exact logged-out affordance can be hidden, disabled, or redirected to authentication, but that behavior is not visually defined yet.

### 2.9 Thumbnail/play overlay

The thumbnail/play overlay is responsible for surfacing the detail-page action.

Responsibilities:

- Keep the thumbnail visible by default.
- Apply a dark overlay in hover/focus state.
- Render centered `Play` control with icon and text.
- Make the `Play` control keyboard accessible.
- Navigate to the media detail page when activated.
- Respect reduced-motion preferences for overlay transitions.

The overlay is not responsible for video playback in the current design. `Play` is a navigation affordance, not an in-place video player.

### 2.10 Empty state message

The empty state message is responsible for communicating that a content region has no items.

Responsibilities:

- Appear when search results are empty.
- Appear when bookmarked movies or bookmarked TV series are empty.
- Appear when any scoped content section has no items.
- Use lightweight text treatment consistent with the minimal design system.
- Be available to assistive technology.

[OPEN QUESTION] Exact empty-state copy is still TBD.

### 2.11 Skeleton loading state

The skeleton loading state is responsible for preserving layout while media thumbnails/content are loading.

Responsibilities:

- Preserve final card/grid dimensions.
- Use the dark palette without introducing bright placeholder blocks.
- Remain visually minimal.
- Avoid noisy repeated announcements for assistive technology.
- Respect reduced-motion preferences if shimmer or animation is used.

Skeletons must remain visible while thumbnails are loading. Once loading succeeds, the image replaces the skeleton. Once loading definitively fails, the skeleton must be replaced by the permanent image-failure fallback.

### 2.12 Auth card

The auth card is responsible for presenting Login and Sign Up forms.

Responsibilities:

- Render logo above the form card.
- Render the correct form title.
- Render required fields for the current form mode.
- Render primary submit action.
- Render the secondary auth link.
- Display validation errors using the defined error state.
- Support required-field errors and password mismatch errors.

The auth card is not responsible for backend authentication, account persistence, or session implementation.

### 2.13 Form input

The form input is responsible for a single text/password input field state.

Responsibilities:

- Support default, active, filled, and error states.
- Render associated label/placeholder text.
- Render error message when present.
- Associate error text with the relevant field for accessibility.
- Preserve the underline style defined in the design.

### 2.14 Primary button

The primary button is responsible for submitting primary actions.

Responsibilities:

- Render red filled default state with white text.
- Render white hover/active state with dark text.
- Support disabled/loading state once that behavior is defined.
- Preserve full-width form usage inside auth cards.

[OPEN QUESTION] Auth loading-state treatment is still TBD.

---

## 3. Content requirements

### 3.1 Global navigation content

Navigation must include the following items:

| Item | Content requirement | Destination status |
|---|---|---|
| Logo | Brand/app mark | Non-route or Home link, TBD by implementation spec |
| Home | Icon-only nav link with accessible name `Home` | In scope |
| Movies | Icon-only nav link with accessible name `Movies` | In scope |
| TV Series | Icon-only nav link with accessible name `TV Series` | In scope |
| Bookmarked | Icon-only nav link with accessible name `Bookmarked` | In scope |
| Avatar/Profile | Avatar image/icon link with accessible name | Destination exists conceptually, visual page TBD |

### 3.2 Search copy

Search placeholder and accessible label must match the page context.

| Context | Placeholder / label |
|---|---|
| Home | `Search for movies or TV series` |
| Movies | `Search for movies` |
| TV Series | `Search for TV series` |
| Bookmarked | `Search for bookmarked shows` |
| Search result state | Query value, for example `Earth` |

Search result headings must follow the pattern shown in the design:

```text
Found {count} results for ‘{query}’
```

[ASSUMPTION] The same heading pattern can be used for scoped search results unless future copy rules define separate wording.

### 3.3 Section headings

Required section headings include:

- `Trending`
- `Recommended for you`
- `Movies`
- `TV Series`
- `Bookmarked Movies`
- `Bookmarked TV Series`
- Search result heading: `Found {count} results for ‘{query}’`

### 3.4 Media card content

Each media card must display:

- Thumbnail image or skeleton/fallback state.
- Year.
- Category: `Movie` or `TV Series`.
- Category icon.
- Rating.
- Title.
- Bookmark control when bookmark action is available.
- Play affordance that navigates to a detail page.

Media titles are data-driven and must be displayed exactly as received.

### 3.5 Auth copy

Login content:

- Title: `Login`
- Fields:
  - `Email address`
  - `Password`
- Primary action: `Login to your account`
- Helper copy: `Don’t have an account?`
- Link text: `Sign Up`

Sign Up content:

- Title: `Sign Up`
- Fields:
  - `Email address`
  - `Password`
  - `Repeat Password`
- Primary action: `Create an account`
- Helper copy: `Already have an account?`
- Link text: `Login`

Required-field error copy shown in examples:

```text
Can’t be empty
```

[OPEN QUESTION] Exact password mismatch copy and full validation copy are TBD.

---

## 4. Data model / props-like contracts

The following contracts describe the data each UI unit needs. They are product-level data requirements, not implementation code.

### 4.1 Media item

| Field | Required | Type / allowed values | Notes |
|---|---:|---|---|
| `id` | Yes | Stable string | Unique media identifier. Duplicate ids are invalid because bookmark state must persist across views. |
| `title` | Yes | String | Display exactly as provided. No capitalization normalization for now. |
| `year` | Yes | Number or 4-digit string | Displayed in metadata. |
| `category` | Yes | `Movie` or `TV Series` | Controls metadata label, category icon, and scoped filtering. Unknown categories are invalid for the current UI. |
| `rating` | Yes | String | Examples: `E`, `PG`, `18+`. Display as provided. |
| `thumbnail` | Yes | Image asset/object | Must provide enough image data for regular card display or for the loading/failure state to preserve layout. |
| `thumbnailAlt` | Optional | String | Usually not required if thumbnail is decorative and title is visible. |
| `isBookmarked` | Yes in normalized UI data | Boolean | Controls bookmark visual state. Raw source data may omit it, but the UI model must normalize it to `false`. |
| `detailHref` | Yes for playable items | URL/path string | Required because `Play` navigates to a detail page. |
| `isTrending` | Optional | Boolean | Defaults to `false`. A section may also decide trending membership by passing items into the Trending section. |
| `trendingThumbnail` | Optional | Image asset/object | Use when a different crop is available. If omitted, the regular thumbnail may be used. |

[ASSUMPTION] `detailHref` is required at the UI contract level for playable media items even though the visual design for the detail page is not included. Without it, the `Play` link cannot satisfy the confirmed behavior.

### 4.2 Media image asset

| Field | Required | Type / allowed values | Notes |
|---|---:|---|---|
| `src` | Yes | URL/path string | Source for the image asset. |
| `width` | Optional | Number | Useful for layout stability when available. |
| `height` | Optional | Number | Useful for layout stability when available. |
| `alt` | Optional | String | May be empty/decorative when title text is visible. |
| `loadingState` | Optional | `loading`, `loaded`, `error` | Used to decide skeleton/fallback state. |

### 4.3 Navigation item

| Field | Required | Type / allowed values | Notes |
|---|---:|---|---|
| `id` | Yes | String | Stable nav identifier. |
| `label` | Yes | String | Accessible label, e.g. `Home`. |
| `href` | Yes | URL/path string | Destination route. |
| `icon` | Yes | Icon reference | Visual icon. |
| `isActive` | Yes | Boolean | Controls active/current state. |

### 4.4 Search state

| Field | Required | Type / allowed values | Notes |
|---|---:|---|---|
| `query` | Yes | String | Current input value. Empty string allowed. |
| `scope` | Yes | `all`, `movies`, `tvSeries`, `bookmarked` | Determines placeholder and searchable content. |
| `placeholder` | Yes | String | Context-aware placeholder. |
| `resultCount` | Conditional | Number | Required when showing search result heading. |
| `isSearching` | Optional | Boolean | May be used if search becomes asynchronous. Visual behavior TBD. |
| `hasSubmitted` | Optional | Boolean | Not required for live search, but may be useful for state decisions. |

### 4.5 Media section

| Field | Required | Type / allowed values | Notes |
|---|---:|---|---|
| `id` | Yes | String | Stable section identifier. |
| `title` | Yes | String | Section heading. |
| `items` | Yes | List of media items | Empty list triggers empty state. |
| `variant` | Yes | `regular`, `trending`, `bookmarked`, `searchResults` | Determines card/layout treatment. |
| `isLoading` | Yes | Boolean | Controls skeleton state. |
| `error` | Optional | Error/message object | Shows error state when content cannot be loaded. |
| `emptyMessage` | Conditional | String | Required when `items` is empty and not loading. |

### 4.6 Section state priority

When multiple section states are technically true, the UI must resolve them in this order:

1. `isLoading = true`: show skeleton/loading state.
2. `error` exists: show the relevant error or fallback state.
3. `items` is empty: show the empty state.
4. `items` has content: show populated content.

This avoids rendering contradictory states, such as an empty state while content is still loading.

### 4.7 Auth form state

| Field | Required | Type / allowed values | Notes |
|---|---:|---|---|
| `mode` | Yes | `login` or `signup` | Controls title, fields, CTA, and secondary link. |
| `email` | Yes | String | Required field. |
| `password` | Yes | String | Required field. |
| `repeatPassword` | Conditional | String | Required for Sign Up only. |
| `errors` | Yes | Field-to-message map | Empty object when no errors. |
| `isSubmitting` | Optional | Boolean | Visual treatment TBD. |
| `submissionError` | Optional | String | Visual treatment TBD. |

### 4.8 Form field

| Field | Required | Type / allowed values | Notes |
|---|---:|---|---|
| `id` | Yes | String | Required to associate label and error text. |
| `label` | Yes | String | Visible placeholder-like label and accessible label. |
| `value` | Yes | String | Current field value. |
| `type` | Yes | `email`, `password`, or `text` | Based on field role. |
| `required` | Yes | Boolean | True for all current auth fields. |
| `errorMessage` | Optional | String | Required when field is invalid. |
| `state` | Yes | `default`, `active`, `filled`, `error` | Visual state. |

---

## 5. Required fields

### Media item required fields

Every media item rendered in a card must include:

- `id`
- `title`
- `year`
- `category`
- `rating`
- `thumbnail`
- `isBookmarked` in the normalized UI model
- `detailHref`

If any required display field is missing, the item should be treated as invalid for that card rather than rendering a broken or misleading card.

[ASSUMPTION] Invalid items should be excluded from the visible grid and reported through development diagnostics later. The current visual design does not define an invalid-card state.

### Auth required fields

Login requires:

- `email`
- `password`

Sign Up requires:

- `email`
- `password`
- `repeatPassword`

All auth fields are required.

### Page required data

Home requires:

- navigation data;
- search state with `scope = all`;
- trending section;
- recommended section.

Movies requires:

- navigation data;
- search state with `scope = movies`;
- media section containing movie items or empty state.

TV Series requires:

- navigation data;
- search state with `scope = tvSeries`;
- media section containing TV-series items or empty state.

Bookmarked requires:

- navigation data;
- search state with `scope = bookmarked`;
- bookmarked movies section;
- bookmarked TV series section.

Search result state requires:

- navigation data;
- active query;
- result count;
- result items or empty state.

---

## 6. Optional fields

Optional fields should enhance the experience without being required for the base UI to render.

| Field | Applies to | Behavior when omitted |
|---|---|---|
| `thumbnailAlt` | Media image | Thumbnail can be treated as decorative if visible title exists. |
| `width` / `height` | Image asset | Layout should still preserve card dimensions through CSS/design rules. |
| `isTrending` | Media item | Defaults to `false`; a parent section can still render an item as trending by section membership. |
| `trendingThumbnail` | Media item | Regular thumbnail may be used if no special trending crop is available. |
| `isSearching` | Search state | Live filtering can appear instantaneous. |
| `submissionError` | Auth state | No submission-level error is shown. |
| `isSubmitting` | Auth state | Button remains in normal enabled/disabled state until loading treatment is defined. |
| `error` | Media section | No content error message is shown unless an error exists. |

---

## 7. Layout rules

### 7.1 Global layout

- The app background must use the main dark background color from `DESIGN.md`.
- Content must align with the navigation pattern for the current viewport.
- The layout must preserve the visual hierarchy: navigation first, search second, content third.
- Content should not be wrapped in additional visual containers unless present in the design.
- Empty states and skeletons must occupy the same content region as the content they replace.

### 7.2 Desktop layout rules

Desktop reference width: `1440px`.

Rules:

- Use a vertical left sidebar.
- Sidebar visual width should follow the design reference of approximately `96px`.
- Sidebar should sit with generous outer offset, approximately `32px` from top and left in the reference design.
- Main content should begin to the right of the sidebar, approximately around the observed `164px` left offset.
- Main content width should remain wide and left-aligned.
- Search appears at the top of the main content region.
- Section content flows vertically below search.
- Regular media cards use a multi-column grid.
- Trending content appears in a horizontal row.

### 7.3 Tablet layout rules

Tablet reference width: `768px`.

Rules:

- Replace sidebar with horizontal top navigation.
- Use side margins close to the observed `24px–25px` range.
- Search sits below top navigation.
- Content grids use a medium-width grid pattern.
- Trending content is horizontally arranged and may scroll horizontally.
- Avoid desktop-style sidebar at tablet width.

### 7.4 Mobile layout rules

Mobile reference width: `375px`.

Rules:

- Use horizontal top navigation.
- Use approximately `24px` horizontal page padding.
- Search sits below top navigation.
- Regular media cards use a compact two-column grid.
- Trending cards remain horizontally scrollable/arranged.
- Pages scroll vertically when content exceeds viewport height.
- Interactive targets must remain comfortable for touch even when the visible icons are small.

### 7.5 Auth layout rules

- Auth screens use the app background.
- Logo sits above the auth card.
- Auth card is centered on desktop and tablet.
- Auth card uses the secondary dark blue surface.
- Auth card should preserve a readable fixed/max width on desktop and tablet.
- On mobile, auth card should use most available width while preserving side margins.
- Submit button spans the auth card content width.

---

## 8. Responsive requirements

The UI must satisfy these reference viewports:

- Mobile: `375px`
- Tablet: `768px`
- Desktop: `1440px`

[ASSUMPTION] Implementation breakpoints may differ from these exact widths if the final behavior matches the design intent.

### Required responsive behavior

| Feature | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navigation | Horizontal top nav | Horizontal top nav | Vertical sidebar |
| Search | Below top nav | Below top nav | Top of main content beside sidebar |
| Trending content | Horizontal row/scroll | Horizontal row/scroll | Horizontal row |
| Regular media grid | Two-column compact grid | Medium grid | Multi-column grid |
| Bookmarked sections | Stacked vertically | Stacked vertically | Stacked vertically in main content |
| Auth card | Mobile-width card | Centered card | Centered card |
| Skeleton state | Preserve mobile card grid | Preserve tablet card grid | Preserve desktop card grid |
| Empty state | Inline with content rhythm | Inline with content rhythm | Inline with content rhythm |

### Responsive constraints

- No content should be clipped unintentionally.
- No global horizontal scrolling should occur except inside the intended trending/highlighted content region.
- Long media titles must not break the card grid.
- Search input must remain usable at all reference widths.
- Navigation icon links must remain tappable on mobile/tablet.
- Search result headings with long queries must wrap or truncate safely without breaking the layout.
- Long titles and metadata strings must not push cards outside their grid columns.

---

## 9. Accessibility requirements

### 9.1 Global accessibility

- All interactive elements must be reachable by keyboard.
- All interactive elements must have visible focus states.
- Focus state must work on dark backgrounds and over thumbnail images.
- Color must not be the only indication of state.
- Reduced-motion preferences must be respected.
- Touch targets should be approximately `44px × 44px` where practical.
- The page should expose clear semantic landmarks for navigation, search, and main content.

[ASSUMPTION] The exact focus ring treatment will be specified during implementation/spec refinement because the examples do not visually define it.

### 9.2 Navigation accessibility

- Icon-only navigation links must have accessible names.
- Current page must be communicated programmatically, not only through white icon color.
- Avatar/profile link must have a meaningful accessible label.
- Navigation order must remain logical:
  - logo/home area;
  - primary navigation links;
  - profile/avatar link.

### 9.3 Search accessibility

- Search input must have an accessible label that matches its current scope.
- Placeholder text must not be the only accessible label.
- Live result updates must be communicated without being disruptive, preferably through a polite result-count announcement or equivalent strategy.
- Empty search result messages must be available to assistive technology.
- Search must remain keyboard usable.

### 9.4 Media card accessibility

- The card title must be exposed as the primary label for the media item.
- Metadata should be read in a logical order: year, category, rating.
- Thumbnail images may be decorative when the title is visible.
- Bookmark controls must include item-specific accessible names:
  - `Add {title} to bookmarks`
  - `Remove {title} from bookmarks`
- Play control must be keyboard reachable and must communicate that it opens/navigates to the media detail page.
- Hover-only overlays must also be available through keyboard focus.
- Bookmark and play controls must remain separate interactive targets. The implementation must avoid nested interactive elements that create ambiguous keyboard or screen-reader behavior.

### 9.5 Forms accessibility

- Each input must have an associated label.
- Required fields must be communicated.
- Error messages must be associated with their fields.
- Error state must not rely on red color alone.
- Password mismatch must be announced as an error state.
- Submit buttons and auth links must be keyboard reachable.

### 9.6 Loading and empty states accessibility

- Skeleton placeholders should not produce noisy repeated screen-reader output.
- Loading regions should communicate loading state at the section level where needed.
- Empty states must be readable as normal text and exposed to assistive technology.
- Loaded content should update clearly after skeleton loading completes.

---

## 10. Interaction behavior

### 10.1 Search behavior

- Search updates live as the user types.
- Search is scoped to the current section context.
- Home searches movies and TV series.
- Movies searches only movie items.
- TV Series searches only TV-series items.
- Bookmarked searches only bookmarked items.
- Empty query shows the default content for the current page.
- Clearing the query returns the current page to its default content state.
- Query with only whitespace should behave like an empty query for matching purposes.
- Query with zero matches shows an empty state message.

[OPEN QUESTION] Exact matching rules are TBD: title-only vs metadata-inclusive, case sensitivity, partial matching, trimming, and diacritic handling.

### 10.2 Navigation behavior

- Selecting Home, Movies, TV Series, or Bookmarked navigates to the matching page.
- Current page uses the active icon state.
- Inactive navigation hover does not require a distinct visual state for now.
- Avatar navigates to a separate page.

[OPEN QUESTION] The exact avatar/profile destination and visual page design are TBD.

### 10.3 Media card behavior

Default state:

- Show thumbnail or skeleton.
- Show bookmark state if available.
- Show metadata and title.

Hover/focus state:

- Show dark thumbnail overlay.
- Show centered `Play` control.
- Preserve bookmark access.

Play action:

- Navigate to the media detail page.

[OPEN QUESTION] Detail page visual design is TBD.

### 10.4 Bookmark behavior

- Bookmarking is only available after authentication.
- Authenticated users can toggle bookmark state from media cards.
- Bookmarked state must persist across Home, Movies, TV Series, Search, and Bookmarked views.
- Bookmarked page groups saved items into Movies and TV Series.
- Empty bookmarked groups show an empty state message.

[ASSUMPTION] If a user is not authenticated, the bookmark control should not change state. Exact logged-out behavior is not visually defined.

### 10.5 Thumbnail loading behavior

- Skeleton state appears while thumbnail loading is pending.
- Skeleton dimensions must match final card dimensions.
- Once the image loads successfully, the thumbnail replaces the skeleton.
- If image loading definitively fails, the skeleton is replaced by a permanent fallback/error treatment and card layout remains intact.

[OPEN QUESTION] Permanent image-failure visual treatment is TBD.

### 10.6 Auth behavior

- Login validates required email and password fields.
- Sign Up validates required email, password, and repeat-password fields.
- Sign Up must support password mismatch error state.
- Field-level errors use red underline and red helper/error copy.
- Primary CTA has red default state and white hover/active state.
- Secondary auth links navigate between Login and Sign Up.

[OPEN QUESTION] Exact auth validation rules are TBD.

[OPEN QUESTION] Auth loading and submission error treatments are TBD.

---

## 11. Edge cases

### 11.1 Content edge cases

| Edge case | Required behavior |
|---|---|
| No search results | Show contextual empty state message. |
| No bookmarked movies | Show empty state for Bookmarked Movies section. |
| No bookmarked TV series | Show empty state for Bookmarked TV Series section. |
| Empty section | Show empty state; do not collapse silently. |
| Missing thumbnail while loading | Show skeleton. |
| Permanent thumbnail failure | Preserve card layout and show fallback/error treatment. Exact visual TBD. |
| Long title | Preserve card layout; title must not break grid. |
| Data title capitalization differs | Display title exactly as provided. |
| Unknown rating text | Display as provided if rating exists. |
| Invalid/missing required media field | Do not render a broken card. |
| Search query has leading/trailing whitespace | [ASSUMPTION] Treat trimmed query as search value for matching, while preserving user input visually if needed. |
| Search query contains only whitespace | Treat as empty query for matching and default-content behavior. |
| Search query is very long | Keep input and result heading usable without causing horizontal overflow. |
| Duplicate media ids | Treat as invalid data because bookmark persistence depends on stable unique ids. |
| Unknown media category | Treat as invalid for the current UI because icon, label, and scoped filtering are undefined. |
| Section is loading and has no items yet | Show skeleton/loading state, not empty state. |
| Section has an error and no items | Show error/fallback state before empty state. |

### 11.2 Interaction edge cases

| Edge case | Required behavior |
|---|---|
| User hovers a thumbnail | Show play overlay. |
| User tabs to a playable card/control | Provide equivalent access to play overlay/action. |
| User activates `Play` | Navigate to detail page. |
| User is not authenticated and bookmark action appears | Must not mutate bookmark state. Exact affordance TBD. |
| User opens Bookmarked while unauthenticated | Behavior is unresolved: redirect, auth prompt, or unavailable state. |
| User toggles bookmark from search results | Updated bookmarked state should be reflected anywhere that item appears. |
| User searches bookmarked content after removing last bookmark | Show bookmarked empty state. |
| User prefers reduced motion | Reduce or remove overlay/skeleton/carousel motion. |

### 11.3 Auth edge cases

| Edge case | Required behavior |
|---|---|
| Empty required email | Show field error. |
| Empty required password | Show field error. |
| Empty repeat password on Sign Up | Show field error. |
| Password mismatch on Sign Up | Show field error. Copy TBD. |
| Auth submission pending | Loading treatment TBD. |
| Auth submission fails | Error treatment TBD. |

---

## 12. Implementation risks to document before planning

These risks do not define implementation architecture, but they must be considered before implementation planning begins:

1. **Nested interactive controls:** media cards contain at least two actions: bookmark and play/detail navigation. Planning must avoid invalid nested button/link structures and ambiguous click areas.
2. **Hover-only UI:** the `Play` overlay is shown visually on hover, but keyboard and touch users need equivalent access.
3. **Live search announcements:** live updates can be disruptive for assistive technology if result changes are announced on every keystroke without control.
4. **State priority conflicts:** loading, error, empty, and populated states must have a deterministic priority to avoid contradictory UI.
5. **Skeleton permanence:** skeletons must not remain forever after an image has definitively failed.
6. **Bookmark authentication:** bookmarking is authenticated, but unauthenticated bookmark affordance and Bookmarked-page behavior are unresolved.
7. **Future destinations:** detail and profile pages are confirmed destinations but their designs are not available, which can affect link contracts and acceptance tests.
8. **Trending mechanics:** the visual design confirms horizontal trending content, but carousel/scroll mechanics are unresolved.
9. **Data normalization:** raw data may omit values such as `isBookmarked`; implementation planning should define a normalized UI model before rendering.
10. **Long data strings:** titles, queries, and ratings are data-driven, so layout must handle longer strings safely.

---

## 13. Non-goals

This specification does not define:

- Component implementation code.
- File/folder structure.
- Framework-specific architecture.
- API endpoints.
- Backend authentication behavior.
- Database shape.
- State management strategy.
- Routing implementation details.
- Media detail page visual design.
- Profile/account page visual design.
- Exact search matching algorithm.
- Final carousel/trending mechanics.
- Exact auth validation rules beyond currently known required fields and password mismatch.
- Final auth loading/submission error treatment.
- Final permanent image-failure design.
- Title capitalization normalization.
- Rich empty-state illustrations.
- Unauthenticated bookmark redirect/prompt behavior until product decision is made.
- Whether search result presentation is implemented as a separate route or an in-page state.

---

## 14. Assumptions

1. [ASSUMPTION] Exact CSS breakpoints may differ from the examples reference widths if behavior matches the design intent.
2. [ASSUMPTION] Empty states are lightweight text states unless future designs introduce richer visuals.
3. [ASSUMPTION] Permanent image-load failure should preserve the card layout and avoid broken image icons.
4. [ASSUMPTION] Focus states will be specified visually during implementation/spec refinement because the current examples does not define them.
5. [ASSUMPTION] Detail and profile/account pages are future routes implied by the current design, but their visual design is out of scope for these examples.
6. [ASSUMPTION] `detailHref` is required for each playable media item so the `Play` affordance can behave as a link.
7. [ASSUMPTION] If unauthenticated bookmark controls are visible, they must not mutate state; exact unauthenticated behavior is TBD.
8. [ASSUMPTION] Search matching should trim leading/trailing whitespace for matching purposes.
9. [ASSUMPTION] Missing optional image metadata such as width/height should not prevent rendering because card dimensions are controlled by the design system.
10. [ASSUMPTION] Search result presentation may be implemented as either a route or an in-page state, as long as scoped live search behavior is preserved.
11. [ASSUMPTION] Section state priority is loading, then error/failure, then empty, then populated content.

---

## 15. Open questions

The following questions remain unresolved and should be answered before implementation planning:

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
11. Should the logo act as a Home link or remain decorative/static?
12. What should happen if an unauthenticated user opens the Bookmarked page?
13. Should there be a section-level content error state for failed media data loading, or only thumbnail-level failure states?

---

## 16. Acceptance criteria

### 16.1 Global acceptance criteria

- The UI matches the visual intent documented in `DESIGN.md`.
- The app uses the dark palette and spacing scale from the design system.
- Product UI typography uses Outfit only.
- Navigation, search, media cards, grids, auth forms, empty states, and skeleton states are all represented in the product specification.
- No implementation architecture or component code is introduced by this spec.
- Loading, error/failure, empty, and populated states have a deterministic priority and do not appear in contradictory combinations.

### 16.2 Responsive acceptance criteria

- At desktop width, navigation is a vertical left sidebar and content appears to its right.
- At tablet and mobile widths, navigation becomes a horizontal top bar.
- At mobile width, regular media cards use a compact two-column grid.
- At tablet width, media cards use a medium grid pattern.
- At desktop width, media cards use a multi-column grid pattern.
- Trending content remains horizontally arranged across viewports.
- Empty, error/fallback, and skeleton states preserve the section layout at all supported viewport sizes.
- No unintended horizontal page scrolling occurs outside the trending/highlighted content region.

### 16.3 Search acceptance criteria

- Search placeholder and accessible label match the current page context.
- Search updates live as the user types.
- Home search covers movies and TV series.
- Movies search covers only movies.
- TV Series search covers only TV series.
- Bookmarked search covers only bookmarked content.
- Empty search results show an empty state message.
- Whitespace-only queries behave like empty queries for matching/default-content behavior.
- Long queries do not cause horizontal overflow in the search input or result heading.
- Search result count follows the pattern `Found {count} results for ‘{query}’` when a query result view is shown.

### 16.4 Media card acceptance criteria

- Every valid media card displays thumbnail/skeleton, year, category, category icon, rating, title, bookmark state, and play affordance.
- Titles are displayed exactly as provided by the data source.
- Hover/focus state exposes the `Play` affordance.
- `Play` behaves as a link to a media detail page.
- Bookmark button shows default, hover/focus, and active states when bookmarking is available.
- Skeleton placeholder remains visible while the thumbnail is loading.
- Successful thumbnail load replaces the skeleton.
- Permanent image failure replaces the skeleton with a fallback/error treatment and does not break the card layout.
- Media cards avoid ambiguous nested interactive controls between bookmark and play/detail actions.

### 16.5 Bookmark acceptance criteria

- Bookmarking is only available after authentication.
- Bookmarked state persists across all screens where the same item appears.
- Bookmarked page separates saved items into Movies and TV Series.
- Empty bookmarked groups show empty state messages.
- Bookmark controls have item-specific accessible labels.
- Unauthenticated bookmark behavior is explicitly treated as unresolved and does not accidentally mutate bookmark state.

### 16.6 Auth acceptance criteria

- Login screen includes email, password, submit button, and Sign Up link.
- Sign Up screen includes email, password, repeat password, submit button, and Login link.
- Required empty fields show the error state.
- Password mismatch on Sign Up shows the error state.
- Field errors are associated with their corresponding inputs.
- Primary CTA uses the red default state and white hover/active state.

### 16.7 Accessibility acceptance criteria

- All links, buttons, inputs, and controls are keyboard reachable.
- Icon-only controls have accessible names.
- Current navigation item is communicated programmatically, not only by color.
- Search input has an accessible label independent of placeholder text.
- Error messages are associated with their fields and do not rely on color alone.
- Play overlay/action is accessible without a mouse.
- Empty states are available to assistive technology.
- Skeleton loading does not create noisy repeated announcements.
- Reduced-motion preferences are respected.
- Touch targets remain comfortable on mobile/tablet.
- Page structure exposes navigation, search, and main content landmarks where applicable.
- Live search updates are communicated without excessive announcements.

---

## 17. Specification summary

This specification converts the current visual design into a product-level technical contract. The Entertainment Web App UI system must support responsive navigation, scoped live search, data-driven media cards, authenticated bookmark behavior, skeleton loading, lightweight empty states, and accessible auth forms.

The main unresolved areas are interaction-detail decisions rather than base layout decisions: trending mechanics, exact auth validation, auth loading/submission states, final empty-state copy, permanent image-failure fallback, unauthenticated bookmark behavior, unauthenticated Bookmarked-page behavior, profile route design, media detail page design, section-level content errors, and exact search matching rules.
