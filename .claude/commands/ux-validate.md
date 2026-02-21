# UX Validation Command

Perform UX validation across all HTML tool pages in PromptCraft IO.

## Accessibility Checks

1. **ARIA Attributes**
   - Verify interactive elements have `aria-label` or visible labels
   - Check that icon-only buttons have `aria-label` set
   - Confirm decorative icons have `aria-hidden="true"`
   - Verify toggle buttons use `aria-pressed` attribute
   - Check that grouped controls use `role="group"` with `aria-label`

2. **Semantic HTML**
   - Confirm `<main>` element has `role="main"` attribute
   - Check heading hierarchy (h1 → h2 → h3, no skipping levels)
   - Verify form inputs have associated labels or `aria-label`
   - Confirm links and buttons are semantically appropriate (links for navigation, buttons for actions)

3. **Keyboard Navigation**
   - Check that all interactive elements are focusable
   - Verify focus styles are visible (no `outline: none` without replacement)
   - Confirm modal dialogs trap focus when open

4. **Color & Contrast**
   - Flag any text on colored backgrounds that may fail WCAG AA contrast ratio (4.5:1 for normal text)
   - Check that information is not conveyed by color alone
   - Verify dark mode maintains sufficient contrast

## User Experience Checks

5. **State Persistence**
   - Verify dark mode preference is saved to `localStorage` and restored on page load
   - Check that filter states are maintained when switching between search and category filters

6. **Error Handling & Feedback**
   - Confirm user actions provide visual feedback (loading states, success messages)
   - Check that error messages are descriptive and suggest remediation
   - Verify empty states have helpful guidance text

7. **Mobile UX**
   - Check touch target sizes are at least 44x44px for interactive elements
   - Verify text is readable without zooming (minimum 16px for body text)
   - Confirm no horizontal overflow on mobile viewports

8. **Feature Discoverability**
   - Identify features that are not obvious from the initial UI
   - Check that advanced functionality has appropriate onboarding hints or tooltips

Report all findings with file path, line number, issue description, and recommended fix.
