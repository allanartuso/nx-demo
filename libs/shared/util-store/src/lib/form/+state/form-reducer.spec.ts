jest.mock('@demo/shared/acm/data-access/common', () => ({
  createLoadingStateActionHandlers: jest.fn().mockReturnValue([]),
  createRequestStateActionHandlers: jest.fn().mockReturnValue([])
}));

import {
  createLoadingStateActionHandlers,
  createRequestStateActionHandlers
} from '@demo/shared/acm/data-access/common';
import { RequestState } from '@demo/shared/data-access';
import { CreateTestResource, createTestResourceDto, TestResourceDto, UpdateTestResource } from '../models/form.fixture';
import { FormState } from '../models/form.model';
import { createFormActions } from './form-actions';
import { createFormReducer } from './form-reducer';

describe('createFormReducer', () => {
  const testFormActions = createFormActions<TestResourceDto, CreateTestResource, UpdateTestResource>('testFeature');
  const testReducer = createFormReducer<TestResourceDto, CreateTestResource, UpdateTestResource>(testFormActions);
  let testInitialState: FormState<TestResourceDto>;
  let resource: TestResourceDto;

  beforeEach(() => {
    resource = createTestResourceDto();

    testInitialState = {
      resource: undefined,
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
      fieldErrors: {},
      bulkOperationSuccesses: []
    };
  });

  it('adds the request state action handlers to the reducer', () => {
    const action = testFormActions.load({ resourceId: resource.resourceId });

    testReducer(testInitialState, action);

    expect(createRequestStateActionHandlers).toHaveBeenCalledTimes(3);
    expect(createRequestStateActionHandlers).toHaveBeenCalledWith(
      testFormActions.load,
      testFormActions.save,
      testFormActions.saveSuccess,
      testFormActions.saveFailure
    );
    expect(createRequestStateActionHandlers).toHaveBeenCalledWith(
      undefined,
      testFormActions.delete,
      testFormActions.deleteSuccess,
      testFormActions.deleteFailure
    );
    expect(createRequestStateActionHandlers).toHaveBeenCalledWith(
      undefined,
      testFormActions.create,
      testFormActions.createSuccess,
      testFormActions.createFailure
    );
  });

  it('adds the loading state action handlers to the reducer', () => {
    const action = testFormActions.load({ resourceId: resource.resourceId });

    testReducer(testInitialState, action);

    expect(createLoadingStateActionHandlers).toHaveBeenCalledTimes(1);
    expect(createLoadingStateActionHandlers).toHaveBeenCalledWith(
      testFormActions.load,
      testFormActions.loadSuccess,
      testFormActions.loadFailure
    );
  });

  describe(testFormActions.loadSuccess.type, () => {
    it('sets the loaded resource', () => {
      const action = testFormActions.loadSuccess({ resource });

      const state: FormState<TestResourceDto> = testReducer(testInitialState, action);

      expect(state).toStrictEqual({ ...testInitialState, resource });
    });
  });

  describe(testFormActions.saveSuccess.type, () => {
    it('sets the saved resource', () => {
      const action = testFormActions.saveSuccess({ resource });

      const state: FormState<TestResourceDto> = testReducer(testInitialState, action);

      expect(state).toStrictEqual({ ...testInitialState, resource });
    });
  });

  describe(testFormActions.deleteSuccess.type, () => {
    it('sets the resource to undefined', () => {
      const action = testFormActions.deleteSuccess({ resourceId: resource.resourceId });
      const initialState: FormState<TestResourceDto> = {
        ...testInitialState,
        resource
      };

      const state: FormState<TestResourceDto> = testReducer(initialState, action);

      expect(state).toStrictEqual({ ...initialState, resource: undefined });
    });
  });

  describe(testFormActions.reset.type, () => {
    it('resets the state', () => {
      const action = testFormActions.reset();

      const state: FormState<TestResourceDto> = testReducer(
        {
          ...testInitialState,
          resource
        },
        action
      );

      expect(state).toStrictEqual(testInitialState);
    });
  });

  describe(testFormActions.copy.type, () => {
    it('sets loading state and request state to idle', () => {
      const action = testFormActions.copy();

      const state: FormState<TestResourceDto> = testReducer(
        {
          ...testInitialState,
          loadingState: RequestState.SUCCESS,
          requestState: RequestState.SUCCESS
        },
        action
      );

      expect(state).toStrictEqual({
        ...testInitialState,
        loadingState: RequestState.IDLE,
        requestState: RequestState.IDLE
      });
    });
  });
});
