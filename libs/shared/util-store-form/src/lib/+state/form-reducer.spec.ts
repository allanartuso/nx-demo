import { RequestState } from '@demo/shared/data-model/common';
import { createLoadingStateActionHandlers, createRequestStateActionHandlers } from '@demo/shared/util-store-common';
import { createTestResource, TestResource } from '@demo/shared/util-store-common/test';
import { FormState } from '../models/form.model';
import { createFormActions } from './form-actions';
import { createFormReducer } from './form-reducer';

jest.mock('../common/utils/action-handlers', () => ({
  createLoadingStateActionHandlers: jest.fn().mockReturnValue([]),
  createRequestStateActionHandlers: jest.fn().mockReturnValue([])
}));

describe('createFormReducer', () => {
  const testFormActions = createFormActions<TestResource, string[]>('testFeature');
  const testReducer = createFormReducer<TestResource, string[]>(testFormActions);
  let testInitialState: FormState<TestResource, string[]>;
  let resource: TestResource;

  beforeEach(() => {
    resource = createTestResource();

    testInitialState = {
      resource: undefined,
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
      errors: undefined
    };
  });

  it('adds the request state action handlers to the reducer', () => {
    const action = testFormActions.load({ id: resource.id });

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
    const action = testFormActions.load({ id: resource.id });

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

      const state: FormState<TestResource, string[]> = testReducer(testInitialState, action);

      expect(state).toStrictEqual({ ...testInitialState, resource });
    });
  });

  describe(testFormActions.saveSuccess.type, () => {
    it('sets the saved resource', () => {
      const action = testFormActions.saveSuccess({ resource });

      const state: FormState<TestResource, string[]> = testReducer(testInitialState, action);

      expect(state).toStrictEqual({ ...testInitialState, resource });
    });
  });

  describe(testFormActions.deleteSuccess.type, () => {
    it('sets the resource to undefined', () => {
      const action = testFormActions.deleteSuccess({ id: resource.id });
      const initialState: FormState<TestResource, string[]> = {
        ...testInitialState,
        resource
      };

      const state: FormState<TestResource, string[]> = testReducer(initialState, action);

      expect(state).toStrictEqual({ ...initialState, resource: undefined });
    });
  });

  describe(testFormActions.reset.type, () => {
    it('resets the state', () => {
      const action = testFormActions.reset();

      const state: FormState<TestResource, string[]> = testReducer(
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

      const state: FormState<TestResource, string[]> = testReducer(
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
