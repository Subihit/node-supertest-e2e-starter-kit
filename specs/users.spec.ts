import { HttpClient } from '../core/httpClient';
import { UserService } from '../services/users.service';

describe('User API - E2E', () => {
  test('should fetch and verify user details', async () => {
    const user = new UserService(new HttpClient());

    await user
      .fetchMyProfile()

      user.verifyProfileIsAccessible()
      .verifyBasicProfileDetails()
      .verifyUsername('john_doe')
      .verifyEmail('john@example.com')
      .verifyName('John', 'Doe');
  });
});
