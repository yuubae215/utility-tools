# Design Support Tools Portal - Page Addition Guidelines

This guideline explains how to add new tool pages to the Design Support Tools Portal. Following these guidelines will help maintain consistent design and user experience.

## Table of Contents

- [Design Support Tools Portal - Page Addition Guidelines](#design-support-tools-portal---page-addition-guidelines)
  - [Table of Contents](#table-of-contents)
  - [File Structure](#file-structure)
  - [Creating a New Tool Page](#creating-a-new-tool-page)
  - [Adding to the Landing Page](#adding-to-the-landing-page)
  - [Icons and Colors](#icons-and-colors)
  - [Categories](#categories)
  - [Testing](#testing)

## File Structure

The project file structure is as follows:

```
utility-tools/
├── index.html             # Landing page
├── color-palette.html     # Color palette generation tool
├── layout-tool.html       # Layout design tool
├── size-calculator.html   # Size calculator tool
├── font-pairing.html      # Font pairing tool
└── [your-new-tool].html   # Your new tool page
```

## Creating a New Tool Page

1. **Use a Template**

Create a new file by copying an existing tool page (e.g., `color-palette.html`). The filename should use lowercase English letters with hyphens to represent the functionality.

2. **Maintain the Basic Structure**

Your new tool page should maintain the following basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tool Name - Design Support Tools</title>
    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        /* Style settings */
    </style>
</head>
<body>
    <header>
        <h1>Tool Name</h1>
        <p class="description">Description of this tool...</p>
        <a href="index.html" class="home-link">← Back to Home</a>
    </header>

    <main>
        <!-- Tool content -->
    </main>

    <footer>
        <p>&copy; 2025 Design Support Tools Portal｜<a href="https://github.com/yuubae215/utility-tools">GitHub</a></p>
    </footer>

    <script>
        // JavaScript code
    </script>
</body>
</html>
```

3. **Styling**

To maintain consistency, reuse the basic styles (colors, fonts, button designs, etc.) from existing tool pages. The following variables are commonly used:

```css
:root {
    --primary-color: #3498db;
    --primary-dark: #2980b9;
    --text-color: #2c3e50;
    --text-light: #636e72;
    --bg-color: #f8f9fa;
    --card-color: #fff;
    --shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

4. **"Back to Home" Link**

Include a link to return to the landing page on all tool pages:

```html
<a href="index.html" class="home-link">← Back to Home</a>
```

5. **Footer**

Include the correct GitHub repository link in the footer:

```html
<footer>
    <p>&copy; 2025 Design Support Tools Portal｜<a href="https://github.com/yuubae215/utility-tools">GitHub</a></p>
</footer>
```

## Adding to the Landing Page

After creating a new tool, you need to add it to the landing page (`index.html`).

1. **Add a New Card to `tools-grid`**

Add a new tool card inside the `<div class="tools-grid" id="tools-grid">` in `index.html`:

```html
<!-- New Tool Card -->
<div class="tool-card" data-category="[category]">
    <div class="tool-icon">
        <i class="fas fa-[icon-name]"></i>
    </div>
    <div class="tool-content">
        <h3>[Tool Name]</h3>
        <p>[Tool Description]</p>
        <a href="[filename].html" class="button">Use Tool</a>
    </div>
</div>
```

2. **Add Custom Styles**

If necessary, define the icon background color for your new tool card:

```css
.tool-card:nth-child([number]) .tool-icon {
    background: linear-gradient(135deg, #[color1], #[color2]);
}
```

## Icons and Colors

1. **Selecting Font Awesome Icons**

Choose an appropriate icon from [Font Awesome Icons](https://fontawesome.com/icons). The icon should intuitively represent the tool's functionality.

Examples:
- `fa-palette`: For color-related tools
- `fa-font`: For typography-related tools
- `fa-ruler-combined`: For measurement-related tools
- `fa-th-large`: For layout-related tools

2. **Setting Gradient Colors**

Each tool card should have a unique gradient background color. Recommended color combinations:

- Blue: `#3498db` → `#2980b9`
- Red: `#e74c3c` → `#c0392b`
- Green: `#2ecc71` → `#27ae60`
- Purple: `#9b59b6` → `#8e44ad`
- Yellow: `#f1c40f` → `#f39c12`
- Teal: `#1abc9c` → `#16a085`

## Categories

Assign one of the following categories to each tool:

- `color`: Tools related to colors
- `layout`: Tools related to layout and design composition
- `typography`: Tools related to fonts and text
- `measure`: Tools related to measurement, calculation, and conversion

Set the category in the `data-category` attribute:

```html
<div class="tool-card" data-category="color">
```

## Testing

After adding a new page, test the following:

1. Can you access the new tool page from the landing page?
2. Can you return to the landing page from the new tool page?
3. Does the tool's functionality work correctly?
4. Can the new tool be found using the search function on the landing page?
5. Is the tool properly filtered by the category filter?
6. Does the responsive design work correctly (smartphone, tablet, desktop)?

Following these guidelines will help maintain consistent design and user-friendly experience.