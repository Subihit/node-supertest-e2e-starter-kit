import { HttpClient } from '../../core/httpClient';
import { RequestBuilder } from '../../core/requestBuilder';
import { ApiResponse } from '../../core/response';
import { BaseService } from '../base.service';
import { report } from '../../core/report';
import { CreateUserPayload, createUserPayload } from './user.payload';

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Service endpoints.
 * Keep all endpoint definitions here.
 */

const ENDPOINTS = {
  getCollections: '/app/collections/todos/records?limit=10',
  create: '/api/app-users/login'
} as const;


export class UserService extends BaseService<UserProfile> {
  private readonly rb: RequestBuilder;
  // store the last API response for verification helpers
  protected apiResponse!: ApiResponse<UserProfile>;

  constructor(client: HttpClient, token?: string) {
    super();

    let builder = new RequestBuilder(client);
    if (token) {
      builder = builder.withAuth(token);
    }
    this.rb = builder.asJson();
  }

  /* 
     Actions
   */

  async fetchMyProfile(): Promise<this> {
    await report.step('Fetch current user profile', async () => {
      const res = await this.rb.get(ENDPOINTS.getCollections);
      this.setResponse(new ApiResponse<UserProfile>(res));
    });

    return this;
  }

  async createUser(overrides?: Partial<CreateUserPayload>): Promise<this> {
  await report.step('Create user', async () => {
    const res = await this.rb.post(
      ENDPOINTS.getCollections,
      createUserPayload(overrides)
    );
    this.setResponse(new ApiResponse<UserProfile>(res));
  });

  return this;
}

  /*
     Verifications
   */

  verifyProfileIsAccessible(): this {
    report.step('Verify profile is accessible', () => {
      this.assert(() => {
        expect(this.apiResponse.status).toBe(200);
      });
    });

    return this;
  }

  verifyBasicProfileDetails(): this {
    report.step('Verify basic profile details', () => {
      this.assert(() => {
        expect(this.apiResponse.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            username: expect.any(String),
            email: expect.any(String)
          })
        );
      });
    });

    return this;
  }

  verifyUsername(expected: string): this {
    report.step(`Verify username is "${expected}"`, () => {
      this.assert(() => {
        expect(this.apiResponse.body.username).toBe(expected);
      });
    });

    return this;
  }

  verifyEmail(expected: string): this {
    report.step(`Verify email is "${expected}"`, () => {
      this.assert(() => {
        expect(this.apiResponse.body.email).toBe(expected);
      });
    });

    return this;
  }

  verifyName(firstName: string, lastName: string): this {
    report.step('Verify user full name', () => {
      this.assert(() => {
        expect(this.apiResponse.body.firstName).toBe(firstName);
        expect(this.apiResponse.body.lastName).toBe(lastName);
      });
    });

    return this;
  }
}
