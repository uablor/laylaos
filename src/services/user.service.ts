// src/modules/User/services/User.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserOrmEntity } from 'src/database/entities/user.orm-entity';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { hashPassword } from 'src/common/utils/bcrypt.util';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { validateUniqueField } from 'src/common/utils/pass.notfound.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { RoleOrmEntity } from 'src/database/entities/role.orm-entity';
import { RoleService } from './role.service';
import { BaseRole } from 'src/common/enum/base.role.enum';

@Injectable()
export class UserService {
  constructor(
    protected readonly repository: UserRepository,
    protected readonly roleService: RoleService,
  ) {}

  async findAll(): Promise<UserOrmEntity[]> {
    return await this.repository.findAll();
  }

  async findEmail(email: string): Promise<UserOrmEntity | null> {
    const user = await this.repository.findOneByField('email', email, [
      { relation: 'user.roles', alias: 'roles' },
      { relation: 'user.hotels', alias: 'hotels' },
    ]);
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async findByEmail_ByLogin(email: string): Promise<UserOrmEntity> {
    const user = await this.repository.findOneByField('email', email, [
      { relation: 'user.roles', alias: 'roles' },
      { relation: 'user.hotels', alias: 'hotels' },
    ]);
    if (!user) throw new NotFoundException(`email or password is incorrect`);
    return user;
  }

  async findAllWithPagination(
    query: PaginationDto,
  ): Promise<PaginatedResponse<UserOrmEntity>> {
    const relations: RelationConfig[] = [
      { relation: 'user.roles', alias: 'roles' },
      { relation: 'user.hotels', alias: 'hotels' },
    ];
    return this.repository.findAllWithPagination(query, relations);
  }

  async findById(id: number): Promise<UserOrmEntity> {
    const User = await this.repository.findById(id, [
      { relation: 'user.roles', alias: 'roles' },
      { relation: 'user.hotels', alias: 'hotels' },
    ]);
    if (!User) throw new NotFoundException(`User ${id} not found`);
    return User;
  }

  async create(
    data: CreateUserDto,
    authMe: AuthPayload,
  ): Promise<UserOrmEntity> {
    await validateUniqueField(
      async () => await this.repository.findOneByField('email', data.email),
      `User with email ${data.email} already exists`,
    );
    const user_hotel = await this.roleService.findByName(BaseRole.USER_HOTEL);
    const isSuperAdmin = await this.validateRole(authMe);

    const hashedPassword = await hashPassword(data.password);
    data.password = hashedPassword;

    const newUser = {
      ...data,
      is_active: true,
      roles: isSuperAdmin ? [] : [user_hotel],
    };
    return this.repository.save(newUser);
  }

  async update(
    id: number,
    data: UpdateUserDto,
    authMe: AuthPayload,
  ): Promise<UserOrmEntity> {
    const user = await this.findById(id);

    await validateUniqueField(async () => {
      const existingUser = await this.repository.findOneByField(
        'email',
        data.email,
      );
      return existingUser && existingUser.id !== id ? existingUser : null;
    }, `User with email already exists`);

    const isAdmin = await this.validateRole(authMe);
    let password = user.password;
    if (isAdmin && data.password) {
      password = await hashPassword(data.password);
    }
    const userToUpdate = { ...user, ...data, password, id };
    if (!isAdmin) {
      delete userToUpdate.password;
    }

    return this.repository.save(userToUpdate);
  }
  async delete(id: number): Promise<string> {
    const User = await this.findById(id);
    const superAdmin = await this.roleService.findByName(BaseRole.SUPER_ADMIN);
    if (User.hotels && User.hotels.length > 0) {
      throw new BadRequestException(
        'Cannot delete',
      );
    }
    if (User.roles.some((role) => role.id === superAdmin.id)) {
      throw new UnauthorizedException('Cannot delete');
    }
    return this.repository.delete(id);
  }

  async updateActiveStatus(
    id: number,
    is_active: boolean,
  ): Promise<UserOrmEntity> {
    const User = await this.findById(id);
    const UserToUpdate = { ...User, is_active: is_active, id };
    await this.repository.save(UserToUpdate);
    return UserToUpdate;
  }

  async validateRole(authMe: AuthPayload): Promise<boolean> {
    if (
      authMe.roles.some(
        (r) => r.name === BaseRole.SUPER_ADMIN || r.name === BaseRole.ADMIN,
      )
    ) {
      return true;
    }

    if (authMe.roles.some((r) => r.name === BaseRole.ADMIN_HOTEL)) {
      return false;
    }
    throw new UnauthorizedException(
      'You do not have permission to create users',
    );

    // if (authMe.roles.some((r) => r.name === BaseRole.SUPER_ADMIN)) {
    //   allowedRoles = [
    //     BaseRole.SUPER_ADMIN,
    //     BaseRole.ADMIN,
    //     BaseRole.ADMIN_HOTEL,
    //     BaseRole.USER_HOTEL,
    //   ];
    // } else if (authMe.roles.some((r) => r.name === BaseRole.ADMIN)) {
    //   allowedRoles = [
    //     BaseRole.ADMIN,
    //     BaseRole.ADMIN_HOTEL,
    //     BaseRole.USER_HOTEL,
    //   ];
    // } else if (authMe.roles.some((r) => r.name === BaseRole.ADMIN_HOTEL)) {
    //   allowedRoles = [BaseRole.USER_HOTEL];
    // } else {
    //   throw new UnauthorizedException(
    //     'You do not have permission to create users',
    //   );
    // }

    // if (requestedRoles && requestedRoles.length > 0) {
    //   const invalidRoles = requestedRoles.filter(
    //     (r) => !allowedRoles.includes(r.name),
    //   );

    //   if (invalidRoles.length > 0) {
    //     throw new UnauthorizedException(
    //       `You cannot assign roles: ${invalidRoles
    //         .map((r) => r.name)
    //         .join(', ')}`,
    //     );
    //   }
    //   return true;
    // }
  }
}
