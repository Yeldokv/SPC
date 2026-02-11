# Netlify Deployment Guide

This guide will help you deploy Straystat to Netlify.

## Prerequisites

1. A Netlify account (sign up at https://netlify.com)
2. A PostgreSQL database (recommended: Neon, Supabase, or Railway)
3. Git repository connected to your Netlify account

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

1. Create a PostgreSQL database on your preferred provider
2. Copy the connection string (it should look like: `postgresql://user:password@host:port/database`)
3. Run database migrations:

```bash
npm run db:push
```

## Step 3: Configure Environment Variables in Netlify

Go to your Netlify site settings → Environment variables and add the following:

### Required Variables:

- `DATABASE_URL`: Your PostgreSQL connection string
  - Example: `postgresql://user:password@host.region.provider.com:5432/database?sslmode=require`

- `SESSION_SECRET`: A random secret key for session encryption
  - Generate one using: `openssl rand -base64 32`
  - Example: `your-super-secret-session-key-here`

- `NODE_ENV`: Set to `production`

- `NODE_VERSION`: Set to `20`

### Optional Variables:

- `PORT`: Netlify will set this automatically (default: 8888 for functions)

## Step 4: Deploy to Netlify

### Option A: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize your site:
```bash
netlify init
```

4. Deploy:
```bash
netlify deploy --prod
```

### Option B: Deploy via Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to Netlify Dashboard → "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions`
5. Add environment variables (see Step 3)
6. Click "Deploy site"

## Step 5: Verify Deployment

1. Once deployed, visit your Netlify URL
2. Check that the frontend loads correctly
3. Test API endpoints by creating a report or viewing the map
4. Check Netlify Functions logs for any errors

## Build Configuration

The project includes a `netlify.toml` file with the following configuration:

- **Build command**: Builds the Vite frontend
- **Publish directory**: `dist/public` (where Vite outputs the built files)
- **Functions directory**: `netlify/functions` (serverless API endpoints)
- **Redirects**: API calls are routed to serverless functions, SPA routing is handled

## Database Considerations

### For Production:

1. **Use a managed PostgreSQL service**:
   - [Neon](https://neon.tech) - Serverless PostgreSQL (Free tier available)
   - [Supabase](https://supabase.com) - PostgreSQL with additional features
   - [Railway](https://railway.app) - Simple deployment platform
   - [Render](https://render.com) - PostgreSQL hosting

2. **Enable SSL**: Most providers require SSL connections. Ensure your connection string includes `?sslmode=require`

3. **Connection Pooling**: For serverless functions, consider using connection pooling:
   - Use Supabase's connection pooler
   - Use PgBouncer
   - Use Neon's built-in pooling

### Database Schema

The database schema is managed by Drizzle ORM. The schema is defined in your codebase and can be pushed to the database using:

```bash
npm run db:push
```

## Troubleshooting

### Build Fails

- Check that all environment variables are set correctly
- Verify Node version is set to 20
- Check build logs in Netlify dashboard

### API Endpoints Return 404

- Verify that the Functions directory is set to `netlify/functions`
- Check that redirects are working in `netlify.toml`
- Review Function logs in Netlify dashboard

### Database Connection Errors

- Verify `DATABASE_URL` is correct and includes SSL parameters
- Check that your database allows connections from Netlify's IP ranges
- Test the connection string locally first

### CORS Errors

- The serverless function includes CORS headers
- If issues persist, check browser console for specific errors

## Performance Optimization

1. **Database Connection Pooling**: Use a connection pooler to avoid exhausting database connections
2. **Caching**: Static assets are cached for 1 year (configured in `_headers`)
3. **CDN**: Netlify's global CDN serves your static files
4. **Function Cold Starts**: First request may be slower; subsequent requests are faster

## Security

The deployment includes:

- Security headers (X-Frame-Options, CSP, etc.)
- HTTPS by default (provided by Netlify)
- Environment variables stored securely
- Session encryption with SESSION_SECRET

## Monitoring

Monitor your deployment:

1. **Netlify Analytics**: Enable in site settings for traffic insights
2. **Function Logs**: View in Netlify dashboard → Functions
3. **Database Monitoring**: Use your database provider's monitoring tools

## Custom Domain

To use a custom domain:

1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS records as instructed by Netlify
4. SSL certificate will be automatically provisioned

## Continuous Deployment

With Git integration, every push to your main branch will trigger a new deployment:

1. Push changes to your repository
2. Netlify automatically builds and deploys
3. Preview deployments are created for pull requests

## Support

- Netlify Documentation: https://docs.netlify.com
- Netlify Community: https://answers.netlify.com
- Project Issues: Check your repository's issue tracker
