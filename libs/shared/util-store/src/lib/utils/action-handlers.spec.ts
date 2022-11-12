import { ErrorDto, RequestState } from '@demo/shared/data-model';
import { Action, createAction, createReducer, props } from '@ngrx/store';
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
const saveFailureAction = createAction('[Action Handlers Test] Save Failure Action', props<{ error: ErrorDto }>());

// tslint:disable-next-line: no-empty-interface
interface TestState extends ApiRequestState, LoadingState {}

const initialTestState: TestState = {
  error: undefined,
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
        requestState: RequestState.IN_PROGRESS
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
    const errorDto: ErrorDto = {
      statusCode: 400,
      error: 'BAD_REQUEST',
      message: 'test message',
      fieldErrors: []
    };

    it('sets request state to failure', () => {
      const action = saveFailureAction({
        error: errorDto
      });
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({
        ...initialTestState,
        error: errorDto,
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
