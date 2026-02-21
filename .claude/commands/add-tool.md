# Add New Tool Command

Add a new tool to the PromptCraft IO portal. Follow this checklist to ensure consistency.

## Usage

Run this command with the tool details: `/add-tool`

Then provide:
- Tool name (e.g., "Color Palette Generator")
- Tool filename (e.g., `color-palette.html`)
- Category: one of `utility`, `layout`, `typography`
- Brief description (1-2 sentences)
- Font Awesome icon class (e.g., `fa-palette`)
- Gradient colors (start and end hex values)

## Steps

1. **Create the tool HTML file** from the template below
2. **Add the tool card** to `index.html` in the `#tools-grid` div
3. **Add gradient styles** for the new card's nth-child index in `index.html`
4. **Run design-review** to confirm consistency
5. **Run ux-validate** to confirm accessibility

## Tool Page Template

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Tool Name] - PromptCraft IO</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
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
            --space-xs: 0.25rem;
            --space-sm: 0.5rem;
            --space-md: 1rem;
            --space-lg: 1.5rem;
            --space-xl: 2rem;
            --space-2xl: 3rem;
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

        /* Add your tool-specific styles here */
    </style>
</head>
<body>
    <header>
        <button id="theme-toggle" title="Toggle dark mode" aria-label="Toggle dark mode">
            <i class="fas fa-moon" aria-hidden="true"></i>
        </button>
        <h1>[Tool Name]</h1>
        <p class="description">[Brief description of this tool]</p>
        <a href="index.html" class="home-link">← Back to Home</a>
    </header>

    <main role="main">
        <!-- Tool content here -->
    </main>

    <footer>
        <p>&copy; 2025 PromptCraft IO｜<a href="https://github.com/yuubae215/utility-tools">GitHub</a></p>
    </footer>

    <script>
        // Dark mode with localStorage persistence
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('i');

        function applyTheme(isDark) {
            if (isDark) {
                document.body.classList.add('dark-mode');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                document.body.classList.remove('dark-mode');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }

        applyTheme(localStorage.getItem('theme') === 'dark');

        themeToggle.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('dark-mode');
            applyTheme(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Tool-specific JavaScript here
    </script>
</body>
</html>
```

## Tool Card Template (for index.html)

```html
<!-- [Tool Name] -->
<div class="tool-card" data-category="[category]">
    <div class="tool-icon">
        <i class="fas fa-[icon-name]" aria-hidden="true"></i>
    </div>
    <div class="tool-content">
        <h3>[Tool Name]</h3>
        <p>[Tool description]</p>
        <a href="[filename].html" class="button">Use Tool</a>
    </div>
</div>
```

## Gradient Colors Reference

- Blue: `#3498db` → `#2980b9` (File Binder)
- Red: `#e74c3c` → `#c0392b` (Prompt Generator)
- Green: `#2ecc71` → `#27ae60`
- Purple: `#9b59b6` → `#8e44ad`
- Yellow: `#f1c40f` → `#f39c12`
- Teal: `#1abc9c` → `#16a085`
- Orange: `#e67e22` → `#d35400`
