# StrayStat - Netlify Deployment Guide

## ⚠️ Important: Backend Hosting Consideration

**Netlify is designed for static sites and serverless functions.** Your StrayStat application has:
- ✅ React frontend (perfect for Netlify)
- ❌ Express server with WebSocket support (not ideal for Netlify)

## Recommended Deployment Architecture

### Option 1: Split Deployment (Recommended)
- **Frontend**: Deploy to Netlify
- **Backend**: Deploy to Render, Railway, or Heroku

### Option 2: Full-Stack on Render/Railway
- Deploy both frontend and backend together
- Simpler setup, single deployment

## Option 1: Netlify Frontend + Render Backend

### Step 1: Deploy Backend to Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `straystat-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     DATABASE_URL=your_supabase_connection_string
     NODE_ENV=production
     ```

5. Click "Create Web Service"
6. Copy your backend URL (e.g., `https://straystat-api.onrender.com`)

### Step 2: Deploy Frontend to Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Build command**: `npm run build:client`
   - **Publish directory**: `dist/public`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://straystat-api.onrender.com
     ```

5. Click "Deploy site"

### Step 3: Update Code for Split Deployment

You'll need to update the API calls to use the environment variable.

## Option 2: Deploy Everything to Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `straystat`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     DATABASE_URL=your_supabase_connection_string
     NODE_ENV=production
     PORT=10000
     ```

5. Click "Create Web Service"

## Quick Setup for Netlify (Frontend Only)

If you want to quickly deploy just the frontend to Netlify:

1. **Add build script** to `package.json`:
   ```json
   "build:client": "vite build"
   ```

2. **Create `.env.production`**:
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Push to GitHub**

4. **Connect to Netlify** and deploy

## Environment Variables Needed

### For Backend (Render/Railway/Heroku):
- `DATABASE_URL` - Your Supabase connection string
- `NODE_ENV` - Set to `production`
- `SESSION_SECRET` - Random secret for sessions

### For Frontend (Netlify):
- `VITE_API_URL` - Your backend API URL

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Database migrations applied (`npm run db:push`)
- [ ] Frontend can connect to backend API
- [ ] Admin login works
- [ ] User registration/login works
- [ ] Image upload works
- [ ] Map displays correctly

## Troubleshooting

### CORS Issues
If you get CORS errors, add this to `server/index.ts`:
```typescript
import cors from 'cors';
app.use(cors({
  origin: 'https://your-netlify-site.netlify.app',
  credentials: true
}));
```

### Database Connection
Ensure your Supabase database allows connections from:
- Render IPs (if using Render)
- Railway IPs (if using Railway)

## Cost Estimate

- **Netlify**: Free tier (100GB bandwidth)
- **Render**: Free tier (750 hours/month)
- **Supabase**: Free tier (500MB database)

**Total**: $0/month for hobby projects!

## Need Help?

Check the deployment logs:
- Netlify: Site Settings → Deploys → Deploy log
- Render: Your service → Logs tab
