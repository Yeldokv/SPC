# Quick Start Guide for Netlify Deployment

This is a condensed version of the deployment guide. For full details, see `NETLIFY_DEPLOYMENT.md`.

## 🚀 Quick Deploy (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database

Choose a PostgreSQL provider:
- **Neon** (Recommended): https://neon.tech - Free tier, serverless
- **Supabase**: https://supabase.com - Free tier, extra features
- **Railway**: https://railway.app - Simple setup

Get your connection string and run:
```bash
npm run db:push
```

### 3. Deploy to Netlify

#### Via Netlify UI (Easiest):

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure:
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions`
5. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: Generate with `openssl rand -base64 32`
   - `NODE_ENV`: `production`
   - `NODE_VERSION`: `20`
6. Click "Deploy site"

#### Via Netlify CLI:

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### 4. Verify

Visit your Netlify URL and test:
- ✅ Frontend loads
- ✅ Map displays
- ✅ Can create reports
- ✅ API endpoints work

## 📋 Environment Variables

Set these in Netlify UI (Site settings → Environment variables):

```bash
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
SESSION_SECRET=your-random-secret-key-here
NODE_ENV=production
NODE_VERSION=20
```

## 🔧 Troubleshooting

**Build fails?**
- Check environment variables are set
- Verify Node version is 20
- Review build logs

**API 404 errors?**
- Check Functions directory is `netlify/functions`
- Review Function logs in Netlify dashboard

**Database errors?**
- Verify connection string includes `?sslmode=require`
- Test connection locally first
- Check database allows external connections

## 📚 More Resources

- Full guide: `NETLIFY_DEPLOYMENT.md`
- Checklist: `DEPLOYMENT_CHECKLIST.md`
- Environment template: `.env.netlify.example`

## 🎯 What's Included

Your project now has:

✅ **netlify.toml** - Build and deployment configuration
✅ **netlify/functions/api.ts** - Serverless backend function
✅ **client/public/_redirects** - SPA routing and API redirects
✅ **client/public/_headers** - Security headers and caching
✅ **package.json** - Updated with `build:netlify` script
✅ **serverless-http** - Installed for serverless compatibility

## 🌐 Custom Domain

After deployment, add a custom domain:
1. Go to Site settings → Domain management
2. Add your domain
3. Configure DNS as instructed
4. SSL auto-provisions

---

**Need help?** Check `NETLIFY_DEPLOYMENT.md` for detailed instructions.
