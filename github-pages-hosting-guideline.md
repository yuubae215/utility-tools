# GitHub Pages Hosting Guide

This guide explains how to host the Design Support Tools Portal using GitHub Pages. GitHub Pages is a free service for hosting static websites.

## Table of Contents

- [GitHub Pages Hosting Guide](#github-pages-hosting-guide)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Cloning the Repository](#cloning-the-repository)
  - [Adding and Committing Files](#adding-and-committing-files)
  - [Enabling GitHub Pages](#enabling-github-pages)
  - [Verifying Your Site](#verifying-your-site)
    - [Index File](#index-file)
  - [Updating Your Site](#updating-your-site)
  - [Troubleshooting](#troubleshooting)
    - [Site Not Displaying](#site-not-displaying)
    - [404 Error](#404-error)
    - [CSS or JavaScript Not Applied](#css-or-javascript-not-applied)
    - [Custom Domain Setup](#custom-domain-setup)
  - [Using GitHub Actions (Optional)](#using-github-actions-optional)

## Prerequisites

- GitHub account
- Git (installed locally)
- Basic command line knowledge

## Cloning the Repository

Clone the project from an existing repository:

```bash
git clone https://github.com/yuubae215/utility-tools.git
cd utility-tools
```

Or, if you're creating a new repository, create a new repository on the GitHub website and execute the following commands:

```bash
git init
git remote add origin https://github.com/yuubae215/utility-tools.git
```

## Adding and Committing Files

1. Create HTML, CSS, and JavaScript files in your local environment.

2. Add the files to the staging area:

```bash
git add .
```

3. Commit the changes:

```bash
git commit -m "Initial file upload"
```

4. Push the changes to the remote repository:

```bash
git push -u origin main
```

Note: The default branch name for new GitHub repositories is `main`. Older repositories might use `master`.

## Enabling GitHub Pages

1. Access your repository page on GitHub (https://github.com/yuubae215/utility-tools).

2. Click on the "Settings" tab at the top of the repository page.

3. Click on "Pages" in the left sidebar.

4. In the "Source" section, select the branch and folder:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`

5. Click the "Save" button.

6. Once the settings are saved, you'll see the URL where your GitHub Pages site will be published:
   ```
   https://yuubae215.github.io/utility-tools/
   ```

## Verifying Your Site

After configuring GitHub Pages, it might take a few minutes for your site to be published. When you see the message "Your site is published at https://yuubae215.github.io/utility-tools/", you can click that link to verify your site.

### Index File

GitHub Pages automatically displays the `index.html` file as the homepage. Make sure you have an `index.html` file in the root directory of your repository.

## Updating Your Site

To update your site, edit the files in your local environment, commit the changes, and push them:

```bash
# After editing files
git add .
git commit -m "Update site"
git push
```

After you push your changes, GitHub Pages will automatically rebuild your site. It might take a few minutes for the updates to appear.

## Troubleshooting

### Site Not Displaying

- Check that GitHub Pages is correctly configured
- Verify that the `index.html` file is in the repository root
- Wait a few minutes and try accessing the site again

### 404 Error

- Verify that file paths and links are correct
- Check that the file name capitalization is correct (GitHub Pages is case-sensitive)

### CSS or JavaScript Not Applied

- Check that link paths are correct
- Make sure you're using relative paths
- Check for errors in the browser's developer tools

### Custom Domain Setup

If you want to use a custom domain, enter the domain name in the "Custom domain" section of the GitHub Pages settings, and set up the appropriate CNAME record with your DNS provider.

1. Enter your domain name in the "Custom domain" field in the GitHub Pages settings
2. Click the "Save" button
3. Add the following CNAME record with your DNS provider:
   - Name: `www` (or subdomain)
   - Value: `yuubae215.github.io`

DNS changes can take up to 24 hours to propagate.

## Using GitHub Actions (Optional)

For more advanced automation, you can set up automatic deployment using GitHub Actions. Here's a basic example:

1. Create a `.github/workflows/deploy.yml` file in the root of your repository:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      # Build steps (if needed)
      # - name: Build
      #   run: npm ci && npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: .  # or 'build' (if using build steps)
```

This workflow will automatically run whenever you push to the `main` branch and deploy your site.

---

By following this guide, you can publish your Design Support Tools Portal on GitHub Pages. If you encounter any issues, please also refer to GitHub's official documentation.