# JWT Guard Middleware Usage Guide

## Overview

This JWT guard middleware provides authentication and authorization for your NestJS application using JSON Web Tokens.

## Files Created

- `src/strategies/jwt.strategy.ts` - JWT strategy for Passport.js
- `src/guards/jwt-auth.guard.ts` - JWT authentication guard
- `src/guards/roles.guard.ts` - Role-based authorization guard
- `src/decorators/roles.decorator.ts` - Roles decorator for authorization
- `src/controllers/protected.controller.ts` - Example protected endpoints

## Usage

### 1. Basic Authentication

To protect a route, use the `JwtAuthGuard`:

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UserController {

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // Contains authenticated user data
  }
}
```

### 2. Role-Based Authorization

To restrict access based on user roles:

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('admin')
export class AdminController {

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('dashboard')
  getAdminDashboard(@Request() req) {
    return { message: 'Admin dashboard', user: req.user };
  }
}
```

### 3. Multiple Roles

To allow access to users with any of the specified roles:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@Get('reports')
getReports(@Request() req) {
  return { reports: [], user: req.user };
}
```

## API Endpoints Examples

### Protected Routes Available:

1. **GET /protected/profile** - Requires valid JWT token
2. **POST /protected/data** - Requires valid JWT token
3. **GET /protected/admin** - Requires JWT token + admin role
4. **GET /protected/manager-or-admin** - Requires JWT token + admin or manager role

### Request Format:

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Request:

```bash
# Get user profile
curl -X GET http://localhost:3000/protected/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Admin only endpoint
curl -X GET http://localhost:3000/protected/admin \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Error Responses

### Invalid or Missing Token:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Insufficient Role Permissions:

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

## Environment Variables

Set these in your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key
```

## User Payload Structure

The JWT token contains the following user information:

```typescript
{
  sub: string,        // User ID
  email: string,      // User email
  firstName: string,  // User first name
  lastName: string,   // User last name
  iat: number,        // Issued at timestamp
  exp: number         // Expiration timestamp
}
```

## Integration with Existing Code

The JWT guard is already integrated into your `AuthModule` and can be used immediately. Make sure your user entity includes roles if you plan to use role-based authorization.