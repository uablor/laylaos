// src/common/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DYNAMIC_ROLES_KEY } from 'src/common/decorators/dynamic-roles.decorator';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      DYNAMIC_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.roles) {
      throw new ForbiddenException('No roles found for user');
    }

    const hasRole = user.roles.some((role) =>
      requiredRoles.includes(role.name),
    );
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return true;
  }
}
