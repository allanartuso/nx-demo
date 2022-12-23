jest.mock('@ngdux/form', () => ({
  createFormState: jest.fn()
}));

import { createFormState } from '@ngdux/form';

describe('UserReducer', () => {
  it('creates the user reducer function correctly', () => {
    expect(createFormState).toHaveBeenCalledWith('user');
  });
});
