# Fix GitHub Push Authentication

## Option 1: Create Personal Access Token (Recommended)

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name it: `kigali-property-link`
4. Select expiration: **90 days** (or your preference)
5. Check the **`repo`** scope (full control of private repositories)
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)

## Option 2: Use Token in GitHub Desktop

1. In GitHub Desktop, go to **File → Options → Git**
2. Make sure Git is configured
3. Try pushing again - it should prompt for credentials
4. When asked for password, **paste your Personal Access Token** (not your GitHub password)

## Option 3: Check Repository Exists

1. Go to: https://github.com/YVES10BOBO/kigali-property-link
2. If it doesn't exist, create it:
   - Go to: https://github.com/new
   - Repository name: `kigali-property-link`
   - **Don't** initialize with README
   - Click "Create repository"

## Option 4: Try Again Later

Sometimes it's a temporary network issue. Wait a few minutes and try again.

