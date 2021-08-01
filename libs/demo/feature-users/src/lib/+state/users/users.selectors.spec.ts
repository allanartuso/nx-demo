jest.mock('@demo/acm/feature/common/list', () => ({
  createListEntityAdapter: jest.fn(),
  createListActions: jest.fn(),
  createListSelectors: jest.fn().mockReturnValue([]),
  createListReducer: jest.fn()
}));

import { createListSelectors } from '@demo/acm/feature/common/list';
import { listSelectors } from './users.selectors';

describe('list selectors', () => {
  it('should create', () => {
    expect(listSelectors).toBeDefined();
    expect(createListSelectors).toHaveBeenCalled();
  });
});
