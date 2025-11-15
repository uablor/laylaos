// src/common/decorators/dynamic-roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const DYNAMIC_ROLES_KEY = 'dynamic_roles';
export const DynamicRoles = (...roles: string[]) =>
  SetMetadata(DYNAMIC_ROLES_KEY, roles);
