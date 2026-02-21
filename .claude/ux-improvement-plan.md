# UX Improvement Plan — PromptCraft IO

**Baseline date:** 2026-02-21
**Source:** `/ux-validate` audit results
**Target persona:** Power LLM user — wants frictionless, efficient prompt crafting across sessions

---

## 1. KPI Framework

Six KPIs map directly to the eight ux-validate check categories. Each KPI has a unit, a measurement method, a current baseline, and a target.

| # | KPI | Unit | Measurement method |
|---|-----|------|--------------------|
| K1 | **ARIA Coverage Rate** | % | (interactive elements with `aria-label` or visible label + decorative icons with `aria-hidden`) / total interactive elements + decorative icons, per page |
| K2 | **Keyboard Accessibility Rate** | % | Tab-reachable interactive elements / total interactive elements, per page |
| K3 | **State Persistence Rate** | pages / 3 | Tools where dark-mode AND filter state survive a page reload |
| K4 | **Focus Visibility Score** | violations | Count of `outline: none` without an accessible replacement |
| K5 | **Mobile Core-Flow Completion** | % | Primary user workflows completable on a 375 px touch device without drag-and-drop |
| K6 | **Feature Discoverability Score** | % | Documented UX affordances / total implemented affordances (keyboard shortcuts, tooltips, ignore-file support) |

---

## 2. Baseline Measurement (Current State)

### K1 — ARIA Coverage Rate

Audit method: `grep -c 'aria-'` per file; manual count of interactive/decorative elements.

| Page | Interactive elements | aria-covered | Decorative icons | aria-hidden | K1 score |
|------|---------------------|-------------|-----------------|-------------|----------|
| `index.html` | 9 | 9 | 2 | 2 | **100%** ✅ |
| `prompt-generator.html` | 30 (6 buttons + 24 interactive divs) | 0 | 3 | 0 | **0%** ❌ |
| `file-binder.html` | 16+ buttons + dropzone + modal | 0 | 10+ SVGs | 0 | **0%** ❌ |

**Portfolio average: 33%**

---

### K2 — Keyboard Accessibility Rate

Audit method: manual tab-order check; count of elements with `tabindex≥0` or native focusability.

| Page | Focusable via Tab | Total interactive | K2 score |
|------|------------------|-------------------|----------|
| `index.html` | 9 (all buttons, link, input) | 9 | **100%** ✅ |
| `prompt-generator.html` | 6 (buttons only; 24 div-widgets unreachable) | 30 | **20%** ❌ |
| `file-binder.html` | 14 (buttons with native focus; dropzone excluded) | 17 | **82%** ⚠️ |

**Portfolio average: 67%**

---

### K3 — State Persistence Rate

Audit method: `grep -c 'localStorage'` per file; manual verification of read+write symmetry.

| Page | `localStorage` calls | Dark mode persists | Filter state persists |
|------|---------------------|-------------------|----------------------|
| `index.html` | 3 | ✅ yes | ✅ yes (in-memory, same session) |
| `prompt-generator.html` | **0** | ❌ resets on reload | n/a |
| `file-binder.html` | **0** | ❌ defaults to dark | n/a |

**K3 = 1 / 3 pages (33%)** ❌

---

### K4 — Focus Visibility Score (lower = better)

Audit method: `grep -n 'outline: none'` per file; check if a visible replacement exists.

| Page | `outline: none` occurrences | Accessible replacement | Violations |
|------|----------------------------|----------------------|------------|
| `index.html` | 1 | `box-shadow` (visible but not HC-mode safe) | **1** ⚠️ |
| `prompt-generator.html` | 1 | `box-shadow` at 10% opacity (effectively invisible) | **1** ❌ |
| `file-binder.html` | 0 (uses `focus:ring-2`) | ✅ Tailwind ring | **0** ✅ |

**K4 = 2 violations** (target: 0)

---

### K5 — Mobile Core-Flow Completion

Primary workflows: (A) bind files → view output → copy/download; (B) generate prompt → copy.

| Page | Workflow | Mobile-completable | Blocker |
|------|----------|--------------------|---------|
| `file-binder.html` | (A) bind files | **0%** ❌ | Drag-only; no click-to-upload |
| `prompt-generator.html` | (B) generate prompt | **100%** ✅ | Functional but de-marketed by "desktop recommended" banner |
| `index.html` | Tool discovery | **100%** ✅ | — |

**K5 = 1 / 2 primary workflows = 50%** ❌

---

### K6 — Feature Discoverability Score

| Implemented affordance | Documented in UI | Score |
|------------------------|-----------------|-------|
| Keyboard shortcut Ctrl+C (combine) | ❌ | 0 |
| Keyboard shortcut Ctrl+D (download) | ❌ | 0 |
| Keyboard shortcut Escape (close modal) | ❌ | 0 |
| `.loadignore` / `loadignore.txt` file support | ✅ (dropzone badge + download hint) | 1 |
| Ignore pattern comments with `#` | ✅ (hint text, line 1036) | 1 |
| Color theme → Mermaid preview live update | ❌ (no hint; users may not discover) | 0 |
| Output language selection | ✅ (labelled dropdown) | 1 |

**K6 = 3 / 7 affordances = 43%** ⚠️

---

## 3. Gap Analysis

| KPI | Baseline | Target | Gap | Priority |
|-----|---------|--------|-----|----------|
| K1 ARIA Coverage | 33% | 100% | **−67 pp** | P1 |
| K2 Keyboard Accessibility | 67% | 100% | **−33 pp** | P1 |
| K3 State Persistence | 33% | 100% | **−67 pp** | P1 |
| K4 Focus Violations | 2 violations | 0 | **−2** | P2 |
| K5 Mobile Completion | 50% | 100% | **−50 pp** | P2 |
| K6 Discoverability | 43% | 80% | **−37 pp** | P3 |

> **pp** = percentage points

---

## 4. Acceptance Criteria (Definition of Done per KPI)

### K1 ✅ when:
- Every `<button>`, `<a>`, `<input>`, `<select>`, `<label>` has either a visible text label OR `aria-label`
- Every decorative `<i>`, `<svg>`, or icon element has `aria-hidden="true"` (or a meaningful `<title>` for informative SVGs)
- Toggle buttons have `aria-pressed` updated dynamically
- Grouped controls have `role="group"` + `aria-label`
- Tab widget uses `role="tablist"` / `role="tab"` / `role="tabpanel"` + `aria-selected`

Measured by: automated check — `grep` count of `aria-` ≥ count of interactive+decorative elements.

---

### K2 ✅ when:
- All interactive `<div>`/`<span>` widgets have `tabindex="0"` AND respond to Enter/Space keydown
- The drop zone (`#dropZone`) is reachable by Tab and activates a file picker on Enter/Space
- The Size Analysis modal traps focus (Tab cycles only within modal while open)
- Focus order is logical (top-to-bottom, left-to-right)

Measured by: manual tab-walk through each page; every interactive control is reached in ≤ N Tab presses from page load, where N ≤ total interactive element count.

---

### K3 ✅ when:
- `localStorage.setItem('theme', ...)` is called on every theme toggle in all three pages
- `localStorage.getItem('theme')` is called on `DOMContentLoaded` in all three pages
- If no stored value, the system's `prefers-color-scheme` media query is the default
- `file-binder.html` checkbox initial `checked` state is driven by the stored value, not hardcoded

Measured by: open page → toggle dark mode → hard-reload → theme matches the last setting.

---

### K4 ✅ when:
- No `outline: none` or `outline: 0` without a replacement that:
  - Is visible in Windows High Contrast Mode (use `outline`, not only `box-shadow`)
  - Has a minimum 3:1 contrast ratio against the adjacent background (WCAG 2.1 SC 1.4.11)
- Recommended pattern: `outline: 2px solid var(--primary-color); outline-offset: 2px;`

Measured by: `grep -rn 'outline: none\|outline:none\|outline: 0'` returns 0 results without a paired accessible override.

---

### K5 ✅ when:
- `file-binder.html` presents a visible "Select files" `<button>` that triggers `<input type="file">` on all viewport widths
- The "For a better experience, desktop viewing is recommended" banner is removed or replaced with actionable guidance
- All touch targets (buttons, tags, cards, tabs) have a minimum rendered height and width of 44 px

Measured by: Chrome DevTools mobile emulation at 375 px — complete workflow A (upload → combine → copy) end-to-end without drag-and-drop.

---

### K6 ✅ when:
- Keyboard shortcuts are shown in `title` attributes of the relevant action buttons (e.g., `title="Combine files (Ctrl+C)"`)
- A collapsible "Tips" or "?" section in `file-binder.html` lists shortcuts
- The live Mermaid preview update behavior in `prompt-generator.html` is hinted (e.g., "Preview updates as you change options")

Measured by: a first-time user can discover all 7 affordances within 2 minutes without reading external documentation.

---

## 5. Implementation Roadmap

### Sprint 1 — P1: Correctness and Core Access (K1, K2, K3)
*Estimated scope: ~150 lines of HTML/JS changes across 3 files*

| Task | File | Issue IDs | KPI |
|------|------|-----------|-----|
| Add `localStorage` read/write for theme in both tools | `prompt-generator.html`, `file-binder.html` | C-1 | K3 |
| Fix `file-binder.html` checkbox to read from localStorage | `file-binder.html` | C-1 | K3 |
| Add `aria-label` and `aria-hidden` to all file-binder buttons and SVGs | `file-binder.html` | H-1 | K1 |
| Add `tabindex="0"` + role + keydown to all interactive divs in prompt-generator | `prompt-generator.html` | H-2 | K2 |
| Add `aria-label` to prompt-generator theme toggle; `aria-hidden` to icon | `prompt-generator.html` | H-3 | K1 |
| Fix lang attribute on both tools to `en-US` | `file-binder.html`, `prompt-generator.html` | M-5 | K1 |
| Add `aria-hidden="true"` to decorative icons in index + prompt-generator | `index.html`, `prompt-generator.html` | M-1 | K1 |
| Add tab widget ARIA (`role="tablist"`, `role="tab"`, `role="tabpanel"`) | `prompt-generator.html` | H-2 | K1, K2 |

**Sprint 1 exit criterion:** K1 ≥ 90%, K2 ≥ 95%, K3 = 100% (3/3 pages)

---

### Sprint 2 — P2: Focus and Mobile (K4, K5)
*Estimated scope: ~80 lines of CSS + ~60 lines of HTML/JS*

| Task | File | Issue IDs | KPI |
|------|------|-----------|-----|
| Replace `outline: none` with `outline: 2px solid var(--primary-color); outline-offset: 2px` | `index.html`, `prompt-generator.html` | H-5 | K4 |
| Add hidden `<input type="file">` + click handler to drop zone | `file-binder.html` | C-2 | K5 |
| Add `tabindex="0"` + Enter/Space keydown to `#dropZone` | `file-binder.html` | C-2 | K2, K5 |
| Implement focus trap in Size Analysis modal | `file-binder.html` | M-4 | K2 |
| Remove or replace "desktop recommended" banner | `prompt-generator.html` | M-7 | K5 |
| Audit and fix touch target sizes (min 44×44 px) for tags, cards, tabs | `prompt-generator.html` | (mobile) | K5 |
| Fix `h1` to show tool name in prompt-generator | `prompt-generator.html` | M-2 | (semantic) |

**Sprint 2 exit criterion:** K4 = 0 violations; K5 = 100% (2/2 workflows)

---

### Sprint 3 — P3: Polish and Discoverability (K6)
*Estimated scope: ~50 lines across 2 files*

| Task | File | Issue IDs | KPI |
|------|------|-----------|-----|
| Add keyboard shortcuts to button `title` attributes | `file-binder.html` | M-6 | K6 |
| Add empty-state "No tools found" message to tools grid | `index.html` | M-3 | K6 |
| Add `--transition-fast` variable to prompt-generator | `prompt-generator.html` | H-4 | (bug fix) |
| Fix `copy-status` parent to `position: relative` | `prompt-generator.html` | L-3 | (bug fix) |
| Add live-update hint text near Mermaid preview | `prompt-generator.html` | M-6 | K6 |
| Align Font Awesome version to 6.4.0 across all pages | all | L-2 | (consistency) |
| Fix duplicate Mermaid initialization on load | `prompt-generator.html` | L-1 | (bug fix) |

**Sprint 3 exit criterion:** K6 ≥ 80% (≥ 6/7 affordances documented)

---

## 6. Measurement Dashboard (to track after each sprint)

```
KPI            Baseline  Sprint1  Sprint2  Sprint3  Target
─────────────────────────────────────────────────────────
K1 ARIA %         33%      90%      95%      100%    100%
K2 Keyboard %     67%      95%      100%     100%    100%
K3 Persist pages   1/3     3/3      3/3      3/3     3/3
K4 Focus violations  2       2        0        0       0
K5 Mobile flows   50%      50%      100%     100%    100%
K6 Discoverability 43%     50%       57%      86%     80%
```

---

## 7. Regression Guard

Add the following to the `/ux-validate` command's checklist as automated checks after each sprint:

```bash
# K3: confirm localStorage used in all tool pages
grep -rL 'localStorage' file-binder.html prompt-generator.html
# Expected: no output (both files contain localStorage)

# K4: no unguarded outline:none
grep -rn 'outline: none\|outline:0\|outline: 0' *.html
# Expected: no output

# K1: no unguarded aria-hidden-less icons
grep -rn 'class="fas\|class="fab' *.html | grep -v 'aria-hidden'
# Expected: no output
```

These commands can be added to a pre-commit hook or a CI step to prevent regressions.
