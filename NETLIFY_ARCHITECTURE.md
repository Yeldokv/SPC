# Netlify Architecture Overview

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                     https://your-site.netlify.app               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      NETLIFY CDN (Global)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Static Assets (Cached)                      │  │
│  │  • HTML, CSS, JavaScript                                 │  │
│  │  • Images, Fonts                                         │  │
│  │  • Built from: dist/public/                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ Routing
                              │
              ┌───────────────┴───────────────┐
              │                               │
              │ /api/*                        │ /* (SPA routes)
              │                               │
┌─────────────▼──────────────┐   ┌───────────▼────────────────┐
│  NETLIFY FUNCTIONS         │   │   React SPA                │
│  (Serverless Backend)      │   │   (Client-side routing)    │
│                            │   │                            │
│  • Express API             │   │  • Wouter router           │
│  • Routes from server/     │   │  • React components        │
│  • Wrapped by              │   │  • Leaflet maps            │
│    serverless-http         │   │  • TailwindCSS             │
│                            │   │                            │
│  Endpoints:                │   │  Routes:                   │
│  • GET  /api/reports       │   │  • /                       │
│  • POST /api/reports       │   │  • /map                    │
│  • GET  /api/zones         │   │  • /analytics              │
│  • POST /api/zones         │   │  • /reports                │
│  • GET  /api/analytics     │   │  • etc.                    │
└────────────┬───────────────┘   └────────────────────────────┘
             │
             │ Database queries
             │
┌────────────▼───────────────┐
│   PostgreSQL Database      │
│   (External Service)       │
│                            │
│  Providers:                │
│  • Neon (recommended)      │
│  • Supabase                │
│  • Railway                 │
│  • Render                  │
│                            │
│  Tables:                   │
│  • reports                 │
│  • zones                   │
│  • interventions           │
│  • users (future)          │
│  • local_bodies (future)   │
└────────────────────────────┘
```

## 🔄 Request Flow

### Static Asset Request (e.g., `/`, `/map`, `/assets/logo.png`)

```
User Browser
    │
    ├─→ Request: GET https://your-site.netlify.app/map
    │
    ▼
Netlify CDN
    │
    ├─→ Check _redirects file
    │   └─→ Match: /* → /index.html
    │
    ├─→ Serve: dist/public/index.html (cached)
    │
    ▼
User Browser
    │
    ├─→ React app loads
    │   └─→ Wouter router handles /map route
    │       └─→ Renders Map component
    │
    ▼
Map Component Displayed
```

### API Request (e.g., Fetch reports)

```
User Browser (React App)
    │
    ├─→ Request: GET https://your-site.netlify.app/api/reports
    │
    ▼
Netlify CDN
    │
    ├─→ Check _redirects file
    │   └─→ Match: /api/* → /.netlify/functions/api/:splat
    │
    ▼
Netlify Function (api.ts)
    │
    ├─→ Initialize Express app (if cold start)
    │   └─→ Register routes from server/routes.ts
    │
    ├─→ Route: GET /api/reports
    │   └─→ Call: storage.getReports()
    │
    ▼
PostgreSQL Database
    │
    ├─→ Execute: SELECT * FROM reports
    │
    ▼
Netlify Function
    │
    ├─→ Return: JSON response
    │
    ▼
User Browser
    │
    └─→ Display reports in UI
```

## 📦 Build Process

```
Local Development
    │
    ├─→ npm run build:netlify
    │
    ▼
Vite Build
    │
    ├─→ Bundle React app
    ├─→ Optimize assets
    ├─→ Generate chunks
    │
    ▼
Output: dist/public/
    │
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    ├── _redirects
    └── _headers

Netlify Functions
    │
    ├─→ Detect: netlify/functions/api.ts
    ├─→ Bundle with dependencies
    │
    ▼
Output: .netlify/functions/
    │
    └── api.js (bundled)
```

## 🌐 Deployment Flow

```
Git Repository (GitHub/GitLab/Bitbucket)
    │
    ├─→ Push to main branch
    │
    ▼
Netlify Build System
    │
    ├─→ Clone repository
    ├─→ Install dependencies (npm install)
    ├─→ Run build command (npm run build:netlify)
    ├─→ Bundle functions
    │
    ▼
Netlify CDN
    │
    ├─→ Deploy static files to CDN
    ├─→ Deploy functions to serverless platform
    ├─→ Configure redirects and headers
    │
    ▼
Live Site
    │
    └─→ https://your-site.netlify.app
```

## 🔐 Environment Variables Flow

```
Netlify UI
    │
    ├─→ Set environment variables:
    │   • DATABASE_URL
    │   • SESSION_SECRET
    │   • NODE_ENV
    │
    ▼
Build Time
    │
    ├─→ Available to build process
    │   (Not embedded in client code)
    │
    ▼
Runtime (Functions Only)
    │
    ├─→ Available via process.env
    │   └─→ Used by server/db.ts
    │       └─→ Connect to PostgreSQL
    │
    ▼
Database Connection Established
```

## 📊 Performance Characteristics

### Cold Start (First request after idle)
```
Request → Function Init (500-1000ms) → Database Query → Response
Total: ~1-2 seconds
```

### Warm Request (Subsequent requests)
```
Request → Function Execute → Database Query → Response
Total: ~100-300ms
```

### Static Assets
```
Request → CDN (cached) → Response
Total: ~50-100ms (global CDN)
```

## 🔧 Configuration Files

```
netlify.toml
    │
    ├─→ Build settings
    ├─→ Publish directory
    ├─→ Functions directory
    ├─→ Redirects (backup)
    └─→ Headers (backup)

client/public/_redirects
    │
    └─→ Primary routing rules

client/public/_headers
    │
    └─→ Security and caching headers

netlify/functions/api.ts
    │
    └─→ Serverless function entry point
```

## 🎯 Key Benefits

1. **Serverless**: No server management, auto-scaling
2. **Global CDN**: Fast loading worldwide
3. **Auto-deployment**: Git push → Live site
4. **HTTPS**: Free SSL certificate
5. **Preview Deploys**: Test PRs before merging
6. **Rollback**: Easy rollback to previous versions
7. **Environment Variables**: Secure secret management
8. **Function Logs**: Debug serverless functions
9. **Analytics**: Built-in traffic insights
10. **Custom Domains**: Easy domain setup

## 🚀 Scaling

- **Static Assets**: Unlimited bandwidth via CDN
- **Functions**: Auto-scale based on traffic
- **Database**: Scale independently (choose provider tier)
- **Concurrent Requests**: Netlify handles automatically

## 💰 Cost Considerations

**Netlify Free Tier:**
- 100GB bandwidth/month
- 125K function requests/month
- 100 hours function runtime/month

**Database:**
- Neon: Free tier with 0.5GB storage
- Supabase: Free tier with 500MB storage
- Railway: $5/month for starter

**Typical Usage:**
- Small app: Free tier sufficient
- Medium app: ~$5-20/month (database + Netlify)
- Large app: Scale as needed

---

This architecture provides a modern, scalable, and cost-effective deployment solution!
