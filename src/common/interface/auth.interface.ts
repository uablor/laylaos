import { RoleOrmEntity } from "src/database/entities/role.orm-entity";
import { UserOrmEntity } from "src/database/entities/user.orm-entity";

export interface RolePayload {
  id: number;
  name: string;
}

export interface AuthPayload {
  id: number;
  email: string;
  is_active: boolean;
  first_name: string;
  last_name: string;
  hotels: string[];
  roles: RolePayload[];
  iat?: number;
  exp?: number;
}

export interface AuthResult  {
  user: Omit<UserOrmEntity,'password' | 'createdAt' | 'updatedAt'>;
  access_token: string;
}