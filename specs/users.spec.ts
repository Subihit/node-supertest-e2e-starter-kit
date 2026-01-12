import { HttpClient } from '../core/httpClient';
import { UserService } from '../services/users.service';

describe('User API - E2E', () => {
  test('should fetch and verify user details', async () => {
    const user = new UserService(new HttpClient());

    await user
      .getUser('123')
      .verifyStatus(200)
      .verifyRequiredFields()
      .verifyName('John')
      .verifyEmail('john@example.com');
  });
});
