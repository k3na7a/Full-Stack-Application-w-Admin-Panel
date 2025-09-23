import { AxiosInstance } from 'axios'

import { AxiosService } from '@/shared/utils/axios.util'
import { UpdateEmailDto, UpdatePasswordDto } from '@lib/dto/user.dto'
import { IJWT, JWTDto } from '@lib/dto/JWT.dto'

class security {
  private readonly $api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.$api = api
  }

  public readonly updateEmail = async (payload: UpdateEmailDto, csrfToken: string): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>(
      'settings/security-and-privacy/email',
      payload,
      AxiosService.requestConfig({ withCredentials: true, csrfToken })
    )

    return new JWTDto(response.data)
  }

  public readonly updatePassword = async (payload: UpdatePasswordDto, csrfToken: string): Promise<JWTDto> => {
    const response = await this.$api.patch<IJWT>(
      'settings/security-and-privacy/password',
      payload,
      AxiosService.requestConfig({ withCredentials: true, csrfToken })
    )

    return new JWTDto(response.data)
  }

  public readonly deleteAccount = async (payload: { password: string }, csrfToken: string): Promise<void> => {
    await this.$api.delete<void>(
      'settings/security-and-privacy/delete-account',
      AxiosService.requestConfig({ data: payload, withCredentials: true, csrfToken })
    )
  }
}

export { security }
