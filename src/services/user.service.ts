// src/modules/User/services/User.service.ts
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserOrmEntity } from 'src/database/entities/user.orm-entity';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from 'src/dto/user.dto';
import { hashPassword } from 'src/common/utils/bcrypt.util';
import { PaginatedResponse } from 'src/common/interface/pagination.interface';
import { RelationConfig } from 'src/common/interface/relation-config.interface';
import { validateUniqueField } from 'src/common/utils/pass.notfound.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { RoleService } from './role.service';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { HotelService } from './hotel.service';
import { checkHasRoles } from 'src/common/utils/check-role.util';
@Injectable()
export class UserService {
  Load_relations: RelationConfig[] = [
    { relation: 'user.roles', alias: 'roles' },
    { relation: 'user.hotels', alias: 'hotels' },
    { relation: 'hotels.logo', alias: 'logo' },
  ];
  constructor(
    protected readonly repository: UserRepository,

    protected readonly roleService: RoleService,
    @Inject(forwardRef(() => HotelService))
    protected readonly hotelServer: HotelService,
  ) {}

  async findAll(): Promise<UserOrmEntity[]> {
    // const key = this.cache.getKey('user:findAll');
    // const cached = await this.cache.get<UserOrmEntity[]>(key);
    // if (cached) return cached;

    const users = await this.repository.findAll();
    // await this.cache.set(key, users, 300); // TTL 5 นาที
    return users;
  }

  async findEmail(email: string): Promise<UserOrmEntity | null> {
    const user = await this.repository.findOneByField(
      'email',
      email,
      this.Load_relations,
    );
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async findByEmail_ByLogin(email: string): Promise<UserOrmEntity> {
    const user = await this.repository.findOneByField(
      'email',
      email,
      this.Load_relations,
    );
    if (!user) throw new NotFoundException(`email or password is incorrect`);
    return user;
  }

  async findAllWithPagination(
    query: PaginationDto,
    authMe?: AuthPayload,
  ): Promise<PaginatedResponse<UserOrmEntity>> {
    // const key = this.cache.getKey('user:findAllWithPagination', query);
    // const cached = await this.cache.get<PaginatedResponse<UserOrmEntity>>(key);
    // if (cached) return cached;
    if (
      authMe.roles
        .map((role) => role.name)
        .includes(BaseRole.SUPER_ADMIN || BaseRole.ADMIN)
    )
      return this.repository.findAllWithPagination(query, this.Load_relations);
    const result = await this.repository.findAllWithPagination(
      query,
      this.Load_relations,
      authMe.hotels[0].id,
    );

    // await this.cache.set(key, result, 300);
    return result;
  }

  async findById(id: number): Promise<UserOrmEntity> {
    const User = await this.repository.findById(id, this.Load_relations);
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

    const isadminOruser = checkHasRoles(authMe.roles, [
      BaseRole.ADMIN_HOTEL,
      BaseRole.USER_HOTEL,
    ]);

    data.password = await hashPassword(data.password);

    const newUser = {
      ...data,
      is_active: true,
      hotels: [],
      roles: isSuperAdmin ? [] : [user_hotel],
    };

    if (data.admin_hotel) {
      const adminHotelRole = await this.roleService.findByName(
        BaseRole.ADMIN_HOTEL,
      );
      newUser.roles.push(adminHotelRole);
    }
    if (isadminOruser) {
      const hotel = await this.hotelServer.findById(authMe.hotels[0].id);
      return this.repository.save({ ...newUser, hotels: [hotel] });
    }

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
    // await this.cache.clear('user:*');
    return this.repository.save(userToUpdate);
  }

  async delete(id: number): Promise<string> {
    const User = await this.findById(id);
    const superAdmin = await this.roleService.findByName(BaseRole.SUPER_ADMIN);
    if (User.hotels && User.hotels.length > 0) {
      throw new BadRequestException('Cannot delete');
    }
    if (User.roles.some((role) => role.id === superAdmin.id)) {
      throw new UnauthorizedException('Cannot delete');
    }
    // await this.cache.clear('user:*');
    return this.repository.delete(id);
  }

  async updateActiveStatus(
    id: number,
    is_active: boolean,
  ): Promise<UserOrmEntity> {
    const User = await this.findById(id);
    const UserToUpdate = { ...User, is_active: is_active, id };
    await this.repository.save(UserToUpdate);
    // await this.cache.clear('user:*');
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

    if (authMe.roles.some((r) => r.name === BaseRole.ADMIN_HOTEL || r.name === BaseRole.USER_HOTEL)) {
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

  async changePassword(
    id: number,
    newPassword: UpdateUserPasswordDto,
    authme: AuthPayload,
  ): Promise<UserOrmEntity> {
    const user = await this.findById(id);
    const auth = await this.findById(authme.id);

    const [isSuperAdmin, isAdmin, isAdminHotel] = await Promise.all([
      Promise.resolve(auth.roles.some((r) => r.name === BaseRole.SUPER_ADMIN)),
      Promise.resolve(auth.roles.some((r) => r.name === BaseRole.ADMIN)),
      Promise.resolve(auth.roles.some((r) => r.name === BaseRole.ADMIN_HOTEL)),
    ]);

    // Check permissions
    const canChange =
      isSuperAdmin ||
      (isAdmin && !user.roles.some((r) => r.name === BaseRole.SUPER_ADMIN)) ||
      (isAdminHotel &&
        !user.roles.some(
          (r) => r.name === BaseRole.SUPER_ADMIN || r.name === BaseRole.ADMIN,
        ));

    if (!canChange) {
      throw new Error('You do not have permission to change this password.');
    }

    const hashedPassword = await hashPassword(newPassword.password);
    const userToUpdate = { ...user, password: hashedPassword, id };

    return this.repository.save(userToUpdate);
  }

  // -------------------------
  // CLEAR CACHE ON UPDATE
  // -------------------------
  // async clearUserCache(userId?: string) {
  //   const pattern = userId ? `user:*${userId}*` : 'user:*';
  //   await this.clearCache(pattern);
  // }
}
