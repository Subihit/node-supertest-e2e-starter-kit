import { HttpClient } from '../core/httpClient';
import { RequestBuilder } from '../core/requestBuilder';
import { ApiResponse } from '../core/response';
import { report } from '../core/report';

type KeycloakTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
};

type UserRole = 'admin' | 'standard-user' | 'readonly-user';

type Credentials = {
  username: string;
  password: string;
};

const tokenCache: Partial<Record<UserRole, string>> = {};

export class AuthService {
  private readonly tokenEndpoint: string;

  constructor(private readonly client: HttpClient) {
    this.tokenEndpoint = `/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
  }

  /**
   * Public API
   */
  async loginAs(role: UserRole): Promise<string> {
    if (tokenCache[role]) {
      return tokenCache[role]!;
    }

    const creds = this.getCredentials(role);
    const token = await this.fetchToken(creds);

    tokenCache[role] = token;
    return token;
  }

  /**
   * Fetch token from Keycloak
   */
  private async fetchToken(creds: Credentials): Promise<string> {
    let response!: ApiResponse<KeycloakTokenResponse>;

    await report.step(`Authenticate as ${creds.username}`, async () => {
      const form = new URLSearchParams({
        grant_type: 'password',
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        username: creds.username,
        password: creds.password
      });

      // client_secret is optional (confidential clients)
      if (process.env.KEYCLOAK_CLIENT_SECRET) {
        form.append(
          'client_secret',
          process.env.KEYCLOAK_CLIENT_SECRET
        );
      }

      const rb = new RequestBuilder(this.client)
        .withHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        });

      const res = await rb.post(this.tokenEndpoint, form.toString());
      response = new ApiResponse<KeycloakTokenResponse>(res);
    });

    if (response.status !== 200) {
      // eslint-disable-next-line no-console
      console.error('Keycloak auth failed:', response.diagnostics);
      throw new Error(
        `Keycloak authentication failed for ${creds.username}`
      );
    }

    const token = response.body.access_token;

    if (!token) {
      throw new Error('Keycloak response missing access_token');
    }

    return token;
  }

  /**
   * Role → credentials
   */
  private getCredentials(role: UserRole): Credentials {
    switch (role) {
      case 'admin':
        return {
          username: process.env.KC_ADMIN_USERNAME!,
          password: process.env.KC_ADMIN_PASSWORD!
        };

      case 'standard-user':
        return {
          username: process.env.KC_USER_USERNAME!,
          password: process.env.KC_USER_PASSWORD!
        };

      case 'readonly-user':
        return {
          username: process.env.KC_READONLY_USERNAME!,
          password: process.env.KC_READONLY_PASSWORD!
        };

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
}


// KEYCLOAK_REALM=my-realm
// KEYCLOAK_CLIENT_ID=e2e-client
// KEYCLOAK_CLIENT_SECRET=secret   # optional

// KC_ADMIN_USERNAME=admin
// KC_ADMIN_PASSWORD=******
// KC_USER_USERNAME=user
// KC_USER_PASSWORD=******
// KC_READONLY_USERNAME=viewer
// KC_READONLY_PASSWORD=******
