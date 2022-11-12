import { RequestState } from '@demo/shared/data-model';
import { createFeatureSelector } from '@ngrx/store';
import { createTestResource, TestResource } from '../../models/store.fixture';
import { FormState } from '../models/form.model';
import { createFormSelectors } from './form-selectors';

describe('form selectors', () => {
  let state: FormState<TestResource>;

  const formSelectors = createFormSelectors<FormState<TestResource>>(createFeatureSelector('testFeature'));

  beforeEach(() => {
    state = {
      resource: createTestResource(),
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
      error: undefined
    };
  });

  it('getResource', () => {
    expect(formSelectors.getResource.projector(state)).toBe(state.resource);
  });

  it('getRequestState', () => {
    expect(formSelectors.getRequestState.projector(state)).toBe(state.requestState);
  });

  it('getLoadingState', () => {
    expect(formSelectors.getLoadingState.projector(state)).toBe(state.loadingState);
  });

  it('getFieldErrors', () => {
    expect(formSelectors.getFieldErrors.projector(state)).toBe(state.error?.fieldErrors);
  });

  describe('isReady', () => {
    it('return true if the resource is defined and the request state is successful', () => {
      expect(formSelectors.isReady.projector(state.resource, RequestState.SUCCESS)).toBe(true);
    });

    it('return false if the resource is defined but the request state is not successful', () => {
      expect(formSelectors.isReady.projector(state.resource, RequestState.IDLE)).toBe(false);
    });

    it('return false if the request state is successful but the resource is undefined', () => {
      expect(formSelectors.isReady.projector(undefined, RequestState.SUCCESS)).toBe(false);
    });
  });
});
