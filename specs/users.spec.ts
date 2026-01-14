import { HttpClient } from '../core/httpClient';
import { UserService } from '../services/user/users.service';

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
  }),

  test('should create and verify a new user', async () => {
    const user = new UserService(new HttpClient());

    await user
      .createUser({
        email: 'john2@example.com',
        project_id: 'project_123'
      })
  });
});
