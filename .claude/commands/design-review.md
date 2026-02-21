# Design Review Command

Perform a comprehensive design review of the PromptCraft IO project.

## Tasks

1. **Visual Consistency Audit**
   - Check that all HTML tool pages use the same CSS variable naming conventions (`--primary-color`, `--text-color`, `--bg-color`, `--card-color`, `--border-color`, `--shadow`, `--transition`)
   - Verify dark mode variables are defined in all tool pages
   - Confirm color tokens match the design system values documented in CLAUDE.md

2. **Layout & Responsiveness Check**
   - Verify all pages have a `<meta name="viewport">` tag
   - Check that `max-width` constraints prevent content overflow on large screens
   - Confirm responsive breakpoints at 768px and 480px are handled

3. **Component Consistency**
   - Check that "Back to Home" links use `← Back to Home` text and point to `index.html`
   - Verify footer copyright text format: `&copy; [year] PromptCraft IO｜<a href="...">GitHub</a>`
   - Confirm all tool pages have a `<header>`, `<main>`, and `<footer>`

4. **Branding Consistency**
   - Verify `<title>` tags follow the pattern: `[Tool Name] - PromptCraft IO`
   - Check that `<html lang="en-US">` is set on all pages
   - Confirm Font Awesome is loaded from the same CDN version: `6.1.1`

5. **Identify Design Issues**
   - List any pages with outdated design patterns
   - Flag any hardcoded colors not using CSS variables
   - Note any missing dark mode support

Report findings as a structured list with file names and line numbers.
