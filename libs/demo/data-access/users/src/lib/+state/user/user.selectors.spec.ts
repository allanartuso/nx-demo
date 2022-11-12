jest.mock('@demo/shared/util-store', () => ({
  createFormActions: jest.fn(),
  createFormSelectors: jest.fn().mockReturnValue({}),
  createFormReducer: jest.fn()
}));

import { createFormSelectors } from '@demo/shared/util-store';
import { formSelectors } from './user.selectors';

describe('form selectors', () => {
  it('should create', () => {
    expect(formSelectors).toBeDefined();
    expect(createFormSelectors).toHaveBeenCalled();
  });
});
