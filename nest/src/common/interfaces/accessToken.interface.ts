import { UserEntity } from 'src/modules/users/entities/user.entity';

interface user {
  email: string;
  sub: string;
  iat: number;
  exp: number;
  userEntity: UserEntity;
  accessToken: string;
}

export interface AccessTokenRequest {
  user: user;
}
