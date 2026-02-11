# Digital Stray Dog Mapping & Management System

A comprehensive web application for mapping, tracking, and managing stray dog populations with role-based access control for government operations.

## 🌟 Features

- **Interactive Map**: Real-time visualization of stray dog reports using Leaflet
- **Report Management**: Submit and track stray dog sightings with photos and descriptions
- **Zone Management**: Define and monitor high-risk areas
- **Intervention Tracking**: Record ABC (Animal Birth Control) and vaccination activities
- **Analytics Dashboard**: Comprehensive statistics and insights
- **Role-Based Access**: Multi-level authentication system for citizens, officials, and admins
- **Mobile Responsive**: Works seamlessly on all devices

## 🚀 Quick Start

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database**
   ```bash
   npm run db:push
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5000
   ```

### Netlify Deployment

**⭐ Ready to deploy to Netlify!**

See **[QUICK_START_NETLIFY.md](./QUICK_START_NETLIFY.md)** for 5-minute deployment guide.

Full deployment documentation:
- 📖 [Netlify Deployment Guide](./NETLIFY_DEPLOYMENT.md)
- ✅ [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- 🏗️ [Architecture Overview](./NETLIFY_ARCHITECTURE.md)
- 📋 [Setup Summary](./NETLIFY_SETUP_SUMMARY.md)

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/               # React components and pages
│   ├── public/            # Static assets
│   └── index.html         # HTML entry point
├── server/                # Backend Express API
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                # Shared types and schemas
├── netlify/               # Netlify serverless functions
│   └── functions/
│       └── api.ts         # Serverless API wrapper
├── netlify.toml           # Netlify configuration
└── package.json           # Dependencies and scripts
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Leaflet** - Interactive maps
- **React Query** - Data fetching
- **Wouter** - Routing
- **Radix UI** - Component primitives
- **Recharts** - Data visualization

### Backend
- **Express** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database toolkit
- **Passport** - Authentication
- **Zod** - Schema validation

### Deployment
- **Netlify** - Hosting and serverless functions
- **Vite** - Build tool
- **serverless-http** - Serverless adapter

## 📊 Database Schema

- **reports** - Stray dog sighting reports
- **zones** - High-risk area definitions
- **interventions** - ABC/vaccination activities
- **users** - User accounts (future)
- **local_bodies** - Government jurisdictions (future)

## 🔐 Authentication & Authorization

The system implements a hierarchical role-based access control (RBAC) model:

1. **Citizen User** - Submit reports, view public map
2. **Local Body Official** - Manage reports in jurisdiction
3. **District Admin** - Monitor multiple local bodies
4. **System Admin** - Full system access

See [attached_assets/requirements.txt](./attached_assets/Pasted-You-are-continuing-work-on-an-existing-Digital-Stray-Do_1770126705513.txt) for detailed requirements.

## 🌐 Deployment

### Netlify (Recommended)

This project is fully configured for Netlify deployment:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify init
netlify deploy --prod
```

**Environment Variables Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `NODE_ENV` - Set to `production`
- `NODE_VERSION` - Set to `20`

See [.env.netlify.example](./.env.netlify.example) for details.

### Database Providers

Choose a PostgreSQL provider:
- **Neon** (Recommended) - https://neon.tech
- **Supabase** - https://supabase.com
- **Railway** - https://railway.app
- **Render** - https://render.com

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (traditional)
- `npm run build:netlify` - Build for Netlify deployment
- `npm start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push database schema

## 🔧 Configuration

### Vite Configuration
See [vite.config.ts](./vite.config.ts)

### Netlify Configuration
See [netlify.toml](./netlify.toml)

### TypeScript Configuration
See [tsconfig.json](./tsconfig.json)

### Tailwind Configuration
See [tailwind.config.ts](./tailwind.config.ts)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

- **Deployment Issues**: See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)
- **Architecture Questions**: See [NETLIFY_ARCHITECTURE.md](./NETLIFY_ARCHITECTURE.md)
- **General Help**: Check documentation files

## 🎯 Roadmap

- [x] Basic report submission
- [x] Interactive map visualization
- [x] Zone management
- [x] Analytics dashboard
- [x] Netlify deployment support
- [ ] Mobile number authentication
- [ ] Role-based access control
- [ ] Report credibility scoring
- [ ] Abuse detection
- [ ] Mobile app (React Native)

## 📸 Screenshots

*Coming soon*

## 🙏 Acknowledgments

Built for local government bodies to effectively manage stray dog populations and improve public safety.

---

**Ready to deploy?** Start with [QUICK_START_NETLIFY.md](./QUICK_START_NETLIFY.md)
