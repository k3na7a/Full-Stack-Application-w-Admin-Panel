import { Injectable } from '@nestjs/common';
import { ImageEntity } from 'src/app/modules/media/entities/image.entity';
import { ImageService } from 'src/app/modules/media/services/image.service';

import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { ProfileService } from 'src/app/modules/users/services/profile.service';
import { UserService } from 'src/app/modules/users/services/users.service';

import { PaginationDto } from 'src/app/common/dto/pagination.dto';
import {
  UserPaginationOptions,
  UpdateUserDto,
} from 'src/app/modules/users/dto/user.dto';
import { IMAGE_TYPE } from 'src/app/modules/media/enums/image-routes.enum';
import { RoleService } from 'src/app/modules/users/services/roles.service';

@Injectable()
export class UserAdminService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly imageService: ImageService,
    private readonly roleService: RoleService,
  ) {}

  private async handleAvatar(
    user: UserEntity,
    file?: Express.Multer.File,
    removeAvatar?: boolean,
  ): Promise<ImageEntity | null> {
    const { avatar, id: profileId } = user.profile;
    const type = IMAGE_TYPE.AVATARS;

    if (removeAvatar && avatar) {
      await this.imageService.remove(avatar.id);
      return null;
    }

    if (file && !avatar) {
      return this.imageService.create({
        file,
        altText: `Avatar for profile ID ${profileId}`,
        type,
      });
    }

    if (file && avatar) {
      return this.imageService.update(avatar.id, {
        file,
        type,
        altText: avatar.altText,
      });
    }

    return null;
  }

  public async paginate(
    params: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.userService.paginate(params);
  }

  public async findOneById(id: string): Promise<UserEntity> {
    return this.userService.findOneById(id);
  }

  public async remove(id: string): Promise<UserEntity> {
    const user = await this.userService.findOneById(id);

    if (user.profile.avatar)
      await this.imageService.remove(user.profile.avatar.id);

    return this.userService.remove(id);
  }

  public async update(
    id: string,
    dto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    const user = await this.userService.findOneById(id);

    const { email, firstname, lastname } = dto;
    const name = { first: firstname, last: lastname };

    const avatar = file
      ? await this.handleAvatar(user, file, dto['remove-avatar'])
      : user.profile.avatar;
    await this.profileService.update(user.profile, { name, avatar });

    const roles = await this.roleService.findManyById(dto.roles);
    await this.userService.update(user.id, { email, roles });

    return this.userService.findOneById(user.id);
  }
}
