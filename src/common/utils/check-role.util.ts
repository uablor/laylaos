// src/common/utils/role.util.ts
import { BaseRole } from 'src/common/enum/base.role.enum';
import { RolePayload } from '../interface/auth.interface';

export const checkHasRoles = (
  authMeRoles: RolePayload[],
  allowedRoles: BaseRole[],
): boolean => {
  const roleNames = authMeRoles.map((r) => r.name);
  return allowedRoles.some((role) => roleNames.includes(role));
};
