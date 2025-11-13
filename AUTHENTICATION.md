# Authentication Implementation

## Overview
This application now uses **JWT (JSON Web Token) authentication** to secure API endpoints while keeping read-only operations public.

## Security Model

### Public Endpoints (No Authentication Required)
- **GET** `/users` - View all users
- **GET** `/users/{id}` - View specific user
- **GET** `/sets` - View all sets
- **GET** `/sets/{id}` - View specific set
- **GET** `/numbers` - View all numbers
- **GET** `/categories` - View all categories
- **POST** `/global-exchanges` - View exchange opportunities
- **POST** `/set-exchanges` - View set-specific exchanges

### Protected Endpoints (Authentication Required)
All **POST**, **PATCH**, **PUT**, **DELETE** operations require authentication:
- User management (create, update, delete users)
- Set management (create, update, delete sets)
- Numbers management (add, update, remove numbers from collections)
- Category management (create, update categories)

## How It Works

### 1. User Login Flow
1. User clicks "Login with Google" in the UI
2. Google OAuth returns an ID token
3. Frontend sends the Google token to `/auth/google-login`
4. Backend verifies the Google token
5. Backend finds or creates the user in the database
6. Backend generates a JWT token
7. Frontend stores the JWT token in `localStorage`
8. Frontend includes the JWT in all subsequent requests

### 2. API Request Authentication
Every API request automatically includes the JWT token in the Authorization header:

```javascript
Authorization: Bearer <jwt-token>
```

### 3. Token Validation
- Tokens are valid for **7 days** by default
- Backend validates the token on every protected request
- If token is invalid/expired, the API returns **401 Unauthorized**
- Frontend automatically clears invalid tokens and prompts for re-login

## Configuration

### Environment Variables

#### Backend (collection-core)
```bash
# JWT Secret - CHANGE THIS IN PRODUCTION!
JWT_SECRET=your-secret-key-change-in-production

# JWT Expiration (default: 7 days)
JWT_EXPIRES_IN=7d

# Google Client ID (optional for development)
GOOGLE_CLIENT_ID=your-google-client-id

# Database connection
DATABASE_URL=postgresql://user:password@host:port/database
```

#### Frontend (collection-ui)
```bash
# Backend API URL
REACT_APP_SERVER_URI=http://localhost:3000
```

## Development Mode

For development without Google OAuth setup:
1. Leave `GOOGLE_CLIENT_ID` empty in backend environment
2. The auth endpoint will accept JSON tokens instead of Google tokens
3. Send user info as JSON string in the token field:
```javascript
{
  "token": "{\"email\":\"test@example.com\",\"name\":\"Test User\",\"picture\":\"\",\"sub\":\"12345\"}"
}
```

## User Authorization Rules

### Users can only:
- Modify their own profile
- Add/remove/update numbers in their own collections
- Delete their own account
- Create new sets (sets are global)

### Users CANNOT:
- Modify other users' profiles
- Access other users' private collection data
- Delete other users' accounts

## Code Structure

### Backend
```
src/
├── authentication-strategies/
│   ├── jwt.strategy.ts          # JWT authentication strategy
│   └── index.ts
├── services/
│   ├── jwt.service.ts            # JWT token generation/verification
│   └── index.ts
├── controllers/
│   ├── auth.controller.ts        # Google login endpoint
│   ├── users.controller.ts       # Protected user endpoints
│   ├── set.controller.ts         # Protected set endpoints
│   ├── numbers.controller.ts     # Protected numbers endpoints
│   └── ...
└── application.ts                # Authentication component registration
```

### Frontend
```
src/
├── actions/
│   ├── api.js                    # HTTP client with JWT header injection
│   └── users.js                  # Authentication actions
└── components/
    └── google-login/
        └── index.js              # Google login component
```

## Testing Authentication

### 1. Test Public Endpoints (Should Work Without Login)
```bash
curl http://localhost:3000/users
curl http://localhost:3000/sets
```

### 2. Test Protected Endpoints (Should Fail Without Token)
```bash
# This should return 401 Unauthorized
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","type":1}'
```

### 3. Test Protected Endpoints (Should Work With Token)
```bash
# First, login to get a token
TOKEN="<your-jwt-token>"

# This should work
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","type":1}'
```

## Security Best Practices

### ✅ Implemented
- JWT-based stateless authentication
- Google OAuth integration
- Token expiration (7 days)
- Authorization checks (users can only modify their own data)
- Automatic token refresh handling in UI
- Protected write operations

### ⚠️ Recommendations for Production
1. **Change JWT Secret**: Set a strong, random `JWT_SECRET` environment variable
2. **Use HTTPS**: Always use HTTPS in production
3. **Shorter Token Expiration**: Consider shorter token lifetimes (e.g., 1 hour) with refresh tokens
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **IP Whitelisting**: Restrict database access to known IPs
6. **Strong Database Password**: Change default database credentials
7. **Security Headers**: Add security headers (CORS, CSP, etc.)
8. **Audit Logging**: Log all authentication attempts and protected operations

## Troubleshooting

### "Authentication required" error
- Check if JWT token is stored in localStorage: `localStorage.getItem('auth')`
- Verify token hasn't expired
- Try logging out and back in

### "Forbidden" error when modifying data
- Ensure you're only modifying your own data
- Check that the userId matches your authenticated user ID

### Google login not working
- Verify `GOOGLE_CLIENT_ID` is set correctly
- Check Google OAuth configuration
- Look for errors in browser console

## Migration Notes

### For Existing Users
Existing users will need to:
1. Log in with Google after deployment
2. Their data will be preserved (matched by email)
3. They'll receive a JWT token for future requests

### Database Changes
No database schema changes required. The authentication is implemented at the application layer.


