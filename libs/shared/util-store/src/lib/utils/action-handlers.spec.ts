import { RequestState } from '@demo/shared/data-access';
import { Action, createAction, createReducer, props } from '@ngrx/store';
import { ErrorsDto } from '../models/errors.dto';
import { ErrorsVm } from '../models/errors.model';
import { GeneralErrorCode } from '../models/general-error-codes';
import {
  ApiRequestState,
  createLoadingStateActionHandlers,
  createRequestStateActionHandlers,
  getLastPageNumber,
  LoadingState
} from './action-handlers';

const loadAction = createAction('[Action Handlers Test] Load Action');
const loadSuccessAction = createAction('[Action Handlers Test] Load Success Action');
const loadFailureAction = createAction('[Action Handlers Test] Load Failure Action');

const saveAction = createAction('[Action Handlers Test] Save Action');
const saveSuccessAction = createAction('[Action Handlers Test] Save Success Action');
const saveFailureAction = createAction('[Action Handlers Test] Save Failure Action', props<{ error: ErrorsVm }>());

// tslint:disable-next-line: no-empty-interface
interface TestState extends ApiRequestState, LoadingState {}

const initialTestState: TestState = {
  fieldErrors: {},
  requestState: RequestState.IDLE,
  loadingState: RequestState.IDLE
};

const reducer = createReducer(
  initialTestState,
  ...createRequestStateActionHandlers<TestState>(loadAction, saveAction, saveSuccessAction, saveFailureAction),
  ...createLoadingStateActionHandlers<TestState>(loadAction, loadSuccessAction, loadFailureAction)
);

function testReducer(state: TestState, action: Action): TestState {
  return reducer(state, action);
}

describe('actionHandlers testReducer', () => {
  describe(loadAction.type, () => {
    it('sets loading state to in progress', () => {
      const action = loadAction();
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({
        ...initialTestState,
        loadingState: RequestState.IN_PROGRESS,
        requestState: RequestState.IDLE
      });
    });
  });

  describe(loadSuccessAction.type, () => {
    it('sets loading state to success', () => {
      const action = loadSuccessAction();
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({ ...initialTestState, loadingState: RequestState.SUCCESS });
    });
  });

  describe(loadFailureAction.type, () => {
    it('sets loading state to failure', () => {
      const action = loadFailureAction();
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({ ...initialTestState, loadingState: RequestState.FAILURE });
    });
  });

  describe(saveAction.type, () => {
    it('sets request state to in progress and clean up the previous errors', () => {
      const action = saveAction();
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({
        ...initialTestState,
        requestState: RequestState.IN_PROGRESS,
        fieldErrors: {},
        bulkOperationSuccesses: undefined
      });
    });
  });

  describe(saveSuccessAction.type, () => {
    it('sets request state to success', () => {
      const action = saveSuccessAction();
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({ ...initialTestState, requestState: RequestState.SUCCESS });
    });
  });

  describe(saveFailureAction.type, () => {
    const errorsDto: ErrorsDto = {
      generalErrors: [{ code: GeneralErrorCode.RESOURCE_NOT_FOUND, message: 'testError', arguments: [] }],
      fieldErrors: []
    };

    it('sets request state to failure', () => {
      const action = saveFailureAction({
        error: new ErrorsVm(errorsDto.generalErrors)
      });
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({
        ...initialTestState,
        fieldErrors: {},
        bulkOperationSuccesses: [],
        requestState: RequestState.FAILURE
      });
    });
  });
});

describe('getLastPageNumber', () => {
  it('return the previous page number if the current page is empty', () => {
    const page = 3;

    const lastPageNumber = getLastPageNumber([], { page, pageSize: 5 });

    expect(lastPageNumber).toBe(page - 1);
  });

  it('return the current page number if the current page length is smaller then the page size', () => {
    const page = 3;

    const lastPageNumber = getLastPageNumber([''], { page, pageSize: 5 });

    expect(lastPageNumber).toBe(page);
  });
});
