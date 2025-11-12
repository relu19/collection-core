# Deployment Checklist

## ⚠️ Before Deploying to Production

### 1. Environment Variables (CRITICAL)

#### Backend
Create a `.env` file or set environment variables:

```bash
# CRITICAL: Change this to a strong random secret!
JWT_SECRET=<generate-a-strong-random-secret>
# Example: openssl rand -base64 32

# Token expiration (optional, default: 7d)
JWT_EXPIRES_IN=7d

# Google OAuth Client ID (get from Google Cloud Console)
GOOGLE_CLIENT_ID=<your-google-client-id>

# Database connection
DATABASE_URL=postgresql://username:password@host:port/database

# Server configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

#### Frontend
```bash
# Backend API URL
REACT_APP_SERVER_URI=https://your-api-domain.com
```

### 2. Database Security

- [ ] Change default database password from 'admin'
- [ ] Use strong passwords (minimum 16 characters, mixed case, numbers, symbols)
- [ ] Restrict database network access to application server IPs only
- [ ] Enable SSL/TLS for database connections
- [ ] Regular database backups
- [ ] Remove hardcoded credentials from `postgres.datasource.ts`

### 3. Application Security

- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS/SSL for all connections
- [ ] Set up proper CORS configuration
- [ ] Add rate limiting (e.g., express-rate-limit)
- [ ] Add security headers (helmet.js)
- [ ] Set up error logging (don't expose stack traces)
- [ ] Implement refresh tokens (optional but recommended)
- [ ] Add audit logging for sensitive operations

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins
6. Add authorized redirect URIs
7. Copy Client ID to environment variables

### 5. Testing Checklist

- [ ] Test Google login flow
- [ ] Test protected endpoints require authentication
- [ ] Test users can only modify their own data
- [ ] Test public endpoints remain accessible
- [ ] Test token expiration handling
- [ ] Test invalid token handling
- [ ] Test logout functionality
- [ ] Test with multiple concurrent users
- [ ] Load testing for API endpoints

### 6. Monitoring

- [ ] Set up application logging
- [ ] Monitor failed authentication attempts
- [ ] Set up alerts for unusual activity
- [ ] Track API usage and errors
- [ ] Database connection monitoring
- [ ] Server resource monitoring

## Quick Start Commands

### Development

```bash
# Backend
cd collection-core
npm install
npm start

# Frontend
cd collection-ui
npm install
npm start
```

### Production Build

```bash
# Backend
cd collection-core
npm install --production
npm run build
npm start

# Frontend
cd collection-ui
npm install
REACT_APP_SERVER_URI=https://api.yourdomain.com npm run build
# Deploy 'build' folder to web server
```

## Verification Steps

After deployment:

1. **Test Public Access**:
   ```bash
   curl https://your-api.com/users
   # Should return list of users
   ```

2. **Test Protected Access Without Auth**:
   ```bash
   curl -X POST https://your-api.com/users \
     -H "Content-Type: application/json" \
     -d '{"name":"Test"}'
   # Should return 401 Unauthorized
   ```

3. **Test Google Login**:
   - Visit your application
   - Click "Login with Google"
   - Verify successful login
   - Check localStorage contains 'auth' with token

4. **Test Protected Operations**:
   - Login to app
   - Try creating a set
   - Try updating your profile
   - Try deleting a number from your collection
   - All should work

5. **Test Authorization**:
   - Login as User A
   - Try to modify User B's data via API
   - Should get 403 Forbidden

## Common Issues

### "Authentication required" error
- JWT_SECRET not set or different between app restarts
- Token expired (check JWT_EXPIRES_IN)
- localStorage cleared
- **Solution**: Re-login

### "Forbidden" error
- User trying to modify someone else's data
- **Solution**: Only modify your own data

### Google login not working
- GOOGLE_CLIENT_ID not set
- Invalid OAuth configuration
- Redirect URI not authorized
- **Solution**: Check Google Cloud Console settings

### Database connection fails
- Wrong DATABASE_URL
- Network/firewall blocking connection
- Database not running
- **Solution**: Verify connection string and network access

### CORS errors in browser
- Backend not allowing frontend origin
- **Solution**: Configure CORS in application.ts

## Support

For issues or questions:
1. Check `AUTHENTICATION.md` for detailed documentation
2. Check `SECURITY_CHANGES.md` for implementation details
3. Review application logs
4. Check browser console for frontend errors

## Security Contact

If you discover a security vulnerability:
1. DO NOT create a public issue
2. Email security contact directly
3. Include steps to reproduce
4. Allow reasonable time for fix before disclosure

