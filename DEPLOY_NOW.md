# Quick Netlify Deployment

## ⚠️ Important Note

**Netlify cannot host your Express backend.** You have two options:

## Option A: Render (Recommended - Easiest)

Deploy everything to Render in one click:

1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Select this repository
5. Use these settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Add Environment Variable**:
     - Key: `DATABASE_URL`
     - Value: `postgresql://postgres:yeldonoelsahalanimalyip@db.lvmqjlborcoofywjsoao.supabase.co:5432/postgres`
6. Click "Create Web Service"

✅ Done! Your app will be live in ~5 minutes.

## Option B: Split Deployment (Advanced)

### Backend on Render:
1. Deploy backend to Render (see Option A)
2. Copy your Render URL (e.g., `https://straystat.onrender.com`)

### Frontend on Netlify:
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select this repository
4. Use these settings:
   - **Build Command**: `npm run build:client`
   - **Publish directory**: `dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: Your Render backend URL
6. Click "Deploy site"

## Which Should I Choose?

- **Choose Render** if you want simplicity (one deployment, everything works)
- **Choose Netlify** if you specifically need Netlify for the frontend

## After Deployment

Your app will be live at:
- **Render**: `https://your-app-name.onrender.com`
- **Netlify**: `https://your-site-name.netlify.app`

### First-time setup:
1. Visit your deployed URL
2. Click "Admin Access"
3. Login with: `admin` / `admin`
4. Start managing reports!

## Free Tier Limits

Both services offer generous free tiers:
- **Render**: 750 hours/month (enough for 24/7 uptime)
- **Netlify**: 100GB bandwidth/month
- **Supabase**: 500MB database

Perfect for demos and small projects!
