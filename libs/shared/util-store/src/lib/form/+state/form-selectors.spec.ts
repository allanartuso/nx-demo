import { ResourceDto } from '@arviem/shared/acm/data-access/common';
import { resourceDtoFixture } from '@arviem/shared/acm/data-access/common/test';
import { RequestState } from '@arviem/shared/data-access';
import { createFeatureSelector } from '@ngrx/store';
import { FormState } from '../models/form.model';
import { createFormSelectors } from './form-selectors';

describe('form selectors', () => {
  let state: FormState<ResourceDto>;

  const formSelectors = createFormSelectors(createFeatureSelector('testFeature'));

  beforeEach(() => {
    state = {
      resource: resourceDtoFixture.createPersistentResourceDto(),
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
      fieldErrors: {},
      bulkOperationSuccesses: [{ index: 2, response: '' }]
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
    expect(formSelectors.getFieldErrors.projector(state)).toBe(state.fieldErrors);
  });

  it('getBulkOperationSuccess', () => {
    expect(formSelectors.getBulkOperationSuccess.projector(state)).toBe(state.bulkOperationSuccesses);
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
