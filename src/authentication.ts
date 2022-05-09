import type { Canopy, CanopyOptions, CanopyError } from './'

export interface CanopyAuth {
  success: boolean,
  accessToken?: string,
  error?: CanopyError
}

export class AuthenticationApi {
  client: Canopy;
  accessToken?: string;

  constructor(client: Canopy, _options?: CanopyOptions) {
    this.client = client
    this.accessToken = undefined
  }

  /*
   * Function to look and see if we already have an accessToken for this
   * instance, and if so, then return it successfully, but if not, then
   * let's fetch one from the Canopy service for the provided credentials,
   * and then save it.
   */
  async checkToken(): Promise<CanopyAuth> {
    // if we already have a token, use it - we can't check it's expiration
    if (this.accessToken) {
      return { success: true, accessToken: this.accessToken }
    }
    // ...at this point, we know there is no token, so get one
    const resp = await this.getToken()
    if (!resp?.success) {
      return { ...resp, success: false }
    }
    // save the token we just got, and return the response
    this.accessToken = resp.accessToken
    return resp
  }

  /*
   * Function to force a refetching of the access token. Maybe it's expired,
   * or the credentials have changed, but for whatever reason, we need to
   * force a token refresh, and this function does just that.
   */
  async resetToken(): Promise<CanopyAuth> {
    this.accessToken = undefined
    return (await this.checkToken())
  }

  /*
   * Function to take a Client Id and Client Secret and return the token that
   * will be used as the Bearer token for all subsequent calls to the service.
   */
  async getToken(): Promise<CanopyAuth> {
    const resp = await this.client.fire(
      'POST',
      'auth/token',
      undefined,
      {
        client_id: this.client.clientId,
        client_secret: this.client.clientSecret,
      }
    )
    if (resp?.response?.status >= 400) {
      return {
        success: false,
        error: {
          type: 'canopy',
          ...resp?.payload?.error
        },
      }
    }
    return { ...resp.payload, success: true }
  }
}
