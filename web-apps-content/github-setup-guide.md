# GitHub Setup Guide

## Overview

This guide walks you through setting up GitHub for version control and connecting it to your Next.js project. GitHub is essential for collaboration, deployment, and maintaining your codebase.

**Current Documentation**: [docs.github.com](https://docs.github.com)

## Prerequisites

- A GitHub account (free tier is sufficient)
- Git installed on your computer
- A Next.js project ready to version control

## Step 1: Create GitHub Account

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Enter your email and create a password
4. Verify your email address
5. Complete profile setup (optional)

## Step 2: Install Git

### Windows
1. Download from [git-scm.com](https://git-scm.com/download/win)
2. Run installer with default options
3. Verify installation:
   ```bash
   git --version
   ```

### macOS
```bash
# Using Homebrew
brew install git

# Or download from git-scm.com
```

### Linux
```bash
sudo apt-get update
sudo apt-get install git
```

## Step 3: Configure Git

Set your identity (required for commits):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Verify configuration:
```bash
git config --list
```

## Step 4: Initialize Git in Your Project

Navigate to your Next.js project directory:

```bash
cd my-app
git init
```

This creates a `.git` folder (hidden) that tracks your repository.

## Step 5: Create .gitignore

Create `.gitignore` in your project root:

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build
dist

# Production
*.log
npm-debug.log*

# Environment variables
.env
.env*.local
.env.production

# Vercel
.vercel

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

## Step 6: Make Your First Commit

1. Stage all files:
   ```bash
   git add .
   ```

2. Create initial commit:
   ```bash
   git commit -m "Initial commit: Next.js project setup"
   ```

3. Verify commit:
   ```bash
   git log
   ```

## Step 7: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `my-saas-app` (or your project name)
3. Description: "My SaaS landing page"
4. Visibility:
   - **Public**: Anyone can see (free)
   - **Private**: Only you (requires paid plan or free for students)
5. **Don't** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 8: Connect Local to GitHub

GitHub will show you commands. Use these:

```bash
# Add remote repository
git remote add origin https://github.com/yourusername/my-saas-app.git

# Rename default branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

**Note**: You may be prompted for credentials. Use a Personal Access Token (see Step 9).

## Step 9: Set Up Authentication

### Option A: Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: "My Development Token"
4. Select scopes:
   - `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. Use token as password when pushing/pulling

### Option B: SSH Keys

1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

2. Add to SSH agent:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. Copy public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. Add to GitHub:
   - Settings → SSH and GPG keys → New SSH key
   - Paste your public key
   - Click "Add SSH key"

5. Update remote URL:
   ```bash
   git remote set-url origin git@github.com:yourusername/my-saas-app.git
   ```

## Step 10: Basic Git Workflow

### Daily Workflow

1. **Check status**:
   ```bash
   git status
   ```

2. **Stage changes**:
   ```bash
   git add .
   # Or specific files:
   git add app/page.tsx
   ```

3. **Commit changes**:
   ```bash
   git commit -m "Add payment page"
   ```

4. **Push to GitHub**:
   ```bash
   git push
   ```

### Good Commit Messages

- Be descriptive: "Add Stripe payment integration"
- Use present tense: "Fix login bug" not "Fixed login bug"
- Keep it concise: One line summary, details in body if needed

Example:
```bash
git commit -m "Add Stripe payment integration

- Implement payment form component
- Add API route for payment intent
- Create success/error pages
- Add environment variable configuration"
```

## Step 11: Branching (Optional but Recommended)

Create a branch for new features:

```bash
# Create and switch to new branch
git checkout -b feature/payment-integration

# Make changes, commit
git add .
git commit -m "Add payment feature"

# Push branch to GitHub
git push -u origin feature/payment-integration

# Switch back to main
git checkout main

# Merge branch (after review)
git merge feature/payment-integration
```

## Step 12: Connect to Vercel

GitHub integration makes Vercel deployment automatic:

1. In Vercel, import your GitHub repository
2. Vercel will automatically deploy on every push to `main`
3. Preview deployments created for pull requests

## Common Commands

```bash
git status              # Check what's changed
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub
git pull                # Pull latest changes
git log                 # View commit history
git diff                # See changes
git branch              # List branches
git checkout branch     # Switch branches
```

## Troubleshooting

### "Repository not found"
- Check repository name is correct
- Verify you have access (private repos require authentication)
- Ensure remote URL is correct: `git remote -v`

### "Authentication failed"
- Use Personal Access Token instead of password
- Check token has correct permissions
- Verify SSH key is added to GitHub (if using SSH)

### "Merge conflicts"
1. Pull latest: `git pull`
2. Resolve conflicts in files
3. Stage resolved files: `git add .`
4. Complete merge: `git commit`

## Best Practices

1. **Commit often**: Small, frequent commits are better
2. **Write clear messages**: Future you will thank you
3. **Don't commit secrets**: Use `.gitignore` for `.env` files
4. **Use branches**: Keep main branch stable
5. **Pull before push**: Always sync with remote first

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [GitHub Learning Lab](https://lab.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## AI Assistance

**Using GitHub Copilot**:
- Auto-complete commit messages
- Suggest code improvements
- Help resolve merge conflicts

**Using ChatGPT**:
- Explain Git concepts
- Help write commit messages
- Debug Git errors

---

**Your code is now safely version controlled!** Every change is tracked and you can always revert if needed.
