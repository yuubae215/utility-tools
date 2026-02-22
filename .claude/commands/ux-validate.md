# UX Validation Command

Perform UX validation across all HTML tool pages in PromptCraft IO.

Read every `.html` file in the project root before reporting. For each check, inspect both the HTML structure and the JavaScript that manages it.

---

## Accessibility Checks

### 1. ARIA Attributes — Basic

- Verify interactive elements have `aria-label` or associated visible text
- Icon-only buttons must have `aria-label`
- Decorative icons and SVGs must have `aria-hidden="true"` — also check SVGs rendered via JavaScript (e.g., `innerHTML = getFileIcon(...)`)
- Toggle buttons (`aria-pressed`) must be updated in JS when state changes — not just set in HTML
- Grouped controls must use `role="group"` with `aria-label`
- `aria-expanded` on disclosure buttons must be toggled in JS on every open/close

### 2. ARIA Widget Keyboard Patterns

Check widgets against ARIA Authoring Practices Guide patterns:

- **Radiogroup pattern** (`role="radiogroup"` → `role="radio"`): Tab moves focus *into* the group; `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight` navigate *within* it using roving tabindex (`tabindex="0"` on selected, `tabindex="-1"` on others). Verify JS handles arrow keys — not just `Enter`/`Space`.
- **Tab panel pattern** (`role="tablist"` → `role="tab"` → `role="tabpanel"`): Arrow keys navigate between tabs; Tab moves into panel content. Verify `aria-selected`, `aria-controls`, `aria-labelledby`.
- **Custom interactive divs with `tabindex="0"`**: Must declare their role (`role="button"`, `role="listitem"`, etc.). A focusable `div` with keyboard Enter/Space activation must have `role="button"`.
- **Checkboxes and toggle items**: Verify `aria-checked` is updated in JS whenever state changes.
- **Selected/active state in lists**: When a list item becomes "active" (e.g., selected file), verify `aria-pressed="true"` or `aria-selected="true"` is set on the element.

### 3. Live Regions & Dynamic Content

- `role="alert"` / `aria-live="assertive"`: Used for errors and urgent notifications only
- `aria-live="polite"`: Used for non-urgent updates such as filter result counts, generated prompt completion, file processing completion
- After async operations (file loading, prompt generation, copy-to-clipboard), verify a live region announces the outcome — not just a visual change
- **Progress bars**: Must have `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes; `aria-valuenow` must be updated in JS as progress changes

### 4. Semantic HTML

- `<main>` must have `role="main"`
- Heading hierarchy must not skip levels (h1 → h2 → h3); verify across all visible and hidden sections
- **Heading level vs. visual prominence**: Elements styled like section headers but marked as lower-level headings should be checked — e.g., an h3 at the same section depth as an h2 is a hierarchy error
- Form inputs must have associated `<label>` elements (via `for`/`id` or wrapping) or `aria-label`
- Navigation links vs. action buttons: `<a href>` for navigation, `<button>` for actions — not interchangeable

### 5. Keyboard Navigation

- All interactive elements must be focusable (natively or via `tabindex="0"`)
- Focus styles must be visible — check for `outline: none` without a replacement focus indicator
- **Modal dialogs**: Must trap focus (Tab and Shift+Tab stay within the dialog), return focus to the trigger element on close, and be closeable via `Escape`
- **Popovers with `role="dialog"`**: Same focus-trap rules apply even for small info popovers — if `role="dialog"` is declared, focus management is required
- **Tooltips**: CSS `:hover`-only tooltips are not keyboard-accessible. Must also trigger on `:focus` or `:focus-within`

### 6. Color & Contrast

- Text on colored backgrounds: check WCAG AA (4.5:1 for normal text, 3:1 for large text ≥18pt or ≥14pt bold)
- Hardcoded color values (not CSS variables) on dark-mode surfaces: verify contrast still holds
- Information must not be conveyed by color alone (e.g., active state needs more than background-color change)
- Dark mode variables: verify `--text-*` and `--bg-*` pairs maintain sufficient contrast

---

## User Experience Checks

### 7. State Persistence

- Dark mode preference: saved to `localStorage`, restored on load before DOM is painted (prevents flash of unstyled content)
  - **FOUC check**: Look for an inline `<script>` at the top of `<body>` that reads `localStorage` and applies the dark class synchronously, before stylesheets or deferred scripts run
- Filter/search states: check that both are applied together (not independently overriding each other)
- Form input states: significant form data should survive page reload via `localStorage`
- **Category/filter integrity**: Every filter option must have at least one matching content item. A filter button that always returns zero results is a broken UX pattern — flag it

### 8. Third-Party Library Initialization Order

- Libraries initialized at script-parse time (not in `DOMContentLoaded`) must not depend on DOM state that hasn't been applied yet
- Example: if `mermaid.initialize({ theme: document.body.classList.contains('dark-mode') ? 'dark' : 'default' })` runs before the inline FOUC script has applied `dark-mode`, the theme will be wrong
- **Check**: For each library initialized at top level, verify the CSS classes or DOM attributes it depends on are already present at that point in the load sequence

### 9. Error Handling & Feedback

- User actions (combine, copy, download, generate) must provide clear visual AND screen-reader-accessible feedback
- Error messages must be descriptive and actionable (not just "Error" or "Failed")
- Empty states must have helpful guidance text explaining what to do next
- Validation failures (missing required fields) must be announced via live region or `role="alert"` — not just visually highlighted

### 10. Motion & Animation

- All CSS animations and transitions must be suppressed or reduced when `prefers-reduced-motion: reduce` is set
- Check for `@media (prefers-reduced-motion: reduce)` overrides, especially for:
  - Entry animations that start at `opacity: 0` (elements invisible until animation runs — critical if animation is skipped)
  - Infinite looping animations (shimmer, float, pulse, headerShine, gradientShift)
  - Transform-based transitions on hover/focus
- Recommended global override:
  ```css
  @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
      }
  }
  ```
- Entry animations using `animation-fill-mode: forwards` on elements starting at `opacity: 0`: if motion is disabled and the animation is skipped, the element stays invisible. Verify elements are visible without animation.

### 11. Mobile UX

- Touch targets must be at least 44×44px **at every breakpoint** — not just the smallest one
  - Check each `@media` block independently; a `min-height: 44px` added only at `max-width: 480px` does not protect the `481px–768px` range
- Body text must be at least 16px (1rem)
- No horizontal overflow at 480px, 768px, and 1200px viewport widths
- Interactive elements should not be so close together that adjacent targets are accidentally triggered on touch

### 12. CSS Integrity

- `position: absolute` elements must have a `position: relative` (or other positioning context) ancestor within their expected visual container — check by tracing the DOM tree upward from the absolutely-positioned element
- CSS variables used in `body.dark-mode` overrides: verify every variable used in dark-mode contexts is re-defined in the `body.dark-mode` block
- Verify `z-index` stacking for overlays and modals is consistent and doesn't cause unintended occlusion

### 13. Feature Discoverability

- Hidden or collapsed sections should have visible affordances (chevrons, counts, labels)
- Advanced features (e.g., `.loadignore`, filter patterns) should have in-context explanations or links
- Tooltips on action buttons must be keyboard-accessible (see check 5)

---

## Reporting Format

Use the following severity levels:

| Level | Meaning |
|-------|---------|
| **FAIL** | Violation of WCAG 2.1 AA or ARIA authoring practices; blocks access for some users |
| **WARN** | Degrades UX or accessibility; should be fixed but not a hard blocker |
| **PASS** | Confirmed correct implementation — briefly note what was verified |

For each finding include:
- Severity (`FAIL` / `WARN` / `PASS`)
- File path and line number
- Issue description
- Recommended fix (with code example if helpful)

End the report with a **summary table** listing all FAIL and WARN items with severity, file, line, and one-line description.
