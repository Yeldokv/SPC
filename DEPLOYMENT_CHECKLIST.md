# Netlify Deployment Checklist

Use this checklist to ensure a smooth deployment to Netlify.

## Pre-Deployment

- [ ] Code is committed to a Git repository (GitHub, GitLab, or Bitbucket)
- [ ] All dependencies are listed in `package.json`
- [ ] Database is set up and accessible (PostgreSQL)
- [ ] Environment variables are documented

## Database Setup

- [ ] PostgreSQL database created (Neon, Supabase, Railway, or Render)
- [ ] Database connection string obtained
- [ ] SSL mode enabled in connection string (`?sslmode=require`)
- [ ] Database schema pushed using `npm run db:push`
- [ ] Test database connection locally

## Netlify Configuration

- [ ] `netlify.toml` file is present in root directory
- [ ] `_redirects` file is in `client/public/` directory
- [ ] `_headers` file is in `client/public/` directory
- [ ] Build command is set to `npm run build:netlify`
- [ ] Publish directory is set to `dist/public`
- [ ] Functions directory is set to `netlify/functions`

## Environment Variables (Set in Netlify UI)

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SESSION_SECRET` - Random secret key (generate with `openssl rand -base64 32`)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `NODE_VERSION` - Set to `20`

## Deployment Steps

### Option 1: Netlify CLI

- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Login: `netlify login`
- [ ] Initialize: `netlify init`
- [ ] Deploy: `netlify deploy --prod`

### Option 2: Git Integration

- [ ] Connect repository to Netlify
- [ ] Configure build settings in Netlify UI
- [ ] Add environment variables
- [ ] Trigger deployment

## Post-Deployment Verification

- [ ] Site loads successfully
- [ ] Frontend renders correctly
- [ ] API endpoints respond (test with browser dev tools)
- [ ] Database operations work (create a test report)
- [ ] Map displays correctly
- [ ] Authentication works (if implemented)
- [ ] Check Netlify Function logs for errors
- [ ] Test on mobile devices
- [ ] Verify HTTPS is working

## Performance Checks

- [ ] Static assets are cached (check Network tab)
- [ ] Images load quickly
- [ ] API responses are fast
- [ ] No console errors in browser
- [ ] Lighthouse score is acceptable

## Security Checks

- [ ] Security headers are set (check in Network tab)
- [ ] HTTPS is enforced
- [ ] Environment variables are not exposed in client code
- [ ] Database credentials are secure
- [ ] CORS is configured correctly

## Optional Enhancements

- [ ] Set up custom domain
- [ ] Configure DNS records
- [ ] Enable Netlify Analytics
- [ ] Set up deployment notifications
- [ ] Configure branch deploys for staging
- [ ] Set up preview deployments for PRs

## Troubleshooting

If deployment fails, check:

- [ ] Build logs in Netlify dashboard
- [ ] Function logs for runtime errors
- [ ] Environment variables are set correctly
- [ ] Database is accessible from Netlify
- [ ] Node version matches requirements
- [ ] All dependencies are installed

## Maintenance

- [ ] Monitor Function execution times
- [ ] Review database connection pool usage
- [ ] Check for security updates
- [ ] Monitor error logs regularly
- [ ] Keep dependencies up to date

## Resources

- Netlify Documentation: https://docs.netlify.com
- Deployment Guide: See `NETLIFY_DEPLOYMENT.md`
- Environment Variables: See `.env.netlify.example`
- Support: https://answers.netlify.com
