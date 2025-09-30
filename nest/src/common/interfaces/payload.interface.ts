import { UserEntity } from 'src/modules/users/entities/user.entity';

export interface Payload {
  email: string;
  sub: string;
}

export interface AccessTokenValidationPayload {
  accessToken: string;
  userEntity: UserEntity;
  email: string;
  sub: string;
}
