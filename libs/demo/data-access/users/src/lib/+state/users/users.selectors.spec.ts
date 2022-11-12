jest.mock('@demo/shared/util-store', () => ({
  createListEntityAdapter: jest.fn(),
  createListActions: jest.fn(),
  createListSelectors: jest.fn().mockReturnValue([]),
  createListReducer: jest.fn()
}));

import { createListSelectors } from '@demo/shared/util-store';
import { listSelectors } from './users.selectors';

describe('list selectors', () => {
  it('should create', () => {
    expect(listSelectors).toBeDefined();
    expect(createListSelectors).toHaveBeenCalled();
  });
});
