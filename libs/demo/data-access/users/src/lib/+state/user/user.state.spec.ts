jest.mock('@ngdux/form', () => ({
  createFormState: jest.fn().mockReturnValue([])
}));

import { createFormState } from '@ngdux/form';
import { USER_FEATURE_KEY } from './user.state';

describe('User state', () => {
  it('creates the user state function correctly', () => {
    expect(createFormState).toHaveBeenCalledWith(USER_FEATURE_KEY);
  });
});
