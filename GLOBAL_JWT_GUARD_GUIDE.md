# Global Guards Guide (JWT + Roles)

## Overview

ทั้ง JWT Guard และ Roles Guard ถูกตั้งค่าเป็น global แล้ว! ทุก API endpoints จะถูกป้องกันด้วย JWT token และสามารถตรวจสอบสิทธิ์ผู้ใช้ได้โดยอัตโนมัติ

## การตั้งค่าที่ทำไป

### 1. Global JWT Guard + Roles Guard
- ตั้งค่าใน `src/main.ts` โดยใช้ `app.useGlobalGuards()`
- **ทั้งสอง guards เป็น global**: JwtAuthGuard และ RolesGuard
- ทุก routes จะถูกป้องกันด้วย JWT โดยอัตโนมัติ
- ทุก routes สามารถตรวจสอบ roles ได้โดยอัตโนมัติ

### 2. Public Decorator
- สร้าง `@Public()` decorator สำหรับข้ามการตรวจสอบ JWT
- ใช้สำหรับ endpoints ที่ไม่ต้องการ authentication (login, register, public info)

### 3. Enhanced Guards
- JWT Guard รองรับ public routes ผ่าน Reflector
- Roles Guard ทำงานร่วมกับ JWT Guard อย่างสมบูรณ์

## API Endpoints ปัจจุบัน

### Public Endpoints (ไม่ต้องใช้ JWT token):

1. **POST /api/auth/login**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password"}'
   ```

2. **POST /api/auth/register**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password", "first_name": "John", "last_name": "Doe"}'
   ```

3. **GET /api/protected/public-info**
   ```bash
   curl -X GET http://localhost:3000/api/protected/public-info
   ```

### Protected Endpoints (ต้องใช้ JWT token):

1. **GET /api/protected/profile**
   ```bash
   curl -X GET http://localhost:3000/api/protected/profile \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **POST /api/protected/data**
   ```bash
   curl -X POST http://localhost:3000/api/protected/data \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Data"}'
   ```

### Role-Based Protected Endpoints:

1. **GET /api/protected/admin** (ต้องมี role 'admin')
   ```bash
   curl -X GET http://localhost:3000/api/protected/admin \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **GET /api/protected/manager-or-admin** (ต้องมี role 'admin' หรือ 'manager')
   ```bash
   curl -X GET http://localhost:3000/api/protected/manager-or-admin \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## การใช้งานใน Controller

### สำหรับ Protected Routes (default behavior):
```typescript
@Controller('users')
export class UserController {
  @Get('profile')  // ต้องการ JWT token อัตโนมัติ
  getProfile(@Request() req) {
    return req.user;
  }
}
```

### สำหรับ Public Routes:
```typescript
@Controller('public')
export class PublicController {
  @Public()  // ข้ามการตรวจสอบ JWT
  @Get('info')
  getPublicInfo() {
    return { message: 'Public information' };
  }
}
```

### สำหรับ Role-Based Routes (Global RolesGuard):
```typescript
@Controller('admin')
export class AdminController {
  @Roles('admin')  // ต้องมี JWT + role 'admin' (อัตโนมัติ)
  @Get('dashboard')
  getDashboard() {
    return { message: 'Admin dashboard' };
  }

  @Roles('admin', 'manager')  // ต้องมี JWT + role 'admin' หรือ 'manager'
  @Get('reports')
  getReports() {
    return { reports: [] };
  }
}
```

## Error Messages

### 1. ไม่มี Token หรือ Token ไม่ถูกต้อง:
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

### 2. ไม่มีสิทธิ์เข้าถึง (role ไม่ตรง):
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

## ข้อดีของ Global Guards:

1. **ความปลอดภัยสูงสุด**: ลืมใส่ @UseGuards() ไม่ได้ - ทุก routes ถูกป้องกันโดย default
2. **ลดการเขียน code**: ไม่ต้องใส่ @UseGuards() ทั้ง JwtAuthGuard และ RolesGuard
3. **ความสม่ำเสมอ**: มีมาตรฐานการ authentication & authorization ที่เหมือนกันทั้งระบบ
4. **ง่ายต่อการจัดการ**: Public routes ชัดเจนด้วย @Public() decorator
5. **Role-based อัตโนมัติ**: แค่ใส่ @Roles() ก็ทำงานได้เลย

## หมายเหตุ:
- อย่าลืมใส่ @Public() decorator สำหรับ endpoints ที่จริงๆ แล้วต้องเป็น public (login, register, health check, etc.)
- User entity ควรมีฟิลด์ roles ถ้าต้องการใช้ role-based authorization
- ตั้งค่า JWT_SECRET ใน environment variables ให้ปลอดภัย