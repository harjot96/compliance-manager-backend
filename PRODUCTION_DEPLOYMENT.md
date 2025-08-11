# Production Deployment Guide

## 🚀 Deploying to Production

This guide will help you deploy the backend to production with the correct environment configuration for [https://compliance-manager-frontend.onrender.com/](https://compliance-manager-frontend.onrender.com/).

## 📋 Prerequisites

1. **Database**: PostgreSQL database (e.g., on Render, Railway, or AWS RDS)
2. **Environment Variables**: All required environment variables configured
3. **Xero App Configuration**: Updated with production redirect URIs

## 🔧 Environment Variables

Create a `.env` file in production with these variables:

```env
# Server Configuration
NODE_ENV=production
PORT=3333

# Database Configuration
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=your-production-db-name
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password

# JWT Configuration
JWT_SECRET=your-production-jwt-secret

# Xero Configuration (if not stored in database)
XERO_CLIENT_ID=your-xero-client-id
XERO_CLIENT_SECRET=your-xero-client-secret

# Other configurations
SENDGRID_API_KEY=your-sendgrid-api-key
OPENAI_API_KEY=your-openai-api-key
```

## 🌐 Xero Developer Console Updates

### 1. Update Redirect URIs

In your Xero Developer Console, add these production redirect URIs:

- **Redirect URI**: `https://compliance-manager-frontend.onrender.com/redirecturl`
- **Callback URI**: `https://compliance-manager-frontend.onrender.com/xero-callback`

### 2. App Configuration

1. Go to [Xero Developer Console](https://developer.xero.com/app/manage)
2. Select your app
3. Go to "Configuration" tab
4. Add the production redirect URI
5. Save changes

## 🚀 Deployment Steps

### Option 1: Deploy to Render

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   ```
   Name: compliance-manager-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables**
   - Add all environment variables from the `.env` file
   - Set `NODE_ENV=production`

4. **Database**
   - Create a PostgreSQL database on Render
   - Add database environment variables

### Option 2: Deploy to Railway

1. **Connect Repository**
   - Go to [Railway Dashboard](https://railway.app/)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure Service**
   - Railway will auto-detect Node.js
   - Set start command: `npm start`

3. **Environment Variables**
   - Add all environment variables
   - Set `NODE_ENV=production`

### Option 3: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create App**
   ```bash
   heroku create your-app-name
   ```

3. **Add Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set DB_HOST=your-db-host
   # ... add all other variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔄 Database Migration

The database will be automatically migrated on deployment due to the `postinstall` script in `package.json`.

If manual migration is needed:

```bash
npm run migrate
```

## ✅ Verification Steps

### 1. Health Check
```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-08-10T18:30:00.000Z"
}
```

### 2. API Health Check
```bash
curl https://your-backend-url.com/api/health
```

### 3. Xero Integration Test
1. Go to your frontend: [https://compliance-manager-frontend.onrender.com/](https://compliance-manager-frontend.onrender.com/)
2. Try connecting to Xero
3. Verify OAuth flow works with production URLs

## 🔧 Production Configuration

### Environment Detection

The backend automatically detects the environment:

- **Development**: Uses `http://localhost:3001`
- **Production**: Uses `https://compliance-manager-frontend.onrender.com`

### CORS Configuration

Production CORS is already configured in `src/server.js` to allow:
- `https://compliance-manager-frontend.onrender.com`
- `https://compliance-manager-frontend.onrender.com/`
- `https://compliance-manager-frontend.onrender.com/redirecturl`
- `https://compliance-manager-frontend.onrender.com/xero-callback`

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify CORS configuration in `src/server.js`
   - Check that frontend URL is in allowed origins

2. **Database Connection**
   - Verify database environment variables
   - Check database is accessible from deployment platform

3. **Xero OAuth Issues**
   - Verify redirect URIs in Xero Developer Console
   - Check that `NODE_ENV=production` is set

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names

### Logs

Check deployment platform logs for errors:
- **Render**: Dashboard → Service → Logs
- **Railway**: Project → Service → Logs
- **Heroku**: `heroku logs --tail`

## 📞 Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all environment variables are set
3. Test the health endpoints
4. Verify Xero Developer Console configuration

## 🎉 Success Indicators

Your deployment is successful when:

1. ✅ Health check returns 200
2. ✅ Database migrations complete
3. ✅ Frontend can connect to backend
4. ✅ Xero OAuth flow works
5. ✅ Data fetching works with correct tenant ID

---

**Your backend is now ready for production deployment!** 🚀
