import { HttpClient } from '../core/httpClient';
import { RequestBuilder } from '../core/requestBuilder';
import { ApiResponse } from '../core/response';
import { BaseService } from './base.service';
import { report } from '../core/report';

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export class UserService extends BaseService<UserProfile> {
  private readonly rb: RequestBuilder;

  constructor(client: HttpClient, token: string) {
    super();

    this.rb = new RequestBuilder(client)
      .withAuth(token)
      .asJson();
  }

  /* =========================
     Actions
     ========================= */

  async fetchMyProfile(): Promise<this> {
    await report.step('Fetch current user profile', async () => {
      const res = await this.rb.get('/users/me');
      this.setResponse(new ApiResponse<UserProfile>(res));
    });

    return this;
  }

  /* =========================
     Verifications
     ========================= */

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
