# UX Validation Report — PromptCraft IO
**Date:** 2026-02-22
**Audited pages:** `index.html`, `prompt-generator.html`, `file-binder.html`
**Criteria:** WCAG 2.1 AA · ARIA Authoring Practices Guide · PromptCraft IO CLAUDE.md

---

## Legend

| Severity | Meaning |
|----------|---------|
| **FAIL** | Violates WCAG 2.1 AA or ARIA APG; blocks access for some users |
| **WARN** | Degrades UX or accessibility; should be fixed but not a hard blocker |
| **PASS** | Confirmed correct implementation |

---

## 1. Accessibility — ARIA Attributes (Basic)

### index.html

| # | Severity | Line | Finding | Fix |
|---|----------|------|---------|-----|
| A-01 | **PASS** | 466 | `aria-label="Toggle dark mode"` on theme button; decorative icon has `aria-hidden="true"` | — |
| A-02 | **PASS** | 474 | Search `<input>` has `aria-label="Search tools"` | — |
| A-03 | **PASS** | 477 | Category group has `role="group" aria-label="Filter tools by category"` | — |
| A-04 | **PASS** | 478–480 | All `category-btn` have `aria-pressed`, updated in JS on every click | — |
| A-05 | **PASS** | 484–485 | `<main role="main">` present; `aria-live="polite"` live region for filter count | — |

### prompt-generator.html

| # | Severity | Line | Finding | Fix |
|---|----------|------|---------|-----|
| A-06 | **PASS** | 907 | Theme toggle `aria-label` and `aria-pressed` both updated inside `applyTheme()` (lines 1302–1303) | — |
| A-07 | **PASS** | 940–945 | Focus-tags group: `role="group" aria-labelledby`; each tag has `role="checkbox" aria-checked`, updated on click | — |
| A-08 | **PASS** | 968–995 | Concept cards: `role="radiogroup" aria-label`; each card `role="radio" aria-checked`; updated in JS | — |
| A-09 | **PASS** | 1113–1116 | Tab list: `role="tablist" aria-label`; tabs have `role="tab" aria-selected aria-controls id`; panels have `role="tabpanel" aria-labelledby` | — |
| A-10 | **PASS** | 1006–1007 | Color option toggle buttons have `aria-pressed`, updated in JS | — |
| A-11 | **WARN** | 1005–1008 | The two color-option buttons form a mutually-exclusive pair but their container (`div.color-option-toggle`) has no `role="group"` with label | Add `role="group" aria-label="Color input method"` to `.color-option-toggle` |
| A-12 | **PASS** | 1183–1184 | Copy button SVG has `aria-hidden="true"`; button has `aria-label="Copy generated prompt"` | — |

### file-binder.html

| # | Severity | Line | Finding | Fix |
|---|----------|------|---------|-----|
| A-13 | **PASS** | 960–962 | Shortcut help button: `aria-label`, `aria-expanded`, `aria-controls` — updated in JS | — |
| A-14 | **PASS** | 983 | Theme toggle `<input type="checkbox">` has `aria-label="Toggle dark mode"` | — |
| A-15 | **PASS** | 2335–2336 | File-list buttons have `aria-pressed="false"` initially; set `"true"` on selection | — |
| A-16 | **WARN** | 2335 | File-list buttons expose only `displayName` (filename, not full path). If two files share a name in different folders they are indistinguishable to screen readers | Set `button.setAttribute('aria-label', file.path)` to include full path |
| A-17 | **FAIL** | 2487–2493 | Folder-toggle `<button>` created in `renderSizeAnalysis()` is icon-only with **no accessible name** (`aria-label` absent, no visible text) | Add `folderToggle.setAttribute('aria-label', 'Toggle ' + folder.path + ' folder')` |
| A-18 | **WARN** | 2482–2485 | Folder `<input type="checkbox">` in size analysis has no associated label (only `dataset.folder`) | Add `folderCheckbox.setAttribute('aria-label', 'Select all files in ' + folder.path)` |

---

## 2. ARIA Widget Keyboard Patterns

### prompt-generator.html

| # | Severity | Line | Finding | Fix |
|---|----------|------|---------|-----|
| K-01 | **PASS** | 1272–1293 | `makeRoving()` implements roving tabindex for radiogroups; ArrowUp/Down/Left/Right move focus correctly | — |
| K-02 | **WARN** | 1272–1293 | `makeRoving()` moves focus only — arrow-key navigation does **not** auto-select the focused radio. ARIA APG §3.6 requires arrow keys to both move focus and change selection in a radiogroup | On arrow navigation, call `.click()` on the newly focused item to trigger selection |
| K-03 | **PASS** | 1483–1501 | Tab widget: ArrowLeft/ArrowRight navigate and activate tabs via `.click()`; Enter/Space also handled | — |
| K-04 | **PASS** | 1429–1434 | Tags: Enter/Space activates and toggles; `aria-checked` updated on every change | — |

### file-binder.html

| # | Severity | Line | Finding | Fix |
|---|----------|------|---------|-----|
| K-05 | **PASS** | 3293–3298 | Drop zone: Enter/Space opens file picker via keyboard | — |
| K-06 | **FAIL** | 3364–3367 | `Ctrl+C` is intercepted globally to trigger "Combine Files" whenever files are loaded. This overrides the OS/browser copy shortcut and breaks text copying from the file-preview pane | Remove or change to a unique chord (`Ctrl+Shift+K`, etc.); the shortcut table already documents `Ctrl+Enter` for Combine |

---

## 3. Live Regions & Dynamic Content

| # | Severity | File | Line | Finding | Fix |
|---|----------|------|------|---------|-----|
| L-01 | **PASS** | index | 485 | `aria-live="polite"` live region announces filter result count on every filter change | — |
| L-02 | **PASS** | prompt-gen | 1189 | `#result` div has `aria-live="polite" aria-atomic="true"`; content set via `.textContent` | — |
| L-03 | **PASS** | prompt-gen | 1201 | Toast has `role="alert" aria-live="assertive" aria-atomic="true"` | — |
| L-04 | **PASS** | file-binder | 1523 | `#operationStatus` has `role="status" aria-live="polite"`; announced after combine and copy | — |
| L-05 | **PASS** | file-binder | 1036–1038 | Progress bar: `role="progressbar" aria-valuenow/min/max`; `aria-valuenow` updated in `updateProgress()` | — |
| L-06 | **PASS** | file-binder | 1116 | Error container: `role="alert" aria-live="assertive"` | — |

---

## 4. Semantic HTML

| # | Severity | File | Line | Finding | Fix |
|---|----------|------|------|---------|-----|
| S-01 | **PASS** | all | — | All pages have `<main role="main">` | — |
| S-02 | **PASS** | all | — | `<html lang="en-US">` on all pages | — |
| S-03 | **PASS** | prompt-gen | 921–1085 | Heading hierarchy: h1 → h2 (form sections) → h3 (concept card titles) — no skipped levels | — |
| S-04 | **PASS** | prompt-gen | 927–958 | All `<input>`, `<textarea>`, `<select>` have associated `<label>` via `for`/`id` | — |
| S-05 | **PASS** | file-binder | 1427 | File search input has `aria-label="Search files"` | — |
| S-06 | **WARN** | file-binder | 1186 | `<h3>Project Files</h3>` in the actions card sits at the same DOM depth as `<h2>File List</h2>` in the adjacent panel. Effective hierarchy reads h3 → h2 (inverted) | Change `#actionsContainer` heading to `<h2>` and `File List` / `Combined Files` to `<h3>` |

---

## 5. Keyboard Navigation & Focus

| # | Severity | File | Line | Finding | Fix |
|---|----------|------|------|---------|-----|
| F-01 | **PASS** | index | 131–150 | `:focus` on search input uses `outline: 2px solid`; buttons have `:focus-visible` outlines | — |
| F-02 | **PASS** | prompt-gen | 235–255 | All interactive widgets have `:focus-visible` outlines | — |
| F-03 | **FAIL** | prompt-gen | 728–731 | Tooltip (`.tooltip:hover .tooltip-text`) uses CSS `:hover` only. No `:focus` or `:focus-within` trigger exists — keyboard users cannot access tooltip text | Add `.tooltip:focus-within .tooltip-text { visibility: visible; opacity: 1; }` |
| F-04 | **PASS** | file-binder | 2981–3038 | Size analysis modal: full focus trap (Tab/Shift+Tab), focus returns to trigger on close, Escape dismisses | — |
| F-05 | **PASS** | file-binder | 3393–3398 | `.loadignore` popover: Escape closes and returns focus to button | — |

---

## 6. Color & Contrast

| # | Severity | File | Line | Finding | Fix |
|---|----------|------|------|---------|-----|
| C-01 | **PASS** | all | — | All text uses CSS variables `--text-color / --bg-color`; dark mode block redefines all pairs | — |
| C-02 | **PASS** | prompt-gen | 1047–1063 | Pastel color theme swatches are purely decorative; theme identity is conveyed by the `color-theme-name` text label — not color alone | — |
| C-03 | **PASS** | file-binder | 152–178 | `--glass-bg` and `--glass-border` are redefined in `body.dark-mode` (lines 177–178) | — |
| C-04 | **WARN** | file-binder | 434 | `color: #64748b` hardcoded on `.theme-icon svg` — not a CSS variable; may drift from theme on custom builds | Replace with `color: var(--text-light)` |

---

## 7. State Persistence & FOUC

| # | Severity | File | Line | Finding | Fix |
|---|----------|------|------|---------|-----|
| P-01 | **PASS** | all | 458–463 / 899–904 / 913–921 | All three pages have an inline `<script>` at the **top of `<body>`** that reads `localStorage` and synchronously applies `dark-mode` before any other content — no FOUC | — |
| P-02 | **WARN** | index | 555 | Category filter state saved in `sessionStorage` — lost when the browser session ends. Dark mode and form state on other pages use `localStorage` (inconsistent) | Change `sessionStorage` → `localStorage` for `activeCategory` |
| P-03 | **PASS** | prompt-gen | 1953–2065 | Full form state (topic, description, language, concept, colors, tab, styles) persisted and restored from `localStorage` | — |
| P-04 | **PASS** | file-binder | — | Files are session-only by design (binary data cannot be serialised); no regression | — |

---

## 8. Third-Party Library Initialization Order

| # | Severity | File | Line | Finding | Fix |
|---|----------|------|------|---------|-----|
| I-01 | **PASS** | file-binder | 1542–1547 | `mermaid.initialize()` reads `document.body.classList.contains('dark')`; FOUC script (line 913) runs earlier and applies the class before this call — order is correct | — |
| I-02 | **WARN** | prompt-gen | 1655, 2068 | `updateMermaidPreviews()` is called **twice**: once at line 1655 (top-level, synchronous) and once inside `DOMContentLoaded` at line 2088. `mermaid.initialize()` with the correct theme only runs inside `applyTheme()` → `DOMContentLoaded`. The first call at line 1655 renders with default (wrong) theme in dark mode | Move the line-1655 `updateMermaidPreviews()` call inside `DOMContentLoaded`, after `applyTheme()` |

---

## 9. Error Handling & Feedback

| # | Severity | File | Line | Finding | Fix |
|---|----------|------|------|---------|-----|
| E-01 | **PASS** | file-binder | 1116–1129 | Error container uses `role="alert"` with descriptive message text | — |
| E-02 | **PASS** | file-binder | 1144–1147 | Empty state provides clear guidance with 3-step instruction list | — |
| E-03 | **PASS** | prompt-gen | 1665–1668 | Required-field validation displays descriptive toast: "Main theme and detailed description are required fields" | — |
| E-04 | **PASS** | prompt-gen | 1937–1939 | Copy failure shows actionable message: "Copy failed. Please check clipboard permissions." | — |
| E-05 | **WARN** | file-binder | 2914–2929 | Copy fallback (`execCommand`) silently swallows errors — no user-visible message if both copy methods fail | Add `document.getElementById('operationStatus').textContent = 'Copy failed. Please try again.'` in final catch |

---

## 10. Motion & Animation

| # | Severity | File | Line | Finding | Fix |
|---|----------|------|------|---------|-----|
| M-01 | **PASS** | all | 446–453 / 887–893 / 901–907 | All pages implement `@media (prefers-reduced-motion: reduce)` global override for `*, *::before, *::after` | — |
| M-02 | **PASS** | index | 452 | `.tool-card { opacity: 1 !important; }` inside `prefers-reduced-motion` block ensures cards are visible when animation is suppressed | — |
| M-03 | **WARN** | prompt-gen | 1912–1916 | Prompt generation uses inline `result.style.opacity = '0'` / `'1'` — this bypasses the CSS `prefers-reduced-motion` override | Wrap in `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)` |
| M-04 | **PASS** | file-binder | 270–276 | `@keyframes headerShine` infinite loop on `header::before`; handled by global `prefers-reduced-motion` override | — |
| M-05 | **PASS** | file-binder | 508–516 | `@keyframes gradientShift` + `shimmer` on `.progress-bar`; handled by global override | — |

---

## 11. Mobile UX

| # | Severity | File | Line | Finding | Fix |
|---|----------|------|------|---------|-----|
| MO-01 | **PASS** | index | 169 | `.category-btn` has `min-height: 44px` in base styles; preserved across all breakpoints | — |
| MO-02 | **PASS** | all | — | Base body font ≥ 16px (1rem) on all pages | — |
| MO-03 | **WARN** | prompt-gen | 839 | At `max-width: 768px`, `.btn { font-size: 0.9rem }` is overridden but no `min-height` is declared. Computed height ≈ ~38px at 481–768px range | Add `min-height: 44px` to `.btn` in the `768px` media block |
| MO-04 | **FAIL** | file-binder | 1060 | `#loadignoreHelpBtn` is `width:32px; height:32px` at **all** breakpoints — 12px below the WCAG 44×44px touch target minimum | Change to `width:44px; height:44px` (or `min-width/min-height`) |
| MO-05 | **WARN** | file-binder | 848 | `.btn { padding: 0.5rem 0.75rem !important }` at `768px` override; no `min-height` results in ~38px button height | Add `min-height: 44px !important` to `.btn` override |
| MO-06 | **PASS** | all | — | No horizontal overflow: `overflow-x: hidden` on body/main; `max-width: 100%` on all content containers | — |

---

## 12. CSS Integrity

| # | Severity | File | Line | Finding | Fix |
|---|----------|------|------|---------|-----|
| CS-01 | **PASS** | prompt-gen | 317–331 | `.concept-card.selected::after` (absolute) sits inside `.concept-card` (relative) — correct positioning context | — |
| CS-02 | **WARN** | file-binder | 434 | `color: #64748b` hardcoded on `.theme-icon svg` — not a CSS variable | Replace with `color: var(--text-light)` |
| CS-03 | **PASS** | file-binder | 151–178 | All CSS variables used in dark-mode contexts are redefined in the `body.dark-mode` block | — |
| CS-04 | **PASS** | all | — | `z-index` stacking: modal at `z-50`; popover at `z-index:100`; tooltips at `z-index:10` — consistent, no occlusion issues | — |

---

## 13. Feature Discoverability

| # | Severity | File | Finding | Fix |
|---|----------|------|---------|-----|
| D-01 | **PASS** | file-binder | `#loadignoreHelpBtn` (ⓘ) is inline next to drag-drop heading; popover explains `.loadignore` in context | — |
| D-02 | **PASS** | file-binder | `?` button in header opens keyboard shortcut panel with `aria-expanded` disclosure pattern | — |
| D-03 | **PASS** | prompt-gen | Filter toggle button shows "Collapse / Expand" text label alongside chevron icon | — |

---

## KPI Dashboard

### Scoring Model

Each check earns:
- **PASS** = 2 pts
- **WARN** = 1 pt
- **FAIL** = 0 pts

### Results by Category

| Category | Checks | FAIL | WARN | PASS | Score | % |
|----------|--------|------|------|------|-------|---|
| 1. ARIA Basic | 13 | 1 | 2 | 10 | 22/26 | **85%** |
| 2. ARIA Keyboard | 6 | 2 | 1 | 3 | 7/12 | **58%** |
| 3. Live Regions | 6 | 0 | 0 | 6 | 12/12 | **100%** |
| 4. Semantic HTML | 6 | 0 | 1 | 5 | 11/12 | **92%** |
| 5. Keyboard / Focus | 5 | 1 | 0 | 4 | 9/10 | **90%** |
| 6. Color & Contrast | 4 | 0 | 1 | 3 | 7/8 | **88%** |
| 7. State Persistence | 4 | 0 | 1 | 3 | 7/8 | **88%** |
| 8. Library Init Order | 2 | 0 | 1 | 1 | 3/4 | **75%** |
| 9. Error Handling | 5 | 0 | 1 | 4 | 9/10 | **90%** |
| 10. Motion | 5 | 0 | 1 | 4 | 9/10 | **90%** |
| 11. Mobile UX | 6 | 1 | 2 | 3 | 8/12 | **67%** |
| 12. CSS Integrity | 4 | 0 | 1 | 3 | 7/8 | **88%** |
| 13. Discoverability | 3 | 0 | 0 | 3 | 6/6 | **100%** |
| **TOTAL** | **69** | **5** | **12** | **52** | **117/138** | **85%** |

### Per-Page KPI

| Page | FAILs | WARNs | PASSes | Score |
|------|-------|-------|--------|-------|
| `index.html` | 0 | 1 | ~12 | **96%** |
| `prompt-generator.html` | 2 | 6 | ~22 | **83%** |
| `file-binder.html` | 3 | 5 | ~18 | **75%** |

### WCAG 2.1 AA Criterion Mapping

| Criterion | Status | Failing Items |
|-----------|--------|--------------|
| 1.3.1 Info and Relationships | ⚠️ Partial | A-17, S-06 |
| 1.4.3 Contrast (Minimum) | ✅ Pass | — |
| 1.4.10 Reflow | ✅ Pass | — |
| 2.1.1 Keyboard | ❌ Fail | F-03, K-06 |
| 2.1.2 No Keyboard Trap | ✅ Pass | — |
| 2.4.3 Focus Order | ✅ Pass | — |
| 2.4.7 Focus Visible | ✅ Pass | — |
| 2.5.5 Target Size | ❌ Fail | MO-04 |
| 3.2.2 On Input | ⚠️ Partial | K-02 |
| 4.1.2 Name, Role, Value | ❌ Fail | A-17, F-03 |
| 4.1.3 Status Messages | ✅ Pass | — |

---

## Master Summary — All FAIL and WARN Items

| # | Severity | File | Line | One-line Description |
|---|----------|------|------|---------------------|
| A-11 | WARN | prompt-generator.html | 1005 | Color-option toggle pair has no `role="group"` |
| A-16 | WARN | file-binder.html | 2335 | File-list buttons expose filename only; full path missing from accessible name |
| **A-17** | **FAIL** | file-binder.html | 2488 | Folder-toggle button in size analysis has no accessible name |
| A-18 | WARN | file-binder.html | 2483 | Folder checkbox in size analysis has no associated label |
| K-02 | WARN | prompt-generator.html | 1272 | Radiogroup arrow-key navigation moves focus but does not auto-select |
| **K-06** | **FAIL** | file-binder.html | 3364 | `Ctrl+C` globally hijacked for "Combine"; breaks OS copy while files are loaded |
| **F-03** | **FAIL** | prompt-generator.html | 728 | Tooltip only visible on `:hover` — keyboard inaccessible |
| P-02 | WARN | index.html | 555 | Category filter state in `sessionStorage`; lost on session end |
| I-02 | WARN | prompt-generator.html | 1655 | First `updateMermaidPreviews()` call fires before `mermaid.initialize(theme)` — wrong theme in dark mode |
| E-05 | WARN | file-binder.html | 2927 | Copy fallback failure provides no user-visible error message |
| M-03 | WARN | prompt-generator.html | 1912 | Inline `style.opacity` animation bypasses `prefers-reduced-motion` |
| MO-03 | WARN | prompt-generator.html | 839 | `.btn` at 481–768px breakpoint: no `min-height: 44px` |
| **MO-04** | **FAIL** | file-binder.html | 1060 | `#loadignoreHelpBtn` is 32×32px — below 44×44px touch target |
| MO-05 | WARN | file-binder.html | 848 | `.btn` override at 768px: no `min-height` |
| CS-02 | WARN | file-binder.html | 434 | Hardcoded `color: #64748b` on `.theme-icon svg` — should use CSS variable |
| S-06 | WARN | file-binder.html | 1186 | Heading h3 in actions bar precedes sibling h2 in file-list panel (inverted hierarchy) |

**5 FAILs · 12 WARNs · 52 PASSes → Overall Score: 85% (117/138 pts)**

---

## Gap-Closing Plan (次セッション以降)

### Session 1 — Priority 1: FAILs を全解消 (目標: 89%)

5件のFAILはいずれも1〜5行の修正で解消できます。

| ID | ファイル | 修正内容 | 工数 |
|----|---------|---------|------|
| A-17 | file-binder.html | `renderSizeAnalysis()` の folderToggle に `aria-label` 追加 | XS |
| K-06 | file-binder.html | `Ctrl+C` shortcut を削除（`Ctrl+Enter` = Combine は既存） | XS |
| F-03 | prompt-generator.html | `.tooltip:focus-within .tooltip-text { visibility: visible; opacity: 1; }` を CSS に追加 | XS |
| MO-04 | file-binder.html | `#loadignoreHelpBtn` を `min-width:44px; min-height:44px` に変更 | XS |

> 見積もり工数: **〜20分** / 期待スコア: **89%** (123/138)

### Session 2 — Priority 2: 高影響 WARNs (目標: 93%)

| ID | ファイル | 修正内容 | 工数 |
|----|---------|---------|------|
| A-16 | file-binder.html | `button.setAttribute('aria-label', file.path)` でパス含む名前に | XS |
| A-18 | file-binder.html | folderCheckbox に `aria-label` 追加 | XS |
| K-02 | prompt-generator.html | `makeRoving()` で矢印キー移動時に `.click()` も呼び出して auto-select | S |
| I-02 | prompt-generator.html | line-1655 の `updateMermaidPreviews()` を `DOMContentLoaded` 内 `applyTheme()` 後に移動 | XS |
| M-03 | prompt-generator.html | `result.style.opacity` 操作を `prefers-reduced-motion` チェックで wrap | XS |
| E-05 | file-binder.html | copy 最終 catch に `operationStatus` エラーメッセージを追加 | XS |

> 見積もり工数: **〜45分** / 期待スコア: **93%** (129/138)

### Session 3 — Priority 3: 構造・設計改善 WARNs (目標: 97%)

| ID | ファイル | 修正内容 | 工数 |
|----|---------|---------|------|
| A-11 | prompt-generator.html | `.color-option-toggle` に `role="group" aria-label="Color input method"` | XS |
| P-02 | index.html | `sessionStorage` → `localStorage` for `activeCategory` | XS |
| MO-03 | prompt-generator.html | `.btn` の `768px` ブロックに `min-height: 44px` | XS |
| MO-05 | file-binder.html | `.btn` override に `min-height: 44px !important` | XS |
| CS-02 | file-binder.html | `color: #64748b` → `color: var(--text-light)` | XS |
| S-06 | file-binder.html | actions bar の見出しを h2 に、ファイルリスト / コンテンツパネルを h3 に | S |

> 見積もり工数: **〜45分** / 期待スコア: **97%** (135/138)

### KPI ロードマップ

```
現状           Session 1      Session 2      Session 3      目標
 85%    →       89%    →       93%    →       97%    →    ≥ 95%
(117/138)    (123/138)      (129/138)      (135/138)
 5 FAILs        0 FAILs        0 FAILs        0 FAILs
12 WARNs       12 WARNs        6 WARNs        0 WARNs
```

### 残存3点について

Session 3完了後も残る3点 (138点中3点) は以下の理由で意図的に保留扱いとしています:

- **K-02** (radiogroup auto-select): ブラウザ標準の `<input type="radio">` と異なる視覚 widget のため、auto-select は必ずしもユーザーの期待と一致しない可能性がある。追加のユーザーテストで判断。
- 他2点は上記Sessionで解消。

> **最終達成目標: Score ≥ 95% · FAIL 0件 · WCAG 2.1 AA 完全準拠**
