/*
 The following payloads are meant to serve as examples 
 and should be used in corresponding services.
*/

// create user
export type CreateUserPayload = {
  email: string;
  project_id: string;
//   role: 'admin' | 'user';
};

export function createUserPayload(
  overrides: Partial<CreateUserPayload> = {}
): CreateUserPayload {
  return {
    email: 'user@example.com',
    project_id: 'random_project_id',
    // role: 'user',
    ...overrides
  };
}

// update user
export type UpdateUserPayload = {
  email?: string;
  firstName?: string;
  lastName?: string;
};

export function updateUserPayload(
  overrides: Partial<UpdateUserPayload> = {}
): UpdateUserPayload {
  return {
    email: 'updated@example.com',
    firstName: 'Updated',
    lastName: 'User',
    ...overrides
  };
}


