---
description: How to build and deploy the React application
---

# Build and Deploy Workflow

This guide explains how to prepare your application for production and deploy it to a remote server.

## 1. Build the Application

Before deploying, you must create a production-ready build. This compiles your code, optimizes assets, and generates the static files needed for hosting.

1.  Open your terminal.
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  This will create a `dist` directory in your project root containing:
    - `index.html`
    - `assets/` (JavaScript, CSS, Images)

## 2. Deployment Options

### Option A: Modern Static Hosting (Recommended)
Services like **Netlify**, **Vercel**, or **GitHub Pages** are easiest for React apps.

**Netlify / Vercel (Drag & Drop):**
1.  Run `npm run build` locally.
2.  Log in to [Netlify](https://app.netlify.com) or [Vercel](https://vercel.com).
3.  Drag and drop the `dist` folder onto their dashboard.
4.  Your site will be live instantly.

**Netlify / Vercel (Git Integration):**
1.  Push your code to GitHub/GitLab/Bitbucket.
2.  Connect your repository in the Netlify/Vercel dashboard.
3.  Set the build command to `npm run build` and publish directory to `dist`.
4.  Every push will automatically deploy.

### Option B: Traditional Web Server (Apache/Nginx/IIS)
If you have a VPS or shared hosting (e.g., via FTP/cPanel):

1.  Run `npm run build` locally.
2.  Connect to your server using FTP (FileZilla) or SCP.
3.  Upload the **contents** of the `dist` folder (not the folder itself, but the files inside) to your server's public root directory (often `public_html`, `www`, or `/var/www/html`).
4.  **Important for Routing:**
    Since this is a Single Page Application (SPA), you need to configure your server to redirect all requests to `index.html` so that React Router can handle the navigation.
    
    **For Apache (.htaccess):**
    Create a `.htaccess` file in the same directory:
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```

    **For Nginx:**
    Update your server block configuration:
    ```nginx
    location / {
      try_files $uri $uri/ /index.html;
    }
    ```

## 3. Verification
1.  Visit your live URL.
2.  Navigate through the app (Dashboard -> Transactions -> Categories) to ensure routing works.
3.  Reload the page on a sub-route (e.g., `/transactions`) to verify the server configuration (if using Option B).
