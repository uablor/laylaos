import { HotelOrmEntity } from "src/database/entities/hotel.orm-entity";
import { RoleOrmEntity } from "src/database/entities/role.orm-entity";
import { UserOrmEntity } from "src/database/entities/user.orm-entity";

export interface RolePayload {
  id: number;
  name: string;
}
export interface HotelPayload {
  id: number;
  name: string;
  logo:string;
}

export interface AuthPayload {
  id: number;
  email: string;
  is_active: boolean;
  first_name: string;
  last_name: string;
  hotels: HotelPayload[];
  roles: RolePayload[];
  iat?: number;
  exp?: number;
}

export interface AuthResult  {
  user: Omit<UserOrmEntity,'password' | 'createdAt' | 'updatedAt'>;
  access_token: string;
}