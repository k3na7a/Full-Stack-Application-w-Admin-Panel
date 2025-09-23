import { AxiosRequestConfig, AxiosResponse } from 'axios'

interface RequestConfig {
  content?: string
  token?: string | null
  params?: Record<string, any>
  data?: Record<string, any>
  withCredentials?: boolean
  csrfToken?: string
}

class AxiosService {
  public static parseResponse = <T>(DtoClass: new (data: any) => T) => {
    return (response: AxiosResponse): T => new DtoClass(response.data)
  }

  public static requestConfig = ({
    token,
    params,
    content,
    data,
    withCredentials = false,
    csrfToken
  }: RequestConfig): AxiosRequestConfig => {
    const headers: Record<string, string> = {}

    if (token) headers['Authorization'] = `Bearer ${token}`
    if (content) headers['Content-Type'] = content
    if (withCredentials && csrfToken) headers['X-CSRF-Token'] = csrfToken

    return {
      ...(params && {
        params,
        paramsSerializer: {
          indexes: null
        }
      }),
      ...(withCredentials && { withCredentials }),
      ...(Object.keys(headers).length && { headers }),
      ...(data && { data })
    }
  }
}

export { AxiosService }
