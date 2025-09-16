import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PermissionEntity } from 'src/app/modules/users/entities/permission.entity';
import { PermissionService } from 'src/app/modules/users/services/permissions.service';

import { PaginationDto } from 'src/app/common/dto/pagination.dto';
import {
  CreatePermissionDto,
  PermissionPaginationOptions,
} from 'src/app/modules/users/dto/permission.dto';

@Injectable()
export class PermissionAdminService {
  constructor(private readonly service: PermissionService) {}

  public async create(dto: CreatePermissionDto): Promise<PermissionEntity> {
    return this.service.create(dto);
  }

  public async paginate(
    params: PermissionPaginationOptions,
  ): Promise<PaginationDto<PermissionEntity>> {
    return this.service.paginate(params);
  }

  public async findOneById(id: string): Promise<PermissionEntity> {
    return this.service.findOneById(id);
  }

  public async remove(id: string): Promise<PermissionEntity> {
    const permission = await this.service.findOneById(id);

    if (permission.isSystemPermission)
      throw new UnauthorizedException('System permissions cannot be removed.');

    return this.service.remove(permission.id);
  }

  public async update(
    id: string,
    dto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    const permission = await this.service.findOneById(id);

    if (permission.isSystemPermission)
      throw new UnauthorizedException('System permissions cannot be modified.');

    await this.service.update(permission.id, dto);
    return this.service.findOneById(permission.id);
  }
}
