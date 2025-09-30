import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer';

import { storage } from 'src/config/storage.config';

import { PaginationDto } from 'src/common/dto/pagination.dto';

import { UserAdminService } from 'src/features/administration/users/services/users.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  UserPaginationOptions,
  UpdateUserDto,
} from 'src/modules/users/dto/user.dto';

import { ImageUploadValidationPipe } from 'src/common/pipes/image-upload.pipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import {
  PERMISSION_MATRIX,
  PermissionDomain,
} from '@lib/constants/permissions.constants';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiTags('Administration / User Management / Users')
@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
class UserAdminController {
  constructor(private readonly service: UserAdminService) {}

  @Get('')
  @ApiOkResponse({ type: PaginationDto<UserEntity> })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.USER_MANAGEMENT].READ_USER)
  async paginate(
    @Query() params: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.service.paginate(params);
  }

  @Get('/:id')
  @ApiOkResponse({ type: UserEntity })
  async getSingle(@Param('id') id: string): Promise<UserEntity> {
    return this.service.findOneById(id);
  }

  @Patch('/:id')
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserEntity })
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  @Permissions(PERMISSION_MATRIX[PermissionDomain.USER_MANAGEMENT].UPDATE_USER)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile(new ImageUploadValidationPipe({}))
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    return this.service.update(id, dto, file);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: UserEntity })
  @Permissions(PERMISSION_MATRIX[PermissionDomain.USER_MANAGEMENT].DELETE_USER)
  async delete(@Param('id') id: string): Promise<UserEntity> {
    return this.service.remove(id);
  }
}

export { UserAdminController };
