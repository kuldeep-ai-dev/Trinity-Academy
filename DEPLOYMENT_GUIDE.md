# Deployment Guide - Trinity Academy Website

Since the local project is not currently linked to a Git repository, you can deploy the website to Vercel using one of the following methods.

## Recommended: Vercel CLI (Easiest)
1. Open your terminal in the project root: `c:\Users\Kuldeep Choudhury\.gemini\antigravity\scratch\trinity-academy-website`
2. Install Vercel CLI if you haven't: `npm install -g vercel`
3. Link and deploy: `vercel`
4. Follow the prompts (Select "Yes" for default settings).
5. Once complete, you will get a production URL.

## Alternative: GitHub (Best for updates)
1. Initialize a git repo: `git init`
2. Add all files: `git add .`
3. Commit: `git commit -m "Initialize Trinity Academy Website"`
4. Create a new repository on GitHub.
5. Push your code to GitHub.
6. Go to [Vercel Dashboard](https://vercel.com/dashboard).
7. Import the new GitHub repository.
8. Vercel will automatically detect Vite and deploy.

## Configuration Notes
I have already created a `vercel.json` file in your project root. This file is **critical** for making sure the sub-pages (like `/team/teachers`) work when you refresh the page on the live site.

**Project Root**: `c:\Users\Kuldeep Choudhury\.gemini\antigravity\scratch\trinity-academy-website`
