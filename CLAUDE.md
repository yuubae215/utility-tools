# CLAUDE.md — PromptCraft IO

This file provides context for Claude Code when working on this repository.

## Project Overview

**PromptCraft IO** is a browser-based toolkit for crafting and controlling LLM (Large Language Model) prompts and outputs. All tools run entirely in the browser with no build step, no backend, and no installation required. The project is hosted on GitHub Pages.

**Live site:** https://yuubae215.github.io/utility-tools/

### Tools

| File | Name | Category | Description |
|------|------|----------|-------------|
| `index.html` | Portal | — | Landing page with tool discovery, search, and category filter |
| `file-binder.html` | File Binder | utility | Combines multiple files/folders into a single Markdown document for LLM context |
| `prompt-generator.html` | Layout & Style Prompt Generator | typography | Generates design instruction prompts for LLM-generated content |

## Tech Stack

- **Vanilla HTML/CSS/JS** — no frameworks, no build tools
- **CSS custom properties** — design token system for theming and dark mode
- **Font Awesome 6.1.1** — icon library (CDN)
- **Tailwind CSS** — utility classes (CDN, used in file-binder.html)
- **Mermaid.js 10.2.2** — diagram generation (CDN)
- **Highlight.js 11.8.0** — syntax highlighting (CDN)
- **FileSaver.js 2.0.5** — file download (CDN)
- **GitHub Actions + JamesIves/github-pages-deploy-action** — CI/CD to `gh-pages` branch

## Design System

### CSS Variables

All tool pages must define these variables in `:root` and `body.dark-mode`:

```css
:root {
    --primary-color: #3498db;
    --primary-dark: #2980b9;
    --primary-light: #EEF2FF;
    --accent-color: #e74c3c;
    --secondary-color: #12B981;
    --text-color: #2c3e50;
    --text-light: #636e72;
    --text-primary: #2c3e50;
    --text-secondary: #636e72;
    --text-tertiary: #9CA3AF;
    --bg-color: #f8fafc;
    --card-color: #fff;
    --surface-color: #F9FAFB;
    --border-color: #E5E7EB;
    --border-radius: 12px;
    --shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --hover-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    --transition: all 0.3s ease;
    --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --space-xs: 0.25rem;  --space-sm: 0.5rem;
    --space-md: 1rem;     --space-lg: 1.5rem;
    --space-xl: 2rem;     --space-2xl: 3rem;
}

body.dark-mode {
    --primary-color: #5dade2;
    --primary-dark: #3498db;
    --primary-light: #2d3748;
    --accent-color: #e76f51;
    --text-color: #ecf0f1;
    --text-light: #bdc3c7;
    --text-primary: #ecf0f1;
    --text-secondary: #bdc3c7;
    --text-tertiary: #a0aec0;
    --bg-color: #1a202c;
    --card-color: #2d3748;
    --surface-color: #2d3748;
    --border-color: #4a5568;
    --shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    --hover-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}
```

### Tool Card Gradient Colors

Each tool card in `index.html` has a unique gradient. When adding a new tool, pick an unused color:

- Blue: `#3498db` → `#2980b9` *(File Binder)*
- Red: `#e74c3c` → `#c0392b` *(Prompt Generator)*
- Green: `#2ecc71` → `#27ae60`
- Purple: `#9b59b6` → `#8e44ad`
- Yellow: `#f1c40f` → `#f39c12`
- Teal: `#1abc9c` → `#16a085`
- Orange: `#e67e22` → `#d35400`

## Conventions

### HTML Structure

Every tool page must include:

```html
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Tool Name] - PromptCraft IO</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
</head>
<body>
    <header>
        <button id="theme-toggle" aria-label="Toggle dark mode">
            <i class="fas fa-moon" aria-hidden="true"></i>
        </button>
        <h1>[Tool Name]</h1>
        <a href="index.html">← Back to Home</a>
    </header>
    <main role="main"><!-- content --></main>
    <footer>
        <p>&copy; 2025 PromptCraft IO｜<a href="https://github.com/yuubae215/utility-tools">GitHub</a></p>
    </footer>
</body>
```

### Dark Mode Pattern

All pages must persist theme preference to `localStorage`:

```js
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    themeIcon.classList.toggle('fa-sun', isDark);
    themeIcon.classList.toggle('fa-moon', !isDark);
}

applyTheme(localStorage.getItem('theme') === 'dark');

themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
```

### Tool Categories

Use only these category values in `data-category` attributes:

- `utility` — general-purpose tools (file handling, data processing)
- `layout` — layout and design composition tools
- `typography` — font, text, and prompt generation tools

### Accessibility Requirements

- Icon-only buttons: must have `aria-label`
- Decorative icons: must have `aria-hidden="true"`
- Toggle/filter buttons: must use `aria-pressed`
- Filter groups: must have `role="group"` and `aria-label`
- Search inputs: must have `aria-label`
- `<main>`: must have `role="main"`

## Custom Slash Commands

The `.claude/commands/` directory contains reusable slash commands:

| Command | File | Purpose |
|---------|------|---------|
| `/design-review` | `design-review.md` | Audit visual consistency, branding, and design system compliance across all HTML files |
| `/ux-validate` | `ux-validate.md` | Check accessibility, state persistence, error handling, and mobile UX |
| `/add-tool` | `add-tool.md` | Step-by-step guide and templates for adding a new tool to the portal |

## Development Workflow

### Running Locally

```bash
# Python
python -m http.server 8080

# Node.js
npx live-server
```

Then open http://localhost:8080 in your browser.

### Testing Checklist (before committing)

- [ ] Tool is reachable from `index.html`
- [ ] "← Back to Home" link works
- [ ] Dark mode toggle works and persists on page reload
- [ ] Category filter and search work together (not independently)
- [ ] Responsive layout works at 480px, 768px, and 1200px widths
- [ ] No new hardcoded colors (use CSS variables)
- [ ] All new interactive elements have appropriate `aria-*` attributes

### Deployment

Push to `main` branch — GitHub Actions automatically deploys to `gh-pages`. The workflow is in `.github/workflows/deploy.yml`.

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Portal landing page |
| `file-binder.html` | File Binder tool (~3100 lines) |
| `prompt-generator.html` | Prompt Generator tool |
| `add-pages-guideline.md` | Guide for contributors adding new tools |
| `github-pages-hosting-guideline.md` | GitHub Pages deployment guide |
| `.github/workflows/deploy.yml` | CI/CD workflow |
| `.claude/commands/` | Custom Claude Code slash commands |
| `.loadignore.example` | Sample ignore pattern file for File Binder |
